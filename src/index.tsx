import { useEffect } from "react";
import fs from 'fs';
import path from 'path';
import os from 'os';
import bplist from 'bplist-parser';

import {
  ActionPanel,
  Action,
  List,
  Icon,
  showToast,
  Toast,
} from "@raycast/api";
import { runAppleScript, showFailureToast, useLocalStorage } from "@raycast/utils";

import launchIterm from "./tools/launch-iterm";

import { WindowArrangement } from "./types";


/**
 * Expands a path starting with ~ to the user's home directory.
 * @param {string} filePath - The file path, possibly starting with ~
 * @returns {string} - The expanded file path
 */
const expandHome = (filePath: string) => {
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
const getWindowArrangementsKeys = async (plistPath: string) => {
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


export default function Command() {
  const { value: arrangements, setValue: setArrangements, isLoading: arrangementsLoading } = useLocalStorage<WindowArrangement[]>("arrangements");


  /**
   * Loads the window arrangements from the iTerm2 plist file.
   */
  async function loadWindowArrangements() {
    try {
      const names = await getWindowArrangementsKeys('~/Library/Preferences/com.googlecode.iterm2.plist');

      const arrangementsList: WindowArrangement[] = names
        .map((name, index) => ({
          name: name.trim(),
          id: index,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setArrangements(arrangementsList);
    } catch (err) {
      showFailureToast("Failed to load window arrangements.");
    } finally {
    }
  }

  /**
   * Opens the selected window arrangement.
   * @param {WindowArrangement} arrangement - The window arrangement to restore.
   */
  async function openWindowArrangement(arrangement: WindowArrangement) {
    try {

      await launchIterm();

      await runAppleScript(`
        tell application "System Events"
          tell process "iTerm2"
            set frontmost to true
            set restoreMenu to menu "Restore Window Arrangement" of menu item "Restore Window Arrangement" of menu "Arrangements" of menu item "Arrangements" of menu "Window" of menu bar 1
            click menu item "${arrangement.name}" of restoreMenu
          end tell
        end tell
      `);

      await showToast({
        style: Toast.Style.Success,
        title: "Arrangement Restored",
        message: `"${arrangement.name}" has been restored`,
      });
    } catch (err) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Restore",
        message: "Could not restore the window arrangement",
      });
    }
  }

  useEffect(() => {
    loadWindowArrangements();
  }, []);

  return (
    <List
      navigationTitle="iTerm Window Arrangements"
      isLoading={arrangementsLoading}
      searchBarPlaceholder="Search iTerm window arrangements"
    >
      {arrangements?.length ? (
        arrangements.map((arrangement) => (
          <List.Item
            key={arrangement.id || arrangement.name}
            title={arrangement.name}
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
                  onAction={loadWindowArrangements}
                />
              </ActionPanel>
            }
          />
        ))
      ) : (
        <List.EmptyView
          icon={Icon.Window}
          title="No Window Arrangements"
          description="No saved iTerm window arrangements found."
        />
      )
    }
    </List>
  );
} 
