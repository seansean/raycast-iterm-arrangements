import { runAppleScript } from "@raycast/utils";

export default async function () {
  const result = await runAppleScript(`
    tell application "iTerm"
        activate

        repeat until application "iTerm" is running
            delay 0.1
        end repeat

        activate
    end tell
  `);
  return result;
}
