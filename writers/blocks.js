// Imports
const helpers = require('../helpers/helpers');
const blockstateHelper = require('./blockstates');
const stateHelper = require("../helpers/blockstates");
const tagHelper = require("../helpers/tags");
const { writeRecipeAdvancement } = require("./advancements");
const modelWriter = require("./models");
const itemModelWriter = require("./item_models");
const recipeWriter = require("./recipes");
const recipeHelper = require("../helpers/recipes")
const modelHelper = require("../helpers/models")
const langHelper = require("../helpers/language")
const lootTableWriter = require('./loot_tables');

// Aliases
const mc = helpers.mc
const modID = helpers.modID
const id = helpers.id
const getPath = helpers.getPath

function writeWallGates(block, baseBlock, texture) {
	// Standardize inputs.
	if (texture == undefined)
		texture = baseBlock;
	const baseBlockNamespace = helpers.getNamespace(baseBlock);

	// Blockstates
	const fenceGateBlockState = stateHelper.genFenceGates(block, modID, baseBlockNamespace);
	blockstateHelper.writeBlockstate(block, fenceGateBlockState, modID, undefined);

	// Models
	modelWriter.writeWallGates(block, modID, texture, baseBlockNamespace);
	itemModelWriter.writeInventoryModel(block, modID, baseBlockNamespace);

	// Language files
	langHelper.generateBlockLang(block);

	// Loot tables
	lootTableWriter.writeLootTables(block, modID, block, baseBlockNamespace);

	// Tags
	let optionality = false;
	if ((baseBlockNamespace != mc) && (baseBlockNamespace != modID)) {
		optionality = true;
	}
	tagHelper.tagBoth(block, "wall_gates", optionality);
	tagHelper.checkAndAddResourceTag(block, baseBlock)

	// Recipes
	writeRecipeAdvancement(id(block), id(baseBlock));
	recipeWriter.writeRecipes(block, "wall_gates", baseBlock, modID, baseBlockNamespace);
	recipeWriter.writeStonecutterRecipe(block, baseBlock, 1);
	return block;

}

function writeCarpet(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	if (namespace === undefined) {
		namespace = modID
	}
	blockstateHelper.writeBlockstate(block, stateHelper.genCarpet(block, namespace, baseBlock), modID)
	modelWriter.writeCarpets(block, altNamespace, baseBlock)
	itemModelWriter.writeBlockItemModel(block, namespace)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block)
	if (baseBlock.search("_top") !== -1) {
		baseBlock = baseBlock.split("_top")[0]
	}

	//Tags
	if (baseBlock.includes("wool")) {
		tagHelper.tagBoth(block, "minecraft:wool_carpets")
		tagHelper.tagBoth(block, `c:dyed/${baseBlock.replace("_wool", "")}`)
	} else {
		tagHelper.tagBlock(block, "carpet")
	}

	// Recipes
	writeRecipeAdvancement(id(block), id(altNamespace, baseBlock))
	recipeWriter.writeRecipes(block, "carpet", baseBlock, namespace, altNamespace)
}

function writeDoors(block, baseBlock) {
	const doorBlockState = stateHelper.genDoors(block, modID, baseBlock)
	blockstateHelper.writeBlockstate(block, doorBlockState, modID)
	modelWriter.writeDoors(block)
	itemModelWriter.writeGeneratedItemModel(block)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeDoorLootTables(block)
	tagHelper.tagBoth(block, "minecraft:doors")
	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_doors")
	} else {
		tagHelper.tagBlock(block, baseBlock.split(":")[1].split("_block")[0])
	}
	writeRecipeAdvancement(id(block), id(baseBlock))
	recipeWriter.writeRecipes(block, "door", baseBlock)
}

function writeTrapdoors(block, namespace, baseBlock) {
	let doorBlockState = stateHelper.genTrapdoors(block, namespace, baseBlock)
	blockstateHelper.writeBlockstate(block, doorBlockState, namespace)

	// Models
	modelWriter.writeTrapdoors(block, namespace, baseBlock)
	itemModelWriter.writeTrapdoorItemModel(block, namespace)

	// Loot Table
	lootTableWriter.writeLootTables(block, namespace)

	// Lang
	langHelper.generateBlockLang(block)

	// Tags
	if (baseBlock.includes("planks"))
		tagHelper.tagBoth(block, "minecraft:wooden_trapdoors")
	else {
		tagHelper.tagBoth(block, "metal_trapdoors")
		tagHelper.checkAndAddResourceTag(block, baseBlock)
	}

	// Recipes
	writeRecipeAdvancement(id(block), id(baseBlock))
	recipeWriter.writeRecipes(block, "trapdoor", baseBlock)
}

function writeBlock(blockID, blockType, baseBlock, render_type, texture, shouldGenerateStonecutterRecipes, shouldGenerateRecipeAdvancements, customModel, shatters, defaultRecipe) {
	// Setup
	let namespace, block;
	if (blockID.includes(":")) {
		namespace = helpers.getNamespace(blockID)
		block = helpers.getPath(blockID)
	} else {
		block = blockID;
		namespace = modID
	}
	if (texture == undefined)
		texture = block
	// Blockstates
	blockstateHelper.writeBlockstate(block, stateHelper.gen(block, namespace), namespace)
	modelWriter.writeBlockModel(block, namespace, texture, customModel, render_type)
	itemModelWriter.writeBlockItemModel(block, namespace)
	if (shatters !== true)
		lootTableWriter.writeLootTables(block, namespace)
	langHelper.generateBlockLang(block)

	// Tag various blocks based off block type.
	tagHelper.checkAndAddBlockTypeTag(block, baseBlock, blockType)

	// Generate recipes
	if (customModel !== false) {
		recipeWriter.writeRecipes(block, blockType, baseBlock, namespace)
		if (shouldGenerateStonecutterRecipes === true) {
			recipeWriter.writeStonecutterRecipe(block, baseBlock, 1)
		}
		else if (!isNaN(parseFloat(shouldGenerateStonecutterRecipes)) && !isNaN(shouldGenerateStonecutterRecipes-0)) {
			recipeWriter.writeStonecutterRecipe(block, baseBlock, shouldGenerateStonecutterRecipes)
		}
		if (shouldGenerateRecipeAdvancements !== undefined) {
			if (shouldGenerateRecipeAdvancements === true)
				writeRecipeAdvancement(block, baseBlock)
			else if (shouldGenerateRecipeAdvancements === false) { }
			else {
				writeRecipeAdvancement(block, shouldGenerateRecipeAdvancements)
			}
		}
	}
	lootTableWriter.writeLootTables(block)
	return block;
}

function writeBibliocraftBlock(blockID, blockType, baseBlock, model, texture) {
	// Setup
	let namespace, block;
	if (blockID.includes(":")) {
		namespace = helpers.getNamespace(blockID)
		block = helpers.getPath(blockID)
	} else {
		block = blockID;
		namespace = modID
	}
	if (texture == undefined)
		texture = block
	// Blockstates
	blockstateHelper.writeBlockstate(block, stateHelper.gen(block, namespace), namespace)
	modelWriter.writeBlockModel(block, namespace, texture, model, undefined)
	itemModelWriter.writeBlockItemModel(block, namespace)
	lootTableWriter.writeLootTables(block, namespace)
	langHelper.generateBlockLang(block)

	// Generate recipes
	recipeWriter.writeRecipes(block, blockType, baseBlock, namespace)
	writeRecipeAdvancement(block, baseBlock)
	lootTableWriter.writeLootTables(block)
	return block;
}

function writeLeverBlock(block, namespace, baseBlock, altNamespace) {
	let uprightBlock;

	if (altNamespace === mc) {
		uprightBlock = block
	} else {
		uprightBlock = baseBlock
		uprightBlock += "_torch"
		baseBlock += "_torch"
	}
	baseBlock = getPath(baseBlock)
	const blockState = `{"variants":{"face=ceiling,facing=east,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","x":180,"y":270},"face=ceiling,facing=east,powered=true":{"model":"${namespace}:block/${block}","x":180,"y":270},"face=ceiling,facing=north,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","x":180,"y":180},"face=ceiling,facing=north,powered=true":{"model":"${namespace}:block/${block}","x":180,"y":180},"face=ceiling,facing=south,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","x":180},"face=ceiling,facing=south,powered=true":{"model":"${namespace}:block/${block}","x":180},"face=ceiling,facing=west,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","x":180,"y":90},"face=ceiling,facing=west,powered=true":{"model":"${namespace}:block/${block}","x":180,"y":90},"face=floor,facing=east,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","y":90},"face=floor,facing=east,powered=true":{"model":"${namespace}:block/${block}","y":90},"face=floor,facing=north,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright"},"face=floor,facing=north,powered=true":{"model":"${namespace}:block/${block}"},"face=floor,facing=south,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","y":180},"face=floor,facing=south,powered=true":{"model":"${namespace}:block/${block}","y":180},"face=floor,facing=west,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","y":270},"face=floor,facing=west,powered=true":{"model":"${namespace}:block/${block}","y":270},"face=wall,facing=east,powered=false":{"model":"${namespace}:block/${block}_wall"},"face=wall,facing=east,powered=true":{"model":"${namespace}:block/${block}","x":90,"y":90},"face=wall,facing=north,powered=false":{"model":"${namespace}:block/${block}_wall","y":270},"face=wall,facing=north,powered=true":{"model":"${namespace}:block/${block}","x":90},"face=wall,facing=south,powered=false":{"model":"${namespace}:block/${block}_wall","y":90},"face=wall,facing=south,powered=true":{"model":"${namespace}:block/${block}","x":90,"y":180},"face=wall,facing=west,powered=false":{"model":"${namespace}:block/${block}_wall","y":180},"face=wall,facing=west,powered=true":{"model":"${namespace}:block/${block}","x":90,"y":270}}}`
	blockstateHelper.writeBlockstate(block, blockState, namespace)
	modelWriter.writeLevers(block, namespace, baseBlock, altNamespace)
	// modelWriter.writeTorches(block, namespace, block, altNamespace)
	itemModelWriter.writeUniqueBlockItemModel(block, namespace, namespace,block)
	lootTableWriter.writeLootTables(block, namespace)
	recipeWriter.writeRecipes(block, "torch_lever", baseBlock, namespace, altNamespace)
	writeRecipeAdvancement(id(namespace, block), id(altNamespace, baseBlock))
	lootTableWriter.writeLootTables(block)
}

function writeTorchBlock(block, namespace, baseBlock, altNamespace, generateRecipes, requireMod) {
	console.log(generateRecipes)
	const blockState = `{"variants":{"face=ceiling,facing=east":{"model":"${namespace}:block/${block}_upright","x":180,"y":270},"face=ceiling,facing=north":{"model":"${namespace}:block/${block}_upright","x":180,"y":180},"face=ceiling,facing=south":{"model":"${namespace}:block/${block}_upright","x":180},"face=ceiling,facing=west":{"model":"${namespace}:block/${block}_upright","x":180,"y":90},"face=floor,facing=east":{"model":"${namespace}:block/${block}_upright","y":90},"face=floor,facing=north":{"model":"${namespace}:block/${block}_upright"},"face=floor,facing=south":{"model":"${namespace}:block/${block}_upright","y":180},"face=floor,facing=west":{"model":"${namespace}:block/${block}_upright","y":270},"face=wall,facing=east":{"model":"${namespace}:block/${block}_wall"},"face=wall,facing=north":{"model":"${namespace}:block/${block}_wall","y":270},"face=wall,facing=south":{"model":"${namespace}:block/${block}_wall","y":90},"face=wall,facing=west":{"model":"${namespace}:block/${block}_wall","y":180}}}`
	blockstateHelper.writeBlockstate(block, blockState, namespace)
	modelWriter.writeTorches(block, namespace, block, altNamespace)
	itemModelWriter.writeUniqueBlockItemModel(block, namespace, namespace, block)
	lootTableWriter.writeLootTables(block, namespace)
	tagHelper.tagBoth(block, `c:dyed/${baseBlock}`, true)
	if (generateRecipes === true || generateRecipes === undefined) {
		recipeWriter.writeRecipes(block, "torch", baseBlock, namespace, altNamespace)
		writeRecipeAdvancement(id(block), "minecraft:torch")
	}
	lootTableWriter.writeLootTables(block, undefined, undefined, requireMod)
}

function writePoweredBlock(block) {
	let namespace, path
	if (block.includes(":")) {
		namespace = modID
		path = block.split(":")[1]
	}
	const blockState = {
		"variants": {
			"powered=false": {
				"model": `${namespace}:block/${path}`
			},
			"powered=true": {
				"model": `${namespace}:block/${path}_on`
			}
		}
	}
	blockstateHelper.writeBlockstate(block, blockState, namespace)
	modelWriter.writePoweredBlock(block)
	itemModelWriter.writeBlockItemModel(block, namespace)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block, namespace)
	recipeWriter.writeRecipes(block, "powered", undefined, namespace)
	writeRecipeAdvancement(block, id(mc, "redstone"))
	lootTableWriter.writeLootTables(block)
}

function writeCraftingTableBlock(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	baseBlock = getPath(baseBlock)
	const blockState = stateHelper.gen(block, namespace, altNamespace)
	blockstateHelper.writeBlockstate(block, blockState, namespace)
	modelWriter.writeCraftingTables(block, namespace, baseBlock, altNamespace)
	itemModelWriter.writeBlockItemModel(block, namespace, altNamespace)
	langHelper.generateBlockLang(block)
	tagHelper.tagBoth(block, "crafting_tables", true)
	tagHelper.checkAndAddStainedTag(block, baseBlock)
	recipeWriter.writeShapedRecipe({ "C": id(altNamespace, baseBlock) }, id(namespace, block), 1, ["CC","CC"])
	writeRecipeAdvancement(id(block), id(altNamespace, baseBlock))
	lootTableWriter.writeLootTables(block, namespace, undefined, altNamespace)
}

function writeChestBlock(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	baseBlock = getPath(baseBlock)
	const blockState = stateHelper.gen(block, namespace, altNamespace)
	blockstateHelper.writeBlockstate(block, blockState, namespace)
	modelWriter.writeChests(block, namespace, baseBlock, altNamespace)
	itemModelWriter.writeBlockItemModel(block, namespace, altNamespace)
	lang = langHelper.generateBlockLang(block)
	langHelper.addLang("container.lolmcv." + modID + "_" + block, lang)
	langHelper.addLang("container.lolmcv." + modID + "_" + block + "Double", "Large " + lang)


	tagHelper.tagBoth(block, "chests", true)
	tagHelper.checkAndAddStainedTag(block, baseBlock, true)
	recipeWriter.writeShapedRecipe({
		"I": `${altNamespace}:${baseBlock}`,
	}, id(block), 1, [
		"III",
		"I I",
		"III"
	], undefined, "lolmcv")
	// writeRecipeAdvancement(id(block), id(altNamespace, baseBlock))
	lootTableWriter.writeLootTables(block, namespace, undefined, "lolmcv")
}

function writeLadders(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	const blockState = `{"variants":{"facing=east":{"model":"${namespace}:block/${block}","y":90},"facing=north":{"model":"${namespace}:block/${block}"},"facing=south":{"model":"${namespace}:block/${block}","y":180},"facing=west":{"model":"${namespace}:block/${block}","y":270}}}`
	blockstateHelper.writeBlockstate(block, blockState, namespace)
	modelWriter.writeBlockModel(block, namespace, block, "pyrite:block/template_ladder")
	itemModelWriter.writeUniqueBlockItemModel(block, namespace, namespace)
	lootTableWriter.writeLootTables(block, namespace)
	tagHelper.tagBlock(block, "ladders")
	recipeWriter.writeRecipes(block, "ladder", baseBlock, namespace, altNamespace)
	writeRecipeAdvancement(block, id(altNamespace, baseBlock))
	lootTableWriter.writeLootTables(block)
}

function writeFlower(block) {
	const blockState = stateHelper.gen(block, modID)
	blockstateHelper.writeBlockstate(block, blockState, modID)
	modelWriter.writeFlowers(block, modID)
	itemModelWriter.writeUniqueBlockItemModel(block, modID)
	tagHelper.tagBoth(block, "minecraft:small_flowers")
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block, modID)
	recipeWriter.writeRecipes(block, "flower")
	if (helpers.versionAbove("1.21.3"))
		recipeWriter.writeShapelessRecipe([id(block), "minecraft:bowl", "minecraft:red_mushroom", "minecraft:brown_mushroom"], "minecraft:suspicious_stew", 1, "_from_" + block, {
			"minecraft:suspicious_stew_effects": [
				{
					"duration": 100,
					"id": "minecraft:blindness"
				}
			]
		})
	writeRecipeAdvancement(block, id(mc, "poppy"))
	writeFlowerPot(block)
	tagHelper.tagItem(block, "enabled", true)
}

function writeFlowerPot(baseBlock) {
	const block = "potted_" + baseBlock
	const blockState = stateHelper.gen(block, modID)
	blockstateHelper.writeBlockstate(block, blockState, modID)
	const model = modelHelper.generateBlockModel(block, modID, baseBlock, "minecraft:block/flower_pot_cross", "cutout", "plant")
	modelWriter.writeProvided(block, model)
	langHelper.generateBlockLang(block)
	tagHelper.tagBlock(block, "minecraft:flower_pots")
	lootTableWriter.writeFlowerPotLootTables(block, id(baseBlock))
}

function writeChiseledBlock(block, baseBlock, special, texture, defaultRecipe) {
	let namespace;
	if (block.includes(":"))
		namespace = helpers.getNamespace(block)
	else
		namespace = modID
	if (texture == undefined) {
		texture = block
	}
	blockState = `{"variants":{"axis=x":{"model":"${namespace}:block/${block}_horizontal","x":90,"y":90},"axis=y":{"model":"${namespace}:block/${block}"},"axis=z":{"model":"${namespace}:block/${block}_horizontal","x":90}}}`
	blockstateHelper.writeBlockstate(block, blockState, namespace)
	modelWriter.writeColumns(block, namespace, texture)
	itemModelWriter.writeBlockItemModel(block, namespace)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block, namespace)
	const blockType = getPath(baseBlock).split("_block")[0]
	tagHelper.tagBoth(block, blockType)
	tagHelper.checkAndAddBeaconTag(block, blockType)
	if (baseBlock == "minecraft:copper") {
		baseBlock += "_block"
	}
	if (defaultRecipe !== false) {
		recipeWriter.writeStonecutterRecipe(block, baseBlock, 4)
		writeRecipeAdvancement(block, baseBlock)
		recipeWriter.writeRecipes(block, special, baseBlock)
	}

	return block;
}

function writeUprightColumnBlock(block, namespace, blockType, baseBlockID, texture) {
	if (texture == undefined)
		texture == baseBlockID
	blockstateHelper.writeBlockstate(block, stateHelper.gen(block, namespace), namespace)
	modelWriter.writeColumns(block, namespace, texture)
	itemModelWriter.writeBlockItemModel(block, namespace)
	lootTableWriter.writeLootTables(block)
	langHelper.generateBlockLang(block)
	recipeWriter.writeRecipes(block, blockType, getPath(baseBlockID))
	writeRecipeAdvancement(block, baseBlockID)
}

function writeOrientableBlock(block, namespace, blockType, baseBlock) {
	blockstateHelper.writeBlockstate(block, stateHelper.genOrientable(id(modID, block)), namespace)
	modelWriter.writeProvided(block, modelHelper.genOrientable(id(modID, block)))
	itemModelWriter.writeBlockItemModel(block, namespace)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block, namespace)
	recipeWriter.writeRecipes(block, blockType, baseBlock)
}

function writeCabinetBlock(block, namespace, blockType, baseBlock) {
	var path = helpers.getPath(block)
	blockstateHelper.writeBlockstate(block, stateHelper.genCabinet(id(modID, block)), namespace)
	modelWriter.writeProvided(block, {
		"parent": "minecraft:block/orientable",
		"textures": {
			"top": `${namespace}:block/${path}_top`,
			"front": `${namespace}:block/${path}_front`,
			"side": `${namespace}:block/${path}_side`
		}
	})
	modelWriter.writeProvided(block + "_open", {
		"parent": "minecraft:block/orientable",
		"textures": {
			"top": `${namespace}:block/${path}_top`,
			"front": `${namespace}:block/${path}_front_open`,
			"side": `${namespace}:block/${path}_side`
		}
	})
	itemModelWriter.writeBlockItemModel(block, namespace)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block, namespace, undefined, undefined, "farmersdelight")
	tagHelper.tagBlock(block, "minecraft:mineable/axe", true)
	tagHelper.tagItem(block, "farmersdelight:cabinets", true)
	recipeWriter.writeShapedRecipe({
		"D": id(namespace, baseBlock).replace("planks", "trapdoor"),
		"_": id(namespace, baseBlock).replace("planks", "slab")
		  }, id(namespace, block), 1, [
			"___",
			"D D",
			"___"
		  ], undefined, "farmersdelight")
}

function writeShelfBlock(block, namespace, blockType, baseBlock) {
	var path = helpers.getPath(block)
	let sideChain = "side_chain_part"
	if (helpers.versionAbove("1.21.3")) { 
		sideChain = "side_chain"
	}
	blockstateHelper.writeBlockstate(block, JSON.parse(`{
		"multipart": [
			{
			"apply": {
				"model": "${namespace}:block/${block}"
			},
			"when": {
				"facing": "north"
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}",
				"y": 90
			},
			"when": {
				"facing": "east"
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}",
				"y": 180
			},
			"when": {
				"facing": "south"
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}",
				"y": 270
			},
			"when": {
				"facing": "west"
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_unpowered"
			},
			"when": {
				"AND": [
				{
					"facing": "north"
				},
				{
					"powered": "false"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_unpowered",
				"y": 90
			},
			"when": {
				"AND": [
				{
					"facing": "east"
				},
				{
					"powered": "false"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_unpowered",
				"y": 180
			},
			"when": {
				"AND": [
				{
					"facing": "south"
				},
				{
					"powered": "false"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_unpowered",
				"y": 270
			},
			"when": {
				"AND": [
				{
					"facing": "west"
				},
				{
					"powered": "false"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_unconnected"
			},
			"when": {
				"AND": [
				{
					"facing": "north"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "unconnected"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_unconnected",
				"y": 90
			},
			"when": {
				"AND": [
				{
					"facing": "east"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "unconnected"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_unconnected",
				"y": 180
			},
			"when": {
				"AND": [
				{
					"facing": "south"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "unconnected"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_unconnected",
				"y": 270
			},
			"when": {
				"AND": [
				{
					"facing": "west"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "unconnected"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_left"
			},
			"when": {
				"AND": [
				{
					"facing": "north"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "left"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_left",
				"y": 90
			},
			"when": {
				"AND": [
				{
					"facing": "east"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "left"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_left",
				"y": 180
			},
			"when": {
				"AND": [
				{
					"facing": "south"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "left"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_left",
				"y": 270
			},
			"when": {
				"AND": [
				{
					"facing": "west"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "left"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_center"
			},
			"when": {
				"AND": [
				{
					"facing": "north"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "center"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_center",
				"y": 90
			},
			"when": {
				"AND": [
				{
					"facing": "east"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "center"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_center",
				"y": 180
			},
			"when": {
				"AND": [
				{
					"facing": "south"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "center"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_center",
				"y": 270
			},
			"when": {
				"AND": [
				{
					"facing": "west"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "center"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_right"
			},
			"when": {
				"AND": [
				{
					"facing": "north"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "right"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_right",
				"y": 90
			},
			"when": {
				"AND": [
				{
					"facing": "east"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "right"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_right",
				"y": 180
			},
			"when": {
				"AND": [
				{
					"facing": "south"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "right"
				}
				]
			}
			},
			{
			"apply": {
				"model": "${namespace}:block/${block}_right",
				"y": 270
			},
			"when": {
				"AND": [
				{
					"facing": "west"
				},
				{
					"powered": "true"
				},
				{
					"${sideChain}": "right"
				}
				]
			}
			}
		]
		}`))
	// modelWriter.writeProvided(block + "_open", {
	// 	"parent": "minecraft:block/orientable",
	// 	"textures": {
	// 		"top": `${namespace}:block/${path}_top`,
	// 		"front": `${namespace}:block/${path}_front_open`,
	// 		"side": `${namespace}:block/${path}_side`
	// 	}
	// })
	modelWriter.writeProvided(block, modelHelper.generateShelfBlockModels(block, modID, block, "template_shelf_body", undefined, "all"))
	modelWriter.writeProvided(block + "_left", modelHelper.generateShelfBlockModels(block, modID, block, "template_shelf_left", undefined, "all"))
	modelWriter.writeProvided(block + "_right", modelHelper.generateShelfBlockModels(block, modID, block, "template_shelf_right", undefined, "right"))
	modelWriter.writeProvided(block + "_center", modelHelper.generateShelfBlockModels(block, modID, block, "template_shelf_center", undefined, "center"))
	modelWriter.writeProvided(block + "_unpowered", modelHelper.generateShelfBlockModels(block, modID, block, "template_shelf_unpowered", undefined, "all"))
	modelWriter.writeProvided(block + "_powered", modelHelper.generateShelfBlockModels(block, modID, block, "template_shelf_powered", undefined, "all"))
	modelWriter.writeProvided(block + "_inventory", modelHelper.generateShelfBlockModels(block, modID, block, "template_shelf_inventory", undefined, "all"))

	itemModelWriter.writeInventoryModel(block, namespace)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block, namespace, undefined, undefined)
	tagHelper.tagBlock(block, "minecraft:mineable/axe", true)
	tagHelper.tagBlock(block, "minecraft:wooden_shelves", true)
	recipeWriter.writeShapedRecipe({
		"D": id(namespace, baseBlock),
		  }, id(namespace, block), 1, [
			"DDD",
			"   ",
			"DDD"
		  ], undefined)
}

function writeStoveBlock(block, namespace, blockType, baseBlock) {
	// blockstateHelper.writeBlockstate(block, stateHelper.genOrientable(id(modID, block)), namespace)
	// modelWriter.writeProvided(block, modelHelper.genOrientable(id(modID, block)))
	itemModelWriter.writeBlockItemModel(block, namespace)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block, namespace)
	recipeWriter.writeShapedRecipe({
		"I": "minecraft:iron_ingot",
		"C": "minecraft:campfire",
		"#": baseBlock,
	}, id(block), 1, [
		"III",
		"# #",
		"#C#"
	], undefined, true)
	tagHelper.tagBlock(block, "farmersdelight:heat_sources", true)
	tagHelper.tagBlock(block, "minecraft:mineable/pickaxe", true)
	tagHelper.tagBlock(block, "create:passive_boiler_heaters", true)


}

function writeSigns(blockID, baseBlockID, texture) {
	// Setup
	const wallBlockID = blockID.replace("_sign", "_wall_sign")
	if (texture == undefined) {
		texture = baseBlockID
	}
	// Blockstates
	blockstateHelper.writeBlockstate(blockID, stateHelper.gen(blockID, modID), modID)
	blockstateHelper.writeBlockstate(wallBlockID, stateHelper.gen(blockID, modID), modID)
	// Models
	if (helpers.versionAbove("1.21.4"))
		modelWriter.writeProvided(blockID, modelHelper.generateBlockModel(blockID, modID, baseBlockID, "TOOLKIT_NO_PARENT", undefined, "particle"))
	else
		modelWriter.writeBlockModel(blockID, modID, texture)
	itemModelWriter.writeGeneratedItemModel(blockID)
	// Loot Tables
	lootTableWriter.writeLootTables(blockID, modID)
	lootTableWriter.writeLootTables(wallBlockID, modID, blockID)
	// Language Entries
	langHelper.generateBlockLang(blockID)
	// Tags
	tagHelper.tagBoth(blockID, "minecraft:signs")
	tagHelper.tagBlock(wallBlockID, "minecraft:wall_signs")
	tagHelper.checkAndAddDyedTag(blockID, baseBlockID)
	tagHelper.checkAndAddDyedTag(wallBlockID, baseBlockID, true)
	// Generate recipes
	writeRecipeAdvancement(id(blockID), baseBlockID)
	recipeWriter.writeRecipes(blockID, "sign", baseBlockID, modID)
	return blockID;
}

function writeHangingSigns(blockID, baseBlockID, texture) {
	// Setup
	const wallBlockID = blockID.replace("_sign", "_wall_sign")
	if (texture == undefined) {
		texture = baseBlockID
	}
	// Blockstates
	blockstateHelper.writeBlockstate(blockID, stateHelper.gen(blockID, modID), modID)
	blockstateHelper.writeBlockstate(wallBlockID, stateHelper.gen(blockID, modID), modID)
	// Models
	if (helpers.versionAbove("1.21.4"))
		modelWriter.writeProvided(blockID, modelHelper.generateBlockModel(blockID, modID, baseBlockID, "TOOLKIT_NO_PARENT", undefined, "particle"))
	else
		modelWriter.writeBlockModel(blockID, modID, texture)
	itemModelWriter.writeGeneratedItemModel(blockID)
	// Loot Tables
	lootTableWriter.writeLootTables(blockID, modID)
	lootTableWriter.writeLootTables(wallBlockID, modID, blockID)
	// Language Entries
	langHelper.generateBlockLang(blockID)
	// Tags
	tagHelper.tagBlock(blockID, "minecraft:ceiling_hanging_signs")
	tagHelper.tagBlock(wallBlockID, "minecraft:wall_hanging_signs")
	tagHelper.tagItem(blockID, "minecraft:hanging_signs")
	tagHelper.checkAndAddDyedTag(blockID, baseBlockID)
	tagHelper.checkAndAddDyedTag(wallBlockID, baseBlockID, true)
	// Generate recipes
	writeRecipeAdvancement(blockID, baseBlockID)
	recipeWriter.writeRecipes(blockID, "hanging_sign", baseBlockID, modID)
	return blockID;
}

function writePanes(block, namespace, baseBlock, shatters) {
	baseBlock = block.replace("_pane", "")
	blockstateHelper.writeBlockstate(block, stateHelper.genPanes(block, namespace, baseBlock), namespace)
	modelWriter.writePanes(block, namespace, baseBlock)
	itemModelWriter.writeUniqueBlockItemModel(block, namespace, namespace, baseBlock)
	if (shatters !== true)
		lootTableWriter.writeLootTables(block, namespace)
	tagHelper.tagBoth(block, "c:glass_panes")
	tagHelper.checkAndAddDyedTag(block, baseBlock)
	writeRecipeAdvancement(block, id(baseBlock))
	recipeWriter.writeRecipes(block, "glass_pane", baseBlock)
	langHelper.generateBlockLang(block)
}

function writeBars(block, namespace, ingredientID, texture) {
	if (texture == undefined)
		texture = block + "_bars"
	const baseBlock = block
	block = block + "_bars"
	const blockID = id(block)
	blockstateHelper.writeBlockstate(block, stateHelper.genBars(block, namespace, baseBlock), namespace)
	modelWriter.writeBars(block, namespace, texture)
	itemModelWriter.writeUniqueBlockItemModel(block, namespace, undefined, texture)
	tagHelper.tagBoth(block, "metal_bars")
	tagHelper.checkAndAddResourceTag(block, ingredientID)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block, namespace)
	writeRecipeAdvancement(blockID, ingredientID)
	ingredientID = ingredientID.replace("cut_weathered", "weathered_cut").replace("cut_oxidized", "oxidized_cut").replace("cut_exposed", "exposed_cut")
	recipeWriter.writeRecipes(block, "bars", ingredientID)
	return block;
}

function writeLogs(block, namespace, baseBlock) {
	blockState = `{"variants":{"axis=x":{"model":"${namespace}:block/${block}_horizontal","x":90,"y":90},"axis=y":{"model":"${namespace}:block/${block}"},"axis=z":{"model":"${namespace}:block/${block}_horizontal","x":90}}}`
	blockstateHelper.writeBlockstate(block, blockState, namespace)
	modelWriter.writeLogs(block, namespace, baseBlock)
	lootTableWriter.writeLootTables(block)
	itemModelWriter.writeBlockItemModel(block, namespace)
	tagHelper.tagBoth(block, "minecraft:logs")
	recipeWriter.writeRecipes(block, "log", block.replace("log", "planks").replace("stem", "planks"))
	return block;
}

function writeWalls(block, baseBlockID, texture, defaultRecipe) {
	if (texture == undefined)
		texture = baseBlockID
	wallBlockState = stateHelper.genWalls(block, modID)
	blockstateHelper.writeBlockstate(block, wallBlockState, modID)
	modelWriter.writeWalls(block, undefined, texture)
	itemModelWriter.writeInventoryModel(block, modID)
	lootTableWriter.writeLootTables(block)
	langHelper.generateBlockLang(block)

	tagHelper.tagBoth(block, "minecraft:walls")
	if (baseBlockID.includes("bricks")) {
		tagHelper.tagBoth(block, "brick_walls")
	} else {
		tagHelper.checkAndAddResourceTag(block, baseBlockID)
	}
	if (defaultRecipe !== false) {
		writeRecipeAdvancement(block, baseBlockID)
		recipeWriter.writeShapedRecipe({ "C": `${baseBlockID}` }, id(modID, block), 6, ["CCC", "CCC"])
		recipeWriter.writeStonecutterRecipe(id(block), baseBlockID, 1)
	}

	return block;
}

function writeColumns(block, baseBlockID, texture, defaultRecipe) {
	if (helpers.columnsEnabled) {
		if (texture == undefined)
			texture = baseBlockID
		// if (texture.includes("cut")) {
		// 	console.log(texture)
		// }
		blockstateHelper.writeBlockstate(block, stateHelper.genColumn(id(block)), modID)
		modelWriter.writeProvided(block + "_center", modelHelper.generateBlockModel(block, modID, texture, "columns:block/column_center", undefined, "all"))
		modelWriter.writeProvided(block + "_end", modelHelper.generateBlockModel(block, modID, texture, "columns:block/column_end", undefined, "all"))
		modelWriter.writeProvided(block + "_inventory", modelHelper.generateBlockModel(block, modID, texture, "columns:block/column_inventory", undefined, "all"))

		itemModelWriter.writeInventoryModel(block, modID)
		lootTableWriter.writeLootTables(block, undefined, undefined, "columns")
		langHelper.generateBlockLang(block)

		tagHelper.tagBoth(block, "columns:columns", true)
		if (baseBlockID.includes("bricks")) {
			tagHelper.tagBoth(block, "brick_columns", true)
		} else {
			tagHelper.checkAndAddResourceTag(block, baseBlockID, true)
		}
		if (defaultRecipe !== false) {
			writeRecipeAdvancement(block, baseBlockID)
			recipeWriter.writeShapedRecipe({ "#": `${baseBlockID}` }, id(modID, block), 6, ["###", " # ", "###"], undefined, "columns")
			recipeWriter.writeStonecutterRecipes(id(block), baseBlockID, 1, undefined, undefined, "columns")
		}
		tagHelper.tagItem(block, "enabled", true)
	}
}

// Generates Stair blocks
function writeStairs(block, baseBlock, texture, shouldGenerateStonecutterRecipes) {
	let textureNamespace, texturePath;
	if (texture == undefined) {
		texture = baseBlock;
	}
	if (texture.includes(":")) {
		textureNamespace = texture.split(":")[0]
		texturePath = texture.split(":")[1]
	} else {
		textureNamespace = modID;
		texturePath = texture;
	}

	const stairBlockState = stateHelper.genStairs(block, modID)
	blockstateHelper.writeBlockstate(block, stairBlockState, modID)
	modelWriter.writeStairs(block, textureNamespace, texture)
	itemModelWriter.writeBlockItemModel(block, modID)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block)

	// Tag stairs
	tagHelper.tagBoth(block, "minecraft:stairs")
	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_stairs")
		tagHelper.checkAndAddStainedTag(block, baseBlock)
	} else if (baseBlock.includes("bricks")) {
		tagHelper.tagBoth(block, "brick_stairs")
	} else if ((baseBlock.includes("smooth")) || (baseBlock.includes("cut_"))) {
		tagHelper.checkAndAddResourceTag(block, baseBlock)
	} else if (baseBlock.includes("concrete")) {
		tagHelper.tagBoth(block, "concrete_stairs")
		tagHelper.checkAndAddDyedTag(block, baseBlock)
	} else {
		tagHelper.tagBlock(block, "turf_stairs")
	}

	// Generate recipes
	writeRecipeAdvancement(id(block), id(baseBlock))
	recipeWriter.writeRecipes(block, "stairs", baseBlock, modID)
	if (shouldGenerateStonecutterRecipes === true) {
		recipeWriter.writeStonecutterRecipe(block, baseBlock, 1)
	}
	return block;
}

// Generates Slab blocks.
function writeSlabs(block, baseBlock, texture, shouldGenerateStonecutterRecipes) {
	let textureNamespace, texturePath;
	if (texture == undefined) {
		texture = baseBlock;
	}
	if (texture.includes(":")) {
		textureNamespace = texture.split(":")[0]
		texturePath = texture.split(":")[1]
	} else {
		textureNamespace = modID;
		texturePath = texture;
	}

	const slabBlockState = stateHelper.genSlabs(block, modID, baseBlock)
	blockstateHelper.writeBlockstate(block, slabBlockState, modID)
	modelWriter.writeSlabs(block, textureNamespace, texture)
	itemModelWriter.writeBlockItemModel(block, modID)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeSlabLootTables(id(block))

	// Tag slabs
	tagHelper.tagBoth(block, "minecraft:slabs")
	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_slabs")
		tagHelper.checkAndAddStainedTag(block, baseBlock)
	} else if (baseBlock.includes("bricks")) {
		tagHelper.tagBlock(block, "brick_slabs")
		tagHelper.checkAndAddDyedTag(block, baseBlock)
	} else if (baseBlock.includes("smooth_") || baseBlock.includes("cut_")) {
		tagHelper.checkAndAddResourceTag(block, baseBlock)
	} else if (baseBlock.includes("concrete")) {
		tagHelper.tagBoth(block, "concrete_slabs")
		tagHelper.checkAndAddDyedTag(block, baseBlock)
	} else {
		tagHelper.tagBlock(block, "turf_slabs")
	}

	// Generate recipes
	writeRecipeAdvancement(id(block), id(baseBlock))
	recipeWriter.writeRecipes(block, "slabs", baseBlock, modID)
	if (shouldGenerateStonecutterRecipes === true) {
		recipeWriter.writeStonecutterRecipe(block, baseBlock, 2)
	}
	return block;
}

function writePlates(block, baseBlockID, texture) {
	let namespace = modID
	if (block.includes(":"))
		namespace = helpers.getNamespace(block)
	if (texture == undefined)
		texture = baseBlockID
	let baseBlockPath = helpers.getPath(baseBlockID)
	const plateBlockState = stateHelper.genPressurePlates(block, namespace)
	blockstateHelper.writeBlockstate(block, plateBlockState)
	modelWriter.writePressurePlates(block, texture)
	itemModelWriter.writeBlockItemModel(block, namespace, namespace)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block)

	if (baseBlockPath.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_pressure_plates", true)
		tagHelper.checkAndAddStainedTag(block, baseBlockPath)
	} else {
		tagHelper.tagBlock(block, "minecraft:pressure_plates", true)
	}
	writeRecipeAdvancement(id(block), baseBlockID)
	recipeWriter.writeRecipes(block, "plates", baseBlockID)
	return block;
}

function writeButtons(block, baseBlockID, texture, type) {
	let namespace = modID
	if (block.includes(":"))
		namespace = helpers.getNamespace(block)
	let baseNamespace = helpers.getNamespace(baseBlockID)
	let baseBlock = helpers.getPath(baseBlockID)
	if (type == undefined) {
		type = "buttons"
	}
	let buttonBlockState = stateHelper.genButtons(block, modID, baseBlock)
	blockstateHelper.writeBlockstate(block, buttonBlockState)
	modelWriter.writeButtons(block, baseNamespace, texture)
	itemModelWriter.writeInventoryModel(block)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block)

	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_buttons", true)
	} else {
		tagHelper.tagBoth(block, "metal_buttons", true)
		tagHelper.checkAndAddResourceTag(block, baseBlockID)
	}
	writeRecipeAdvancement(id(block), baseBlockID)
	recipeWriter.writeRecipes(block, type, baseBlock, namespace, baseNamespace)
	return block;
}

function writeFences(block, namespace, baseBlock) {
	fenceBlockState = stateHelper.genFences(block, namespace, baseBlock)
	blockstateHelper.writeBlockstate(block, fenceBlockState)
	modelWriter.writeFences(block, baseBlock, namespace)
	itemModelWriter.writeInventoryModel(block)
	lootTableWriter.writeLootTables(block)

	tagHelper.tagBoth(block, "fences")
	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_fences", true)
	}
	writeRecipeAdvancement(id(block), id(baseBlock))
	recipeWriter.writeRecipes(block, "fences", baseBlock, namespace)
	return block;
}

function writeFenceGates(block, namespace, baseBlockID) {
	const baseNamespace = helpers.getNamespace(baseBlockID)
	const baseBlock = helpers.getPath(baseBlockID)
	fenceGateBlockState = stateHelper.genFenceGates(block, namespace)
	blockstateHelper.writeBlockstate(block, fenceGateBlockState, namespace, baseBlock)
	modelWriter.writeFenceGates(block, baseNamespace, baseBlock, baseNamespace)
	itemModelWriter.writeBlockItemModel(block, namespace, baseNamespace)
	langHelper.generateBlockLang(block)
	lootTableWriter.writeLootTables(block)

	// Tag Fence Gates
	tagHelper.tagBoth(block, "minecraft:fence_gates", true)
	if (baseBlock.includes("planks")) {
		tagHelper.tagBlock(block, "minecraft:mineable/axe", true)
	} else {
		tagHelper.tagBlock(block, "minecraft:mineable/pickaxe", true)
	}

	// Recipes
	writeRecipeAdvancement(id(block), baseBlockID)
	recipeWriter.writeRecipes(block, "fence_gates", baseBlockID, namespace)
	return block;
}

function writeTerracotta(block, dye, namespace) {
	block = block + "_terracotta"
	tagHelper.tagBoth(block, `c:dyed/${dye}`)
	tagHelper.tagBoth(block, `terracotta`)
	writeRecipeAdvancement(block, id(dye + "_dye"))
	tagHelper.tagItem(block, "enabled", true)
	return writeBlock(id(namespace, block), "terracotta", dye)
}

function writeConcrete(block, dye, namespace) {
	block = block + "_concrete"
	tagHelper.tagBoth(block, `c:dyed/${dye}`)
	tagHelper.tagBoth(block, `c:concrete`)
	tagHelper.tagBlock(block, `minecraft:mineable/pickaxe`)
	tagHelper.tagItem(block, "enabled", true)
	return writeBlock(id(namespace, block), "concrete", dye)
}

function writeConcretePowder(block, dye, namespace) {
	block = block + "_concrete_powder"
	tagHelper.tagBoth(block, `c:dyed/${dye}`)
	tagHelper.tagBoth(block, `c:concrete_powder`)
	tagHelper.tagBlock(block, `minecraft:mineable/shovel`)
	writeRecipeAdvancement(block, id(dye + "_dye"))
	tagHelper.tagItem(block, "enabled", true)
	return writeBlock(id(namespace, block), "concrete_powder", dye, undefined, block)
}

function writeLamps(block, type, texture) {
	writeRecipeAdvancement(id(block), id(mc, "redstone_lamp"))
	tagHelper.tagItem(block, "enabled", true)
	return writeBlock(block, "lamps", type, undefined, texture, false)
}

function writeWool(block, dye, namespace) {
	tagHelper.tagBoth(block, `c:dyed/${dye}`)
	writeRecipeAdvancement(id(block), id(dye + "_dye"))
	tagHelper.tagItem(block, "enabled", true)
	return writeBlock(id(namespace, block), "wool", dye, undefined, undefined, undefined, false)
}

function writeTerracottaBricks(block, namespace, special, baseBlock, stonelike) {
	const blockState = stateHelper.gen(`${block}_north_west_mirrored`, namespace)
	blockstateHelper.writeBlockstate(block, blockState, namespace)
	modelWriter.writeMirroredBricks(block, namespace, block)
	itemModelWriter.writeBlockItemModel(block, namespace)
	writeRecipeAdvancement(id(block), id(baseBlock))
	recipeWriter.writeRecipes(block, special, baseBlock, namespace)
	lootTableWriter.writeLootTables(block)
	if (block.includes("terracotta")) {
		tagHelper.tagBlock(block, "terracotta_bricks")
	}
	else {
		tagHelper.tagBlock(block, "bricks")
	}
	if (stonelike !== false)
		recipeWriter.writeStonecutterRecipe(block, baseBlock, 1)
}


module.exports = {
	writeCarpet: writeCarpet,
	writeBlock: writeBlock,
	writeBars: writeBars,
	writeButtons: writeButtons,
	writeLeverBlock: writeLeverBlock,
	writeDoors: writeDoors,
	writeTrapdoors: writeTrapdoors,
	writeLamps: writeLamps,
	writeWool: writeWool,
	writeTerracotta: writeTerracotta,
	writeTerracottaBricks: writeTerracottaBricks,
	writeConcrete: writeConcrete,
	writeConcretePowder: writeConcretePowder,
	writeSlabs: writeSlabs,
	writeStairs: writeStairs,
	writePlates: writePlates,
	writeFences: writeFences,
	writeFenceGates: writeFenceGates,
	writeCraftingTableBlock: writeCraftingTableBlock,
	writeLadders: writeLadders,
	writeSigns: writeSigns,
	writeHangingSigns: writeHangingSigns,
	writeWalls: writeWalls,
	writeWallGates: writeWallGates,
	writeTorchBlock: writeTorchBlock,
	writePanes: writePanes,
	writeLogs: writeLogs,
	writeUprightColumnBlock: writeUprightColumnBlock,
	writeOrientableBlock: writeOrientableBlock,
	writeCabinetBlock: writeCabinetBlock,
	writeShelfBlock: writeShelfBlock,
	writeChiseledBlock: writeChiseledBlock,
	writeFlower: writeFlower,
	writePoweredBlock: writePoweredBlock,
	writeBibliocraftBlock: writeBibliocraftBlock,
	writeColumns: writeColumns,
	writeStoveBlock: writeStoveBlock,
	writeChestBlock: writeChestBlock

}