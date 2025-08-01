# iTerm2 Window Arrangements Raycast Extension

This Raycast extension allows you to list and restore iTerm2 window arrangements directly from Raycast.

## Features

- **List Window Arrangements**: View all saved window arrangements from iTerm2
- **Restore Arrangements**: Quickly restore any saved window arrangement with a single click
- **Auto-refresh**: Automatically detects when iTerm2 is not running and provides options to launch it
- **Error Handling**: Graceful error handling with helpful messages

## Requirements

- macOS
- iTerm2 installed and running
- Raycast installed

## Installation

1. Clone or download this extension
2. Navigate to the extension directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. In Raycast, go to Extensions → Import Extension and select the `dist` folder

## Usage

1. Open Raycast and search for "iTerm2 Arrangements"
2. The extension will automatically load all available window arrangements
3. Click on any arrangement to restore it
4. Use the refresh button to reload the list if needed

## How it Works

The extension uses AppleScript to communicate with iTerm2 and:
- Retrieves all saved window arrangements
- Restores arrangements by name
- Checks if iTerm2 is running
- Provides helpful error messages and actions

## Troubleshooting

- **"iTerm2 is not running"**: Make sure iTerm2 is launched before using the extension
- **"No arrangements found"**: You need to save window arrangements in iTerm2 first (Window → Save Window Arrangement)
- **Permission issues**: Make sure Raycast has accessibility permissions in System Preferences

## Creating Window Arrangements in iTerm2

To create window arrangements that this extension can restore:

1. Open iTerm2
2. Arrange your windows and tabs as desired
3. Go to Window → Save Window Arrangement
4. Give your arrangement a name
5. The arrangement will now appear in this Raycast extension

## Development

To run the extension in development mode:

```bash
npm run dev
```

This will start the development server and allow you to test changes in real-time.

## License

MIT 