# Pyrite Toolkit
The Pyrite Toolkit is a selection of Node.JS scripts that are used to datagen code for Pyrite.

## Generate
The main `generate.js` script is the primary script used for Pyrite. It generates blockstates, models, language entries, and loot tables for all blocks and items in Pyrite. It is designed to output these files in a format compatible with 1.20.1-1.21.4. Stategenerate is currently being broken up into various scripts. These will eventually become:

### Helpers

Various helper functions that handle file writing, namespaced ID handling, and mod constants.

### Tag Helpers

Various helper functions designed to aid the creation of Minecraft tags.

### Model Helpers

Various helper functions designed to create block models and items.

### Model Writers

Various helper functions designed to write models to disk.

### Blockstate Helpers

Various helper functions designed to create blockstates.

### Blockstate Writers

Various helper functions designed to write blockstates.

### Translation Helpers

Various helper functions designed to aid in translating Pyrite.

### Resource Generator

This will eventually become the main script where blocks can be added and deleted.

### Recipe Helpers

Various helper functions designed to aid in creating shapeless, shaped, and stonecutting recipes.

## Standalones

These are functions that can work standalone and are therefore not Pyrite specific.

### Flip

This script can be used to flip text or an entire language file.

### publish

The publish.py script is used to start the build tasks of multiple Pyrite projects, and copy them to a single folder for ease of upload to Modrinth and Curseforge. This may be retired in the future.
