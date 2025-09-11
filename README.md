# Silksong Flea Location Helper

## https://mikkerlo.github.io/silksong-flea/

A specialized tool for tracking flea collection progress in Hollow Knight: Silksong save files with integrated Map Genie location support.

This tool analyzes your Silksong save file to show your SavedFlea collection status and provides direct links to Map Genie for finding missing flea locations.

## Features

- **Save File Analysis** - Upload your Silksong save file to view flea collection progress
- **Map Genie Integration** - Direct links to flea locations on Map Genie when available
- **Visual Status Indicators** - Clear ✓/✗/n/a symbols for each flea field
- **Missing Flea Summary** - Consolidated view of all missing fleas with known locations
- **Cross-Platform Support** - Works with both PC (encrypted) and Nintendo Switch (plain text) save files

## Instructions

1. **Make a backup** of your original save file before analysis
2. **Select or drag** your Silksong save file into the tool
3. **View the table** showing your SavedFlea collection status
4. **Click map links** (🗺️ View) to see flea locations on Map Genie
5. **Use the missing summary** at the bottom to view all missing fleas at once

## Save File Locations

### PC (Steam/GOG)
- Windows: `%USERPROFILE%\AppData\LocalLow\Team Cherry\Hollow Knight Silksong\`
- Mac: `~/Library/Application Support/unity.Team Cherry.Hollow Knight Silksong/`
- Linux: `~/.config/unity3d/Team Cherry/Hollow Knight Silksong/`

### Nintendo Switch
Save files are typically named `user1.dat` for PC or plain JSON for Switch homebrew extraction.

## Technical Details

The decryption and encryption methods are based on [@KayDeeTee](https://github.com/KayDeeTee)'s [Hollow Knight Save Manager](https://github.com/KayDeeTee/Hollow-Knight-SaveManager).

This tool specifically looks for 27 SavedFlea fields in your save data and displays their status with optional Map Genie integration for location assistance.

## Contributing

If you know Map Genie location IDs for specific flea locations, you can contribute them through our [contribution form](https://docs.google.com/forms/d/e/1FAIpQLSdvRIFSdAP6vc_q9mZIZK-sa2hB3YEk44mh-0_bgkTTuaafUA/viewform). 
