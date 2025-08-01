import {
  ActionPanel,
  Action,
  List,
  Icon,
  open,
  showToast,
  Toast,
  getPreferenceValues,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { exec } from "child_process";
import { promisify } from "util";
import fs from 'fs';
import path from 'path';
import os from 'os';
import bplist from 'bplist-parser';

const execAsync = promisify(exec);

interface WindowArrangement {
  name: string;
}

interface Preferences {
  iterm2Path?: string;
}

export default function Command() {
  const [arrangements, setArrangements] = useState<WindowArrangement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const preferences = getPreferenceValues<Preferences>();

  useEffect(() => {
    loadArrangements();
  }, []);

  /**
   * Expands a path starting with ~ to the user's home directory.
   * @param {string} filePath - The file path, possibly starting with ~
   * @returns {string} - The expanded file path
   */
  function expandHome(filePath: string) {
    if (filePath.startsWith('~')) {
      return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
  }

  /**
   * Gets the key names of the "Window Arrangements" property in the given plist file.
   * @param {string} plistPath - Path to the plist file
   * @returns {Promise<string[]>} - Array of key names
   */
  async function getWindowArrangementsKeys(plistPath: string) {
    const expandedPath = expandHome(plistPath);
    const buffer = await fs.promises.readFile(expandedPath);
    const data = bplist.parseBuffer(buffer);
    const plistObject = data[0];

    if (
      plistObject &&
      plistObject['Window Arrangements'] &&
      typeof plistObject['Window Arrangements'] === 'object'
    ) {
      return Object.keys(plistObject['Window Arrangements']);
    }
    return [];
  }

  /**
   * Loads the window arrangements from the iTerm2 plist file.
   */
  async function loadArrangements() {
    try {
      setIsLoading(true);
      setError(null);

      const names = await getWindowArrangementsKeys('~/Library/Preferences/com.googlecode.iterm2.plist');

      const arrangementsList: WindowArrangement[] = names
        .map((name, index) => ({
          name: name.trim(),
          id: index,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setArrangements(arrangementsList);
    } catch (err) {
      console.error("Error loading arrangements:", err);
      setError("Failed to load window arrangements. Make sure iTerm2 is running.");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Checks if iTerm2 is running.
   * @returns {Promise<boolean>} - True if iTerm2 is running, false otherwise.
   */
  async function checkIfiTerm2IsRunning(): Promise<boolean> {
    try {
      const { stdout } = await execAsync("pgrep -x iTerm2");
      return stdout.trim().length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Opens the selected window arrangement.
   * @param {WindowArrangement} arrangement - The window arrangement to restore.
   */
  async function openWindowArrangement(arrangement: WindowArrangement) {
    try {
      const script = `
        tell application "System Events"
          tell process "iTerm2"
            set frontmost to true
            set restoreMenu to menu "Restore Window Arrangement" of menu item "Restore Window Arrangement" of menu "Arrangements" of menu item "Arrangements" of menu "Window" of menu bar 1
            click menu item "${arrangement.name}" of restoreMenu
          end tell
        end tell
      `;

      await execAsync(`osascript -e '${script}'`);
      
      await showToast({
        style: Toast.Style.Success,
        title: "Arrangement Restored",
        message: `"${arrangement.name}" has been restored`,
      });
    } catch (err) {
      console.error("Error restoring arrangement:", err);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Restore",
        message: "Could not restore the window arrangement",
      });
    }
  }

  async function openiTerm2() {
    try {
      await open("https://www.raycast.com", "com.googlecode.iterm2");
 
      await showToast({
        style: Toast.Style.Success,
        title: "iTerm2 Opened",
        message: "iTerm2 has been launched",
      });
      
      // Reload arrangements after a short delay
      // setTimeout(loadArrangements, 2000);
    } catch (err) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Open iTerm2",
        message: "Could not launch iTerm2",
      });
    }
  }

  if (error) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Error"
          description={error}
          actions={
            <ActionPanel>
              <Action
                title="Open iTerm2"
                icon={Icon.AppWindow}
                onAction={openiTerm2}
              />
              <Action
                title="Retry"
                icon={Icon.ArrowClockwise}
                onAction={loadArrangements}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List isLoading={isLoading}>
      {arrangements.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Window}
          title="No Window Arrangements"
          description="No saved window arrangements found in iTerm2"
          actions={
            <ActionPanel>
              <Action
                title="Refresh"
                icon={Icon.ArrowClockwise}
                onAction={loadArrangements}
              />
            </ActionPanel>
          }
        />
      ) : (
        arrangements.map((arrangement) => (
          <List.Item
            key={arrangement.id || arrangement.name}
            // icon={Icon.Window}
            title={arrangement.name}
            // subtitle="Window Arrangement"
            actions={
              <ActionPanel>
                <Action
                  title="Restore Arrangement"
                  icon={Icon.Window}
                  onAction={() => openWindowArrangement(arrangement)}
                />
                <Action
                  title="Refresh"
                  icon={Icon.ArrowClockwise}
                  onAction={loadArrangements}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
} 
