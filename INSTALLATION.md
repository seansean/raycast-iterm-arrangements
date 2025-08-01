# iTerm2 Window Arrangements Raycast Extension

## Installation Instructions

### Prerequisites
- macOS
- iTerm2 installed
- Raycast installed

### Quick Installation

1. **Clone or download this extension**
   ```bash
   cd ~/raycast-iterm2-arrangements
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Import into Raycast**
   - Open Raycast
   - Go to Extensions → Import Extension
   - Select the `dist` folder from this project

### Manual Installation

If the build process doesn't create a `dist` folder automatically:

1. **Create the dist directory manually**
   ```bash
   mkdir -p dist
   cp -r src package.json README.md dist/
   ```

2. **Create an icon** (optional)
   - Add a `command-icon.svg` or `command-icon.png` file to the `dist` folder
   - Update the `package.json` to reference the correct icon file

3. **Import the extension**
   - In Raycast, go to Extensions → Import Extension
   - Select the `dist` folder

### Usage

1. **Open Raycast** and search for "iTerm2 Arrangements"
2. **The extension will:**
   - Check if iTerm2 is running
   - Load all available window arrangements
   - Display them in a list
3. **To restore an arrangement:**
   - Click on any arrangement in the list
   - The window arrangement will be restored immediately

### Creating Window Arrangements in iTerm2

To create arrangements that this extension can restore:

1. Open iTerm2
2. Arrange your windows and tabs as desired
3. Go to **Window → Save Window Arrangement**
4. Give your arrangement a name
5. The arrangement will now appear in this Raycast extension

### Troubleshooting

- **"iTerm2 is not running"**: Start iTerm2 first
- **"No arrangements found"**: Create window arrangements in iTerm2 first
- **Permission issues**: Ensure Raycast has accessibility permissions in System Preferences

### Development

To run in development mode:
```bash
npm run dev
```

This will start the development server and allow real-time testing.

### Files Structure

```
raycast-iterm2-arrangements/
├── src/
│   └── index.tsx          # Main extension code
├── dist/                  # Built extension (for import)
│   ├── src/
│   ├── package.json
│   ├── README.md
│   └── command-icon.svg
├── package.json           # Extension configuration
├── tsconfig.json          # TypeScript configuration
├── README.md              # Documentation
└── INSTALLATION.md        # This file
```

### Features

- ✅ List all iTerm2 window arrangements
- ✅ Restore window arrangements with one click
- ✅ Automatic iTerm2 detection
- ✅ Error handling and user feedback
- ✅ Refresh functionality
- ✅ Modern Raycast UI 
