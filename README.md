# Pyrite Toolkit
The Pyrite Toolkit is a selection of Node.JS scripts that are used to datagen code for Pyrite.

## Generate
The main `generate.js` script is the primary script used for Pyrite. It generates blockstates, models, language entries, and loot tables for all blocks and items in Pyrite. It is designed to output these files in a format compatible with 1.20.1-1.21.4. It relies on various scripts to achieve this (see section on Helpers.)

## Standalones

These are functions that can work standalone and are therefore not Pyrite specific.

### Flip

This script can be used to flip text or an entire language file. Just provide the path to the `en_us.json` language file or `lang` directory as a CLI argument, and the toolkit will create a upside down language file from an `en_us.json` file in the directory.

## Helpers

These are various helper functions that work in the background to handle file writing, namespaced ID handling, and mod constants.

#### Tag Helpers

Various helper functions designed to aid the creation of Minecraft tags.

#### Model Helpers

Various helper functions designed to create block models and items.

#### Model Writers

Various helper functions designed to write models to disk.

#### Blockstate Helpers

Various helper functions designed to create blockstates.

#### Blockstate Writers

Various helper functions designed to write blockstates.

#### Translation Helpers

Various helper functions designed to aid in translating Pyrite.

#### Resource Generator

This will eventually become the main script where blocks can be added and deleted.

#### Recipe Helpers

Various helper functions designed to aid in creating shapeless, shaped, and stonecutting recipes.