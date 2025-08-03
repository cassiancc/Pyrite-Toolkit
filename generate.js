const langHelper = require('./helpers/language');
const tagHelper = require('./helpers/tags');
const helpers = require('./helpers/helpers');
const recipeWriter = require('./writers/recipes');
const blockWriter = require("./writers/blocks")
const { writeRecipeAdvancement } = require('./writers/advancements');
const itemModelWriter = require('./writers/item_models');
const vanillaConstants = require('./helpers/constants');
const fs = require('fs');

const advancements = require('./writers/advancements');


// Shorthand for helper functions. These will likely be removed later as the code is fully modularized.
const id = helpers.id;
const readFileAsJson = helpers.readFileAsJson

const modID = helpers.modID;
const mc = helpers.mc;
const mcVersion = helpers.mcVersion;
const majorVersion = helpers.majorVersion
const minorVersion = helpers.minorVersion

const pyriteDyes = ["glow", "dragon", "star", "honey", "nostalgia", "rose", "poisonous",]

const dyes = helpers.vanillaDyes.concat(pyriteDyes)

const vanillaWood = ["spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "bamboo", "crimson", "warped"]

const vanillaWalls = [
	"cobblestone",
	"mossy_cobblestone",
	"stone_brick",
	"mossy_stone_brick",
	"granite",
	"diorite",
	"andesite",
	"cobbled_deepslate",
	"polished_deepslate",
	"deepslate_brick",
	"deepslate_tile",
	"brick",
	"mud_brick",
	"sandstone",
	"red_sandstone",
	"prismarine",
	"nether_brick",
	"red_nether_brick",
	"blackstone",
	"polished_blackstone",
	"polished_blackstone_brick",
	"end_stone_brick",
];

let blockIDs = []

class Block {  // Create a class
	constructor(blockID, blockType, baseBlock, material, textureID, stonecutter) {
		// Initialize with basic variables
		this.blockID = blockID;
		this.namespace = modID
		if (blockID.includes(":")) {
			this.namespace = helpers.getNamespace(blockID)
		}
		if (!baseBlock.includes(":")) {
			this.baseNamespace = this.namespace
		}
		else {
			this.baseNamespace = helpers.getNamespace(baseBlock)
		}
		if (textureID == undefined) {
			this.textureID = id(baseBlock)
		}
		this.blockType = blockType;
		this.baseBlock = baseBlock;
		this.material = material;

		//Add to global list of blocks.
		blockIDs.push(blockID)

		//Add to global list of block translations.
		this.addTranslation()

		let stonelike = false;
		if ((material === "stone") || (material.includes("brick")) || (material === "concrete") || (vanillaConstants.vanillaResourceBlocks.includes(material))) {
			stonelike = true;
		}

		//Generate block state
		if (blockType === "block") {
			if (textureID == undefined)
				this.textureID = id(this.blockID)
			if (stonelike && stonecutter == undefined) {
				stonecutter = 1
			}
			blockWriter.writeBlock(id(this.namespace, this.blockID), blockType, this.baseBlock, undefined, textureID, stonecutter)
		}
		else if (blockType === "slab") {
			blockWriter.writeSlabs(id(this.namespace, this.blockID), id(this.baseNamespace, this.baseBlock), textureID, stonelike)
		}
		else if (blockType === "stairs") {
			blockWriter.writeStairs(id(this.namespace, this.blockID), id(this.baseNamespace, this.baseBlock), textureID, stonelike)
		}
		else if (blockType === "wall") {
			blockWriter.writeWalls(this.blockID, this.baseBlock, this.baseBlock)
		}
		else if (blockType === "column") {
			blockWriter.writeColumns(this.blockID, this.baseBlock, this.baseBlock)
		}
		else if (blockType === "wall_gate") {
			blockWriter.writeWallGates(this.blockID, this.baseBlock, this.textureID)
		}
		else if (blockType === "fence") {
			blockWriter.writeFences(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "fence_gate") {
			blockWriter.writeFenceGates(this.blockID, this.namespace, id(this.baseNamespace, this.baseBlock))
		}
		else if (blockType === "ladder") {
			blockWriter.writeLadders(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "sign") {
			blockWriter.writeSigns(this.blockID, id(modID, this.baseBlock))
		}
		else if (blockType === "hanging_sign") {
			blockWriter.writeHangingSigns(this.blockID, id(modID, this.baseBlock))
		}
		else if (blockType === "door") {
			blockWriter.writeDoors(this.blockID, this.baseBlock)
		}
		else if (blockType === "trapdoor") {
			blockWriter.writeTrapdoors(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "crafting_table") {
			blockWriter.writeCraftingTableBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "chest") {
			blockWriter.writeChestBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "button") {
			blockWriter.writeButtons(this.blockID, id(this.baseNamespace, this.baseBlock), id(this.baseNamespace, this.baseBlock))
		}
		else if (blockType === "torch") {
			blockWriter.writeTorchBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "torch_lever") {
			blockWriter.writeLeverBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if ((blockType === "mushroom_stem") || (blockType === "log")) {
			blockWriter.writeLogs(this.blockID, this.namespace, this.baseBlock)
			if (blockType == "mushroom_stem") {
				tagHelper.tagBoth(this.blockID, "mushroom_stem")
			}
			else {
				let woodType = blockID.replace("_log", "_logs").replace("stripped_", "")
				tagHelper.tagItem(this.blockID, woodType)
			}
		}
		else if (blockType == "wood") {
			blockWriter.writeBlock(this.blockID, blockType, this.baseBlock, undefined, this.baseBlock, false, true)
			let woodType = blockID.replace("_wood", "_logs").replace("stripped_", "")
			tagHelper.tagItem(this.blockID, woodType)
		}
		else if (blockID.includes("cobblestone_bricks") || (blockType === "terracotta_bricks")) {
			if (material.includes("mossy")) {
				stonelike = false
			}
			blockWriter.writeTerracottaBricks(this.blockID, this.namespace, blockType, this.baseBlock, stonelike)
		}
		else if ((blockType === "stone_bricks") || (blockType === "mossy_stone_bricks") || (blockType === "cut_stone")) {
			if (material.includes("mossy")) {
				stonelike = false
			}
			blockWriter.writeBlock(id(this.namespace, this.blockID), this.blockType, this.baseBlock, undefined, id(this.namespace, this.blockID), stonelike, true)
		}
		else if ((blockType === "framed_glass_pane") || (blockType === "stained_framed_glass_pane") || (blockType === "glass_pane")) {
			let shatters = false;
			if (blockType == "glass_pane") {
				shatters = true
			}
			blockWriter.writePanes(this.blockID, this.namespace, this.baseBlock, shatters)
		}
		else if (blockType === "pressure_plate") {
			blockWriter.writePlates(this.blockID, id(this.baseNamespace, this.baseBlock))
		}
		else if (blockType == "framed_glass") {
			tagHelper.tagBoth(blockID, "c:glass_blocks/colorless")
			blockWriter.writeBlock(id(this.namespace, this.blockID), this.blockType, this.baseBlock, "cutout", undefined, false, "minecraft:glass")
		}
		else if ((blockType == "stained_framed_glass") || (blockType == "stained_glass")) {
			let recipeIngredient, shatters = false;
			if (blockType === "stained_framed_glass") {
				recipeIngredient = "pyrite:framed_glass"
			}
			else if (blockType === "stained_glass") {
				recipeIngredient = "minecraft:glass"
				shatters = true
			}
			tagHelper.tagBoth(blockID, "c:glass_blocks")
			blockWriter.writeBlock(id(this.namespace, this.blockID), this.blockType, this.baseBlock, "translucent", undefined, undefined, recipeIngredient, undefined, shatters)
		}
		else if ((blockType == "locked_chest") || (blockType == "facing")) {
			blockWriter.writeOrientableBlock(this.blockID, this.namespace, this.blockType, this.baseBlock)
		}
		else if ((blockType == "cabinet")) {
			blockWriter.writeCabinetBlock(this.blockID, this.namespace, this.blockType, this.baseBlock)
		}
		else if (blockType == "nostalgia_grass_block") {
			blockWriter.writeUprightColumnBlock(this.blockID, this.namespace, this.blockType, id(mc, this.baseBlock), this.blockID)
		}
		else if ((blockType == "nostalgia") || (blockType == "nostalgia_resource") || (blockType == "smooth_resource")) {
			if (textureID == undefined)
				this.textureID = id(this.blockID)
			let tagBase = helpers.getPath(this.baseBlock).replace("_block", "")
			tagHelper.checkAndAddBeaconTag(blockID, tagBase)
			tagHelper.checkAndAddResourceTag(blockID, tagBase)
			blockWriter.writeBlock(id(this.namespace, this.blockID), this.blockType, this.baseBlock, undefined, this.textureID, stonelike, true)
		}
		else if (blockType == "bibliocraft_bookcase") {
			blockWriter.writeBibliocraftBlock(blockID, this.blockType, this.baseBlock, "bibliocraft:block/template/bookcase/bookcase", this.textureID)
		}
		else {
			let recipeIngredient;
			if (blockType == "planks")
				recipeIngredient = "#minecraft:planks"
			else if (blockType == "bricks")
				recipeIngredient = "minecraft:bricks"
			else if (blockType == "lamp")
				recipeIngredient = id("glowstone_lamp")
			else if (blockType.includes("nether_bricks"))
				recipeIngredient = "minecraft:nether_bricks"
			else {
				recipeIngredient = this.baseBlock
			}
			if (textureID == undefined)
				this.textureID = id(this.blockID)
			blockWriter.writeBlock(id(this.namespace, this.blockID), this.blockType, this.baseBlock, undefined, this.textureID, false, recipeIngredient)
		}
		if (this.namespace == "pyrite") {
			tagHelper.tagItem(id(this.namespace, this.blockID), "enabled", true)
		}

	}
	generateFullID() {
		console.log(`${this.namespace}:${this.blockID}`)
	}
	addTranslation() {
		return langHelper.generateLang(this.blockID, "block", this.namespace)
	}
}

function generatePyriteOddities() {
	pyriteDyes.forEach(function (dye) {
		writeDye(dye)
		blockWriter.writeWool(dye + "_wool", dye, modID)
		blockWriter.writeCarpet(dye + "_carpet", modID, dye + "_wool")
		blockWriter.writeTerracotta(dye, dye, modID)
		const concrete = dye + "_concrete"
		blockWriter.writeConcrete(dye, dye, modID)
		blockWriter.writeConcretePowder(dye, dye, modID)
		new Block(concrete + "_slab", "slab", id(modID, concrete), "concrete", id(modID, concrete))
		new Block(concrete + "_stairs", "stairs", id(modID, concrete), "concrete", id(modID, concrete))
		new Block(dye + "_stained_glass", "stained_glass", dye, "stained_glass")
		new Block(dye + "_stained_glass_pane", "glass_pane", dye + "_stained_glass", "stained_framed_glass_pane")
	})
	pyriteDyes.forEach(function(dye) {
		recipeWriter.writeStonecutteRecipes([`${dye}_terracotta_brick_column`], `pyrite:${dye}_terracotta`, 1, undefined, `from_${dye}_terracotta`, "columns")
	})
	blockWriter.writeBlock("nostalgia_cobblestone", "nostalgia_cobblestone", "nostalgia_cobblestone")
	blockWriter.writeBlock("nostalgia_mossy_cobblestone", "nostalgia_mossy_cobblestone", "nostalgia_mossy_cobblestone")
	blockWriter.writeBlock("nostalgia_netherrack", "nostalgia_netherrack", "nostalgia_netherrack")
	blockWriter.writeBlock("nostalgia_gravel", "nostalgia_gravel", "nostalgia_gravel")
	new Block("nostalgia_grass_block", "nostalgia_grass_block", "grass_block", "grass")
	// Nostalgia Turf Set
	generateTurfSet("nostalgia_grass", "pyrite:nostalgia_grass_block")
	new Block("nostalgia_glowing_obsidian", "nostalgia", id("glowing_obsidian"), "obsidian")
	new Block("locked_chest", "locked_chest", "locked_chest", "wood")


	vanillaConstants.vanillaResourceBlocks.forEach(function (block) {
		new Block(`nostalgia_${block}_block`, "nostalgia_resource", id(mc, baseBlock), block)
	})
	copperBlocks.forEach(function(block) {
		blockWriter.writeBlock(`waxed_nostalgia_${block}_block`, "nostalgia_resource", id(mc, block), undefined, id(`nostalgia_${block}_block`), false, true, false, false)
	})

	blockWriter.writeFlower("rose")
	blockWriter.writeFlower("blue_rose")
	blockWriter.writeFlower("orange_rose")
	blockWriter.writeFlower("white_rose")
	blockWriter.writeFlower("pink_rose")
	blockWriter.writeFlower("paeonia")
	blockWriter.writeFlower("pink_daisy")
	blockWriter.writeFlower("buttercup")


	// Azalea
	const azalea = "azalea_log"
	generateWoodSet("azalea", azalea, true)
	new Block(azalea, "log", azalea, "wood")
	new Block("stripped_"+azalea, "log", "stripped_"+azalea, "wood")
	new Block("azalea_wood", "wood", azalea, "wood", "azalea_log")
	new Block("stripped_azalea_wood", "wood", "stripped_azalea_log", "wood")
	blockWriter.writePoweredBlock(id(modID, "switchable_glass"))
		// Red Mushroom
	const redShroom = "red_mushroom"
	generateWoodSet(redShroom)
	new Block(redShroom + "_stem", "mushroom_stem", "minecraft:mushroom_stem", "wood")
	// Brown Mushroom
	const brownShroom = "brown_mushroom"
	generateWoodSet(brownShroom)
	new Block(brownShroom + "_stem", "mushroom_stem", "minecraft:mushroom_stem", "wood")
	// Vanilla Crafting Tables
	writeCraftingTablesFromArray(vanillaWood, mc)
	if (helpers.versionAbove("1.21.4")) {
		writeCraftingTablesFromArray(["pale_oak"], mc)
	}
	writeCraftingTablesFromArray(["skyroot"], "aether")

}

function generatePyriteResources() {

	helpers.populateTemplates()

	new Block("torch_lever", "torch_lever", id(mc,"torch"), "torch")
	new Block("redstone_torch_lever", "torch_lever", id(mc,"redstone_torch"), "torch")
	new Block("soul_torch_lever", "torch_lever", id(mc,"soul_torch"), "torch")

	helpers.vanillaDyes.forEach(function (dye) {
		let stainedBlockTemplate = dye + "_stained"
		let terracottaID = `${helpers.getDyeNamespace(dye)}:${dye}_terracotta`;
		generateWoodSet(stainedBlockTemplate)
		generateBrickSet(dye)
		generateBrickSet(dye + "_terracotta_bricks", "terracotta_bricks", terracottaID)
		recipeWriter.writeDyeRecipe(id("terracotta_bricks"), dye+"_terracotta_bricks", dye, "_from_terracotta_bricks")
		recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], terracottaID)

		// Lamps
		new Block(dye + "_lamp", "lamp", dye, "lamp")
		//Torches
		new Block(dye + "_torch", "torch", dye, "torch")
		new Block("unlit_" + dye + "_torch", "torch", dye, "torch")
		//Torch Levers
		new Block(dye + "_torch_lever", "torch_lever", dye, "torch")
		//Framed Glass
		new Block(dye + "_framed_glass", "stained_framed_glass", dye, "stained_framed_glass")
		//Framed Glass Panes
		new Block(dye + "_framed_glass_pane", "stained_framed_glass_pane", dye, "stained_framed_glass_pane")
		// Concrete Slabs and Stairs
		const concrete = dye + "_concrete"
		blockWriter.writeSlabs(concrete + "_slab", id(mc, concrete), id(mc, concrete), true)
		blockWriter.writeStairs(concrete + "_stairs", id(mc, concrete), id(mc, concrete), true)
	})

	// Aether compat
	writeWallGatesFromArray(["holystone", "mossy_holystone", "holystone_brick", "icestone", "aerogel", "carved", "angelic", "hellfire"], "aether", ["holystone", "mossy_holystone", "holystone_bricks", "icestone", "aerogel", "carved_stone", "angelic_stone", "hellfire_stone"])


	// Cobblestone Bricks
	generateBrickSet("cobblestone_bricks", "terracotta_bricks", "minecraft:cobblestone", true)
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:cobblestone")
	//Cobbled Deepslate Bricks
	generateBrickSet("cobbled_deepslate_bricks", "terracotta_bricks", "minecraft:cobbled_deepslate", true)
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:cobbled_deepslate")
	// Sandstone
	generateBrickSet("sandstone_bricks", "terracotta_bricks", "minecraft:cut_sandstone", false)
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:sandstone")
	recipeWriter.writeStonecutterRecipes(["sandstone_brick_stairs", "sandstone_brick_slab", "sandstone_brick_wall", "sandstone_brick_wall_gate"], "minecraft:cut_sandstone", 1, undefined, "from_cut_sandstone")
	recipeWriter.writeStonecutterRecipes("sandstone_bricks", "minecraft:sandstone", 1, undefined, "from_sandstone")
	// Red Sandstone
	generateBrickSet("red_sandstone_bricks", "terracotta_bricks", "minecraft:cut_red_sandstone", false)
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:red_sandstone")
	recipeWriter.writeStonecutterRecipes(["red_sandstone_brick_stairs", "red_sandstone_brick_slab", "red_sandstone_brick_wall", "red_sandstone_brick_wall_gate"], "minecraft:cut_red_sandstone", 1, undefined, "from_cut_sandstone")
	recipeWriter.writeStonecutterRecipes("red_sandstone_bricks", "minecraft:red_sandstone", 1, undefined, "from_sandstone")
	// Smooth Stone
	blockWriter.writeStairs("smooth_stone_stairs", id(mc, "smooth_stone"), id(mc, "smooth_stone"), true)
	generateBrickSet("smooth_stone_bricks", "stone_bricks", "minecraft:smooth_stone", true, "cut_smooth_stone")
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:smooth_stone")
	// Granite
	generateBrickSet("granite_bricks", "stone_bricks", "minecraft:polished_granite", true, "cut_granite")
	recipeWriter.writeShortcutRecipes(["bricks", "brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:granite")
	recipeWriter.writeStonecutterRecipes(["granite_brick_stairs", "granite_brick_slab", "granite_brick_wall", "granite_brick_wall_gate"], "minecraft:polished_granite", 1, undefined, "from_polished_granite")
	// Andesite
	generateBrickSet("andesite_bricks", "stone_bricks", "minecraft:polished_andesite", true, "cut_andesite")
	recipeWriter.writeShortcutRecipes(["bricks", "brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:andesite")
	recipeWriter.writeStonecutterRecipes(["andesite_brick_stairs", "andesite_brick_slab", "andesite_brick_wall", "andesite_brick_wall_gate"], "minecraft:polished_andesite", 1, undefined, "from_polished_andesite")
	// Diorite
	generateBrickSet("diorite_bricks", "stone_bricks", "minecraft:polished_diorite", true, "cut_diorite", "cut_diorite")
	recipeWriter.writeShortcutRecipes(["bricks", "brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:diorite")
	recipeWriter.writeStonecutterRecipes(["diorite_brick_stairs", "diorite_brick_slab", "diorite_brick_wall", "diorite_brick_wall_gate"], "minecraft:polished_diorite", 1, undefined, "from_polished_diorite")
	// Calcite
	generateBrickSet("calcite_bricks", "stone_bricks", "minecraft:calcite", true, "cut_calcite")
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:calcite")
	// Tuff
	if (majorVersion > 20)
		generateMossyBrickSet("tuff_bricks", "minecraft:tuff_bricks")
	// Deepslate
	generateMossyBrickSet("deepslate_bricks", "minecraft:deepslate_bricks")

	generateBrickSet("terracotta_bricks", "terracotta_bricks", "minecraft:terracotta", false)
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:terracotta")

	//Framed Glass
	new Block("framed_glass", "framed_glass", "framed_glass", "framed_glass")
	// Framed Glass Panes
	blockWriter.writePanes("framed_glass_pane", modID, "framed_glass")
	// new Block("framed_glass_pane", globalNamespace, undefined, "framed_glass_pane", "framed_glass_pane", "framed_glass_pane")


	// Podzol
	generateTurfSet("podzol", id(mc, "podzol"))
	// Grass Turf Set
	generateTurfSet("grass", id(mc, "grass_block"))
	// Mycelium Turf Set
	generateTurfSet("mycelium", id(mc, "mycelium"))
	// Path Turf Set
	generateTurfSet("path", id(mc, "dirt_path"))

	// Lamps
	blockWriter.writeLamps("glowstone_lamp", "glowstone")
	blockWriter.writeLamps("lit_redstone_lamp", "lit_redstone", "minecraft:redstone_lamp_on")

	// April Fools Blocks
	new Block("glowing_obsidian", "glowing_obsidian", id(mc, "obsidian"), "obsidian")

	// Nether Brick Sets
	generateBrickSet("charred_nether_bricks", "charred_nether_bricks")
	generateBrickSet("blue_nether_bricks", "blue_nether_bricks")

	// 1.20 and below walls
	writeWallGatesFromArray(vanillaWalls)
	recipeWriter.writeStonecutterRecipes(["polished_blackstone_wall_gate", "polished_blackstone_brick_wall_gate"], "minecraft:blackstone", 1, undefined, "from_blackstone")
	recipeWriter.writeStonecutterRecipes(["deepslate_brick_wall_gate", "deepslate_tile_wall_gate"], "minecraft:polished_deepslate", 1, undefined, "from_polished_deepslate")
	recipeWriter.writeStonecutterRecipes(["deepslate_brick_wall_gate", "deepslate_tile_wall_gate", "polished_deepslate_wall_gate"], "minecraft:cobbled_deepslate", 1, undefined, "from_cobbled_deepslate")
	recipeWriter.writeStonecutterRecipe("deepslate_tile_wall_gate", "minecraft:deepslate", 1, undefined, "from_deepslate")
	recipeWriter.writeStonecutterRecipe("deepslate_tile_wall_gate", "minecraft:deepslate_bricks", 1, undefined, "from_deepslate_bricks")
	recipeWriter.writeStonecutterRecipe("stone_brick_wall_gate", "minecraft:stone", 1, undefined, "from_stone")
	recipeWriter.writeStonecutterRecipe("end_stone_brick_wall_gate", "minecraft:end_stone", 1, undefined, "from_end_stone")
	recipeWriter.writeStonecutterRecipe("polished_blackstone_brick_wall_gate", "minecraft:polished_blackstone", 1, undefined, "from_polished_blackstone")

	// 1.21 - Tricky Trials Tuff walls
	if (majorVersion >= 21) {
		writeWallGatesFromArray(["polished_tuff", "tuff_brick", "tuff"])
		recipeWriter.writeStonecutterRecipe("tuff_brick_wall_gate", "minecraft:polished_tuff", 1, undefined, "from_polished_tuff")
		recipeWriter.writeStonecutterRecipes(["polished_tuff_wall_gate", "tuff_brick_wall_gate"], "minecraft:tuff", 1, undefined, "from_tuff")
	}

	// 1.21.4 - Garden Awakens Resin walls
	if (majorVersion > 22 || (mcVersion.includes("1.21.4"))) {
		writeWallGatesFromArray(["resin_brick"])
	}
	const copperBlocks = ["copper", "exposed_copper", "weathered_copper", "oxidized_copper"]

	copperBlocks.forEach(function(block) {
		let cutBlock = `cut_${block}`
		
		let baseCutBlockID = id(mc, cutBlock.replace("cut_weathered", "weathered_cut").replace("cut_oxidized", "oxidized_cut").replace("cut_exposed", "exposed_cut"))
		let baseWaxedCutBlockID = id(mc, "waxed_"+helpers.getPath(baseCutBlockID))
		let baseBlock = block
		if (block == "copper") {
			baseBlock = "copper_block"
		}
		blockWriter.writeColumns(`waxed_${cutBlock}_column`, baseCutBlockID)
		blockWriter.writeWalls(`waxed_${cutBlock}_wall`, baseCutBlockID, undefined, false)
		blockWriter.writeWallGates(`waxed_${cutBlock}_wall_gate`, baseCutBlockID)
		const smooth = `smooth_${block}`
		const smoothID = id(modID, smooth)
		blockWriter.writeBlock("waxed_"+smooth, "smooth_resource", id(mc, block), undefined, smoothID, false, true, false, false)
		new Block(`waxed_${smooth}_slab`, "slab", smoothID, block, smoothID)
		new Block(`waxed_${smooth}_stairs`, "stairs", smoothID, block, smoothID)
		blockWriter.writeColumns(`waxed_${smooth}_column`, smoothID, smoothID, false)
		blockWriter.writeWalls(`waxed_${smooth}_wall`, smoothID, smoothID, false)
		blockWriter.writeWallGates(`waxed_${smooth}_wall_gate`, smoothID, smoothID)
		blockWriter.writeBlock(`waxed_${block}_bricks`, "resource_bricks", baseCutBlockID, undefined, block + "_bricks", false, false, undefined, undefined, false)
		blockWriter.writeChiseledBlock(`waxed_${block}_pillar`, id(mc, block), "resource_pillar", `${block}_pillar`, false)
		recipeWriter.writeStonecutterRecipes([`waxed_${block}_bricks`, `waxed_${smooth}_stairs`, `waxed_${smooth}_wall`, `waxed_${smooth}_wall_gate`], id(mc, "waxed_"+ baseBlock), 1, undefined, "from_"+block)
		recipeWriter.writeStonecutterRecipes([`waxed_${smooth}_slab`], id(mc, "waxed_"+ baseBlock), 2, undefined, "from_"+block)
		blockWriter.writeBars("waxed_"+block, modID, baseWaxedCutBlockID, block+"_bars")

		let waxedBlocks = [
			`waxed_${cutBlock}_wall`, `waxed_${cutBlock}_wall_gate`, 
			"waxed_"+smooth, `waxed_${smooth}_slab`, `waxed_${smooth}_stairs`, `waxed_${smooth}_wall`, `waxed_${smooth}_wall_gate`,
			`waxed_${block}_bricks`, `waxed_${block}_pillar`, "waxed_"+block+"_bars", `waxed_${smooth}_column`, `waxed_${cutBlock}_column`
		]
		tagHelper.tagItems(waxedBlocks, "enabled", true)
		waxedBlocks.forEach(function(waxedBlock) {
			recipeWriter.writeShapelessRecipe([id(waxedBlock.replace("waxed_", "")), "minecraft:honeycomb"], id(waxedBlock), 1)
			count = 4
			if (block.includes("slab")) {
				count = 8
			}
			recipeWriter.writeStonecutterRecipe(id(waxedBlock), id("minecraft", "waxed_"+ baseBlock), count)
		})
		
		helpers.generateNeoWaxables(waxedBlocks)
		helpers.generateNeoOxidizables(waxedBlocks, block)

	})

	vanillaConstants.vanillaResourceBlocks.forEach(function (block) {
		let baseBlock = block
		let altNamespace;
		let cutBlock = `cut_${block}`
		let baseCutBlockID = id(cutBlock)
		let baseTexture = block + "_block";
		// Cut Blocks - Copper is ignored.
		if (block.includes("copper")) {
			baseTexture = block;
			altNamespace = mc
			// Vanilla swaps Cut and Oxidization state
			baseCutBlockID = id(mc, cutBlock.replace("cut_weathered", "weathered_cut").replace("cut_oxidized", "oxidized_cut").replace("cut_exposed", "exposed_cut"))
			recipeWriter.writeStonecutterRecipes([`${cutBlock}_wall`, `${cutBlock}_wall_gate`], id(mc, baseBlock), 4, undefined, "from_"+baseBlock)
		}
		else {
			baseBlock = baseTexture;
			altNamespace = modID
			blockWriter.writeBlock(cutBlock, cutBlock, id(mc, baseBlock), undefined, cutBlock, 4, true)
			blockWriter.writeSlabs(`${cutBlock}_slab`, cutBlock, id(altNamespace, cutBlock), true)
			blockWriter.writeStairs(`${cutBlock}_stairs`, cutBlock, id(altNamespace, cutBlock), true)
			recipeWriter.writeStonecutterRecipes([`${cutBlock}_slab`], id(mc, baseBlock), 8, undefined, "from_"+baseBlock)
			recipeWriter.writeStonecutterRecipes([`${cutBlock}_stairs`, `${cutBlock}_wall`, `${cutBlock}_wall_gate`], id(mc, baseBlock), 4, undefined, "from_"+baseBlock)
			tagHelper.tagItems([cutBlock, `${cutBlock}_slab`, `${cutBlock}_stairs`, `${cutBlock}_wall`, `${cutBlock}_wall_gate`], "enabled", true)

		}

		blockWriter.writeColumns(`cut_${block}_column`, baseCutBlockID)
		blockWriter.writeWalls(`${cutBlock}_wall`, baseCutBlockID)
		blockWriter.writeWallGates(`${cutBlock}_wall_gate`, baseCutBlockID)
		tagHelper.tagItems([`cut_${block}_column`, `${cutBlock}_wall`, `${cutBlock}_wall_gate`], "enabled", true)

		// Smooth, Chiseled, Brick, and Pillar blocks. Quartz is mostly ignored - Walls and Wall Gates are generated.
		if (block === "quartz") {
			baseTexture = baseBlock + "_top"
			// Vanilla uses quartz's bottom texture instead of a dedicated smooth texture.
			blockWriter.writeColumns(`smooth_${block}_column`, id(mc, "smooth_quartz"), id(mc, "quartz_block_bottom"))
			blockWriter.writeWalls(`smooth_${block}_wall`, "minecraft:quartz_block", id(mc, "quartz_block_bottom"))
			blockWriter.writeWallGates(`smooth_${block}_wall_gate`, "minecraft:quartz_block", id(mc, "quartz_block_bottom"))
			tagHelper.tagItems([`smooth_${block}_column`, `smooth_${block}_wall`, `smooth_${block}_wall_gate`], "enabled", true)
		}
		else {
			const smooth = `smooth_${block}`
			const smoothID = id(modID, smooth)
			new Block(smooth, "smooth_resource", id(mc, baseBlock), block, undefined, 4)
			new Block(`${smooth}_slab`, "slab", smoothID, block)
			new Block(`${smooth}_stairs`, "stairs", smoothID, block)
			blockWriter.writeColumns(smooth+`_column`, smoothID)
			blockWriter.writeWalls(`${smooth}_wall`, smoothID, smoothID)
			blockWriter.writeWallGates(`${smooth}_wall_gate`, smoothID, smoothID)
			blockWriter.writeBlock(`${block}_bricks`, "resource_bricks", baseCutBlockID, undefined, block + "_bricks", true)
			blockWriter.writeChiseledBlock(`${block}_pillar`, id(mc, baseBlock), "resource_pillar")
			recipeWriter.writeStonecutterRecipes([`${block}_bricks`, `${smooth}_slab`, `${smooth}_stairs`, `${smooth}_wall`, `${smooth}_wall_gate`], id(mc, baseBlock), 4, undefined, "from_"+baseBlock)
			recipeWriter.writeStonecutterRecipes([`${smooth}_slab`], id(mc, baseBlock), 8, undefined, "from_"+baseBlock)
			tagHelper.tagItems([`${block}_bricks`, `${block}_pillar`, `${smooth}_slab`, `${smooth}_stairs`, `${smooth}_wall`, `${smooth}_wall_gate`], "enabled", true)	
		}

		// Iron Bars already exist
		if (!block.includes("iron")) {
			blockWriter.writeBars(block, modID, baseCutBlockID)
			tagHelper.tagItem(block + "_bars", "enabled", true)
		}
		// Copper Doors and Trapdoors should be generated only if version is 1.20 or below.
		if (block.includes("copper")) {
			if (majorVersion < 21) {
				blockWriter.writeChiseledBlock(`chiseled_${block}_block`, id(mc, baseBlock), "chiseled_resource")
				tagHelper.tagItem(`chiseled_${block}_block`, "enabled", true)
				new Block(`${block}_door`, "door", id(mc, baseBlock), block)
				new Block(`${block}_trapdoor`, "trapdoor", id(mc, baseBlock), block)
			}
		}
		else {
			if (!block.includes("quartz")) {
				blockWriter.writeChiseledBlock(`chiseled_${block}_block`, id(mc, baseBlock), "chiseled_resource")
				tagHelper.tagItem(`chiseled_${block}_block`, "enabled", true)
			}
			if (!block.includes("iron")) {
				new Block(`${block}_door`, "door", id(mc, baseBlock), block)
				new Block(`${block}_trapdoor`, "trapdoor", id(mc, baseBlock), block)
			}
		}


		// Unoxidized Copper Blocks use `copper_block` as their texture ID
		if (block === "copper") {
			baseTexture = baseBlock + "_block";
			baseBlock = baseBlock + "_block"
		}
		blockWriter.writeButtons(block + "_button", id(mc, baseBlock), id(mc, baseTexture), "metal_buttons")
		tagHelper.tagItem(block + "_button", "enabled", true)
		// Iron and Gold Pressure Plates already exist.
		if (!((block === "gold") || (block === "iron"))) {
			blockWriter.writePlates(block + "_pressure_plate", id(mc, baseBlock), id(mc, baseTexture))
			tagHelper.tagItem(block + "_pressure_plate", "enabled", true)
		}

	})



	new Block("nether_brick_fence_gate", "fence_gate", id(mc, "nether_bricks"), "nether_bricks")

	// Add Pyrite tags to MC/convention tags.
	tagHelper.tagBoth("#pyrite:dyed_bricks", "c:bricks/normal", true)
	tagHelper.tagBoth("#pyrite:crafting_tables", "c:player_workstations/crafting_tables", true)
	tagHelper.tagBlock("#pyrite:obsidian", "minecraft:dragon_immune")
	tagHelper.tagBlock("#pyrite:ladders", "minecraft:climbable")
	tagHelper.tagBlock("#pyrite:carpet", "minecraft:combination_step_sound_blocks")
	tagHelper.tagItem("#pyrite:gold", "minecraft:piglin_loved")
	tagHelper.tagBothFromArray(["#c:dyed/honey", "#c:dyed/glow", "#c:dyed/nostalgia", "#c:dyed/dragon", "#c:dyed/star", "#c:dyed/poisonous", "#c:dyed/rose"], "c:dyed")

	// Add Pyrite tags to tool tags
	tagHelper.tagBlocks(["#pyrite:wall_gates", "#pyrite:bricks"], "minecraft:needs_wood_tool")
	tagHelper.tagBlocks(["#pyrite:iron", "#pyrite:lapis", "#pyrite:copper", "#pyrite:exposed_copper", "#pyrite:weathered_copper", "#pyrite:oxidized_copper"], "minecraft:needs_stone_tool")
	tagHelper.tagBlocks(["#pyrite:gold", "#pyrite:diamond", "#pyrite:emerald"], "minecraft:needs_iron_tool")
	tagHelper.tagBlocks(["#pyrite:obsidian", "#pyrite:netherite"], "minecraft:needs_diamond_tool")

	tagHelper.tagBlocks(readFileAsJson("./overrides/pyrite/mineable/axe.json"), "minecraft:mineable/axe")
	tagHelper.tagBlocks(["#pyrite:carpet"], "minecraft:mineable/hoe")
	tagHelper.tagBlocks(readFileAsJson("./overrides/pyrite/mineable/pickaxe.json"), "minecraft:mineable/pickaxe")
	tagHelper.tagBlocks(readFileAsJson("./overrides/pyrite/mineable/shovel.json"), "minecraft:mineable/shovel")

	// Add Pyrite tags to Pyrite tags
	tagHelper.tagBlock("#pyrite:terracotta_bricks", "bricks")
	recipeWriter.writeShapelessRecipe("#pyrite:crafting_tables", "minecraft:crafting_table", 1, "s")

	if (helpers.columnsEnabled) {
		vanillaConstants.vanillaResourceBlocks.forEach(function(resourceBlock) {
			let blockBlock = resourceBlock +"_block"
			if (resourceBlock.includes("copper") && (resourceBlock != "copper"))
				blockBlock = resourceBlock
			recipeWriter.writeStonecutterRecipes([`cut_${resourceBlock}_column`, `smooth_${resourceBlock}_column`], `minecraft:${blockBlock}`, 1, undefined, `from_${resourceBlock}`, "columns")
		})
		helpers.vanillaDyes.forEach(function(dye) {
			recipeWriter.writeStonecutterRecipes([`${dye}_terracotta_brick_column`], `minecraft:${dye}_terracotta`, 1, undefined, `from_${dye}_terracotta`, "columns")
		})
		
		recipeWriter.writeStonecutterRecipe("sandstone_brick_column", "minecraft:sandstone", 1, undefined, "from_sandstone", "columns")
		recipeWriter.writeStonecutterRecipe("sandstone_brick_column", "minecraft:cut_sandstone", 1, undefined, "from_cut_sandstone", "columns")
		recipeWriter.writeStonecutterRecipe("andesite_brick_column", "minecraft:polished_andesite", 1, undefined, "from_cut_polished_andesite", "columns")
		recipeWriter.writeStonecutterRecipe("diorite_brick_column", "minecraft:polished_diorite", 1, undefined, "from_polished_diorite", "columns")
		recipeWriter.writeStonecutterRecipe("granite_brick_column", "minecraft:polished_granite", 1, undefined, "from_polished_granite", "columns")
		recipeWriter.writeStonecutterRecipe("terracotta_brick_column", "minecraft:terracotta", 1, undefined, "from_terracotta", "columns")
	}
	// Generate translations for Pyrite item tags.
	const newModTags = [
		"wall_gates", "lamps", "bricks", "dyed_bricks", 
		"stained_framed_glass", "fences", "wool", "metal_bars", "planks", "brick_stairs", "metal_trapdoors", "brick_walls", "metal_buttons",
		"concrete_slabs", "concrete_stairs", "azalea_logs",
		"gold", "iron", "diamond", "emerald", "amethyst", "copper",
		"exposed_copper", "lapis", "netherite", "oxidized_copper",
		"quartz", "redstone", "weathered_copper",
		"stained_glass", "terracotta", "brick_columns"
	]
	newModTags.forEach(function(tag) {
		langHelper.generateLang(tag, "tag.item", modID)
	})
	const newConventionTags = ["dyed/honey", "dyed/glow", "dyed/nostalgia", 
		"dyed/poisonous", "dyed/rose", "dyed/star", "dyed/dragon"]
	newConventionTags.forEach(function(tag) {
		langHelper.generateLang(tag, "tag.item", "c")
	})
	tagHelper.tagBoth("#pyrite:chests", "c:chests/wooden", true)
	tagHelper.tagBlock("#pyrite:chests", "quad:cats_on_blocks/sit", true)
	tagHelper.tagBoth("#pyrite:chests", "minecraft:guarded_by_piglins", true)


	recipeWriter.writeShapedRecipe({
		"#": "minecraft:iron_ingot",
		"C": "#c:player_workstations/crafting_tables",
		"D": "minecraft:dropper",
		"R": "minecraft:redstone"
	  }, "minecraft:crafter", 1, [
		"###",
		"#C#",
		"RDR"
	  ])
	recipeWriter.writeSmeltingRecipe("pyrite:azalea_log", "minecraft:charcoal", undefined, undefined, undefined, undefined, "_azalea_log")

	recipeWriter.writeSmeltingRecipe("pyrite:azalea_wood", "minecraft:charcoal", undefined, undefined, undefined, undefined, "_azalea_wood")
	// Write final language file.
	langHelper.writeLang()
	count = langHelper.countBlocks()
	console.log(`Pyrite Toolkit generated ${count} blocks in the ${mcVersion} format.`)
}

if (process.argv[2] == "pyrite") {
	generatePyriteResources()
}
else if (modID == "holiday-server-mod") {
	// writeItem("tater_banner_pattern")
	// recipeWriter.writeShapelessRecipe(["minecraft:paper", "minecraft:potato"], id("tater_banner_pattern"), 1)
	// writeItem("fabric_banner_pattern")
	// recipeWriter.writeShapelessRecipe(["minecraft:paper", "minecraft:loom"], id("fabric_banner_pattern"), 1)

}
else if (modID == "raspberry") {
	// blockWriter.writeStoveBlock("silt_stove", modID, "stove", "twigs:silt_bricks")
	// blockWriter.writeStoveBlock("ash_stove", modID, "stove", "supplementaries:ash_bricks")
	// blockWriter.writeBlock("deepslate_gravel", modID, "gravel", undefined, undefined, false, false, undefined, false)
	// blockWriter.writeBlock("blackstone_gravel", modID, "gravel", undefined, undefined, false, false, undefined, false)
	blockWriter.writeBlock("ash_block", modID, "ash", undefined, undefined, false, false, undefined, false)

	// langHelper.writeLang()
}
else if (modID == "bigger_fish") {
	


	const fishery = [
		"fishery:nullfin",
	]

	const end = [
		"fishery:dragonfish",
		"fishery:voidskipper",
	]

	const aether = [
		"fishery:aerbaia",
		"fishery:aersucker"
	]






	const tier_one_cosmopolitan_freshwater = [
		"bream",
		"carp",
		"trout",
		"aquaculture:carp",
		"minecraft:salmon",
		"aquaculture:minnow",
	]

	const tier_two_cosmopolitan_freshwater = [
		"koi",
		"shad",
	]

	const tier_three_cosmopolitan_freshwater = [
		"fishery:largemouth_bass",
		"great_white_shark"
	]

	const tier_one_cosmopolitan_saltwater = [
		"minecraft:cod",
		"minecraft:salmon",
		"minecraft:cod",
		"herring",
		"aquaculture:atlantic_herring",
	]

	const tier_two_cosmopolitan_saltwater = [
		"fishery:red_snapper",
		"tarpon",
		"jellyfish"
	]

	const tier_three_cosmopolitan_saltwater = [

	]

	const tier_one_temperate_freshwater = [
		"goldfish",
		"bass",
		"bluegill",
		"aquaculture:bluegill",
		"fishery:bluegill",
		"#bigger_fish:tier_one_cosmopolitan_freshwater_fish",
		"fishofthieves:splashtail",
		"fishery:leafskimmer",
    	"fishofthieves:pondie",

	]

	const tier_two_temperate_freshwater = [
		"#bigger_fish:tier_two_cosmopolitan_freshwater_fish",
		"darter",
		"rainbow_trout",
		"aquaculture:rainbow_trout",
		"aquaculture:brown_trout",
		"aquaculture:smallmouth_bass",

	]

	const tier_three_temperate_freshwater = [
		"#bigger_fish:tier_three_cosmopolitan_freshwater_fish",
		"bowfin",
		"loach",
		"fishery:branch_eel",
	]

	const tier_one_temperate_saltwater = [
		"#bigger_fish:tier_one_cosmopolitan_saltwater_fish",
		"mackerel",
		"starfish",
		"sturgeon",
		"fishofthieves:splashtail",
		"fishofthieves:plentifin",
	]

	const tier_two_temperate_saltwater = [
		"#bigger_fish:tier_two_cosmopolitan_saltwater_fish",
		"clingfish",
		"fishofthieves:islehopper",
		"fishery:sunfish",
	]

	const tier_three_temperate_saltwater = [
		"#bigger_fish:tier_three_cosmopolitan_saltwater_fish",
		"oarfish",
		"hammerhead_shark",
		"whale_shark",
		"fishofthieves:ancientscale",
		"fishofthieves:devilfish",
		"upgrade_aquatic:lionfish",

	]

	const tier_one_hot_freshwater = [
		"#bigger_fish:tier_one_cosmopolitan_freshwater_fish",
		"catfish",
		"piranha",
		"betta",
		"aquaculture:catfish",
		"aquaculture:piranha",
		"fishofthieves:splashtail",
    	"fishofthieves:pondie",
			"aquaculture:bayad",
	]

	const tier_two_hot_freshwater = [
		"#bigger_fish:tier_two_cosmopolitan_freshwater_fish",
		"gar",
		"aquaculture:gar",
		"perch",
		"aquaculture:perch",
		"upgrade_aquatic:perch",
		"tilapia",
		"aquaculture:capitaine",
		"aquaculture:boulti",
		"aquaculture:synodontis",
		"aquaculture:arapaima",
    	"aquaculture:tambaqui",

	]

	const tier_three_hot_freshwater = [
		"#bigger_fish:tier_three_cosmopolitan_freshwater_fish",
		"arapaima",
		"roach",
		"gourami",
		"pacu",
		"fishofthieves:stormfish",
		"fishofthieves:wildsplash",
		"fishery:crab_claw",
		"fishery:crayfish",
	]

	const tier_one_hot_saltwater = [
		"#bigger_fish:tier_one_cosmopolitan_saltwater_fish",
		"sardine",
		"flounder",
		"minecraft:pufferfish",
		"minecraft:tropical_fish",
		"fishofthieves:splashtail",
		"fishofthieves:islehopper",
		"fishofthieves:plentifin",
	]

	const tier_two_hot_saltwater = [
		"#bigger_fish:tier_two_cosmopolitan_saltwater_fish",
		"butterflyfish",
		"surgeonfish",
		"stingray",
		"upgrade_aquatic:lionfish",
		"fishery:sunfish",


	]

	const tier_three_hot_saltwater = [
		"#bigger_fish:tier_three_cosmopolitan_saltwater_fish",
		"swordfish",
		"grouper",
		"aquaculture:red_grouper",
		"tuna",
		"aquaculture:tuna",
		"fishery:tuna",
		"moray_eel",
		"fishofthieves:devilfish",

	]

	const tier_one_cold_freshwater = [
		"#bigger_fish:tier_one_cosmopolitan_freshwater_fish",
		"goldeye",

	]

	const tier_two_cold_freshwater = [
		"#bigger_fish:tier_two_cosmopolitan_freshwater_fish",
		"rudd",
		"pike",
		"upgrade_aquatic:pike",
		"aquaculture:muskellunge",


	]

	const tier_three_cold_freshwater = [
		"#bigger_fish:tier_three_cosmopolitan_freshwater_fish",
		"walleye",
		"fishery:walleye",
		"white_sucker",

	]


	const tier_one_cold_saltwater = [
		"#bigger_fish:tier_one_cosmopolitan_saltwater_fish",
		"capelin",
		"polar_cod",
		"aquaculture:atlantic_cod",
		"aquaculture:pink_salmon",
		"aquaculture:pacific_halibut",
		"aquaculture:atlantic_halibut",
	]

	const tier_two_cold_saltwater = [
		"#bigger_fish:tier_two_cosmopolitan_saltwater_fish",
		"char",
		"haddock",
		"aquaculture:pollock",

	]

	const tier_three_cold_saltwater = [
		"#bigger_fish:tier_three_cosmopolitan_saltwater_fish",
		"spiny_lumpsucker",
		"twohorn_sculpin",
		"aquaculture:blackfish",
		"fishofthieves:battlegill",
		"fishofthieves:wrecker",
		"fishery:anglerfish",

	]


	
	const tier_one_brackish = [
		"brackish_mudskipper",
		"violet_goby",

	]
	const tier_two_brackish = [

		"green_chromide",
		"brackish_tigerfish",
		"mangrove_moony",
	]
	const tier_three_brackish = [
		"knifefish",
		"shark_catfish",
	]
	const tier_one_brackish_cave = [
		"shortfin_molly",
		"cichlid",
	]

	const tier_two_brackish_cave = [

		"blue_blanquillo",
		"brackish_goby",
	]

	const tier_three_brackish_cave = [
		"dripstone_garra"
	]

	const mushroom_fields = [
		"aquaculture:brown_shrooma",
		"aquaculture:red_shrooma",
	]
	const deep_dark = [
		"sculkfish", 		
		"angler_sculkfish", 		
		"sensor_eel", 		
		"warding_squid", 		
		"fishery:echofin",
		"fishery:sculkamander",
	]

	const tier_one_caves = [
		"blind_cavefish",
		"cave_pupfish",
		"fishery:pale_bass",
		"fishery:salamander",

	]

	const tier_two_caves = [
		"northern_cavefish",
		"red_cavefish",
		"white_cavefish",

	]

	const tier_three_caves = [
		"fishery:ghostfish",
		"cave_angel_fish",
		"toothless_blindcat",


	]

	const lava = [
		"cinder_eel",
		"fire_bass",
		"fire_mackerel",
		"lava_jellyfish",
		"lavashoe_crab",
		"fishery:jellyfish",
		"fishery:ghast_brood",
		"fishery:soul_leech",
	]

	tagHelper.tagItems(
		["#bigger_fish:tier_one_cosmopolitan_freshwater_fish", 
		"#bigger_fish:tier_one_cosmopolitan_saltwater_fish",
		"#bigger_fish:tier_one_cold_freshwater_fish",
		"#bigger_fish:tier_one_cold_saltwater_fish",
		"#bigger_fish:tier_one_hot_freshwater_fish",
		"#bigger_fish:tier_one_hot_saltwater_fish",
		"#bigger_fish:tier_one_temperate_freshwater_fish",
		"#bigger_fish:tier_one_temperate_saltwater_fish",
		"#bigger_fish:tier_one_brackish_fish",
		"bigger_fish:tier_one_cave_fish",
		"bigger_fish:tier_one_brackish_cave_fish"]
		, "tier_one_fish")
	tagHelper.tagItems(
[		"#bigger_fish:tier_two_cosmopolitan_freshwater_fish", 
		"#bigger_fish:tier_two_cosmopolitan_saltwater_fish",
		"#bigger_fish:tier_two_cold_freshwater_fish",
		"#bigger_fish:tier_two_cold_saltwater_fish",
		"#bigger_fish:tier_two_hot_freshwater_fish",
		"#bigger_fish:tier_two_hot_saltwater_fish",
		"#bigger_fish:tier_two_temperate_freshwater_fish",
		"#bigger_fish:tier_two_temperate_saltwater_fish",
		"#bigger_fish:tier_two_brackish_fish",
		"#bigger_fish:tier_two_cave_fish",
		"#bigger_fish:tier_two_brackish_cave_fish"]
		, "tier_two_fish")
	tagHelper.tagItems(
	[	"#bigger_fish:tier_three_cosmopolitan_freshwater_fish", 
		"#bigger_fish:tier_three_cosmopolitan_saltwater_fish",
		"#bigger_fish:tier_three_cold_freshwater_fish",
		"#bigger_fish:tier_three_cold_saltwater_fish",
		"#bigger_fish:tier_three_hot_freshwater_fish",
		"#bigger_fish:tier_three_hot_saltwater_fish",
		"#bigger_fish:tier_three_temperate_freshwater_fish",
		"#bigger_fish:tier_three_temperate_saltwater_fish",
		"#bigger_fish:tier_three_brackish_fish",
		"#bigger_fish:tier_three_cave_fish",
		"#bigger_fish:tier_three_brackish_cave_fish"]
		, "tier_three_fish")
	// Cosmopolitan
	tagHelper.tagItems(tier_one_cosmopolitan_freshwater, "tier_one_cosmopolitan_freshwater_fish", true)
	tagHelper.tagItems(tier_two_cosmopolitan_freshwater, "tier_two_cosmopolitan_freshwater_fish", true)
	tagHelper.tagItems(tier_three_cosmopolitan_freshwater, "tier_three_cosmopolitan_freshwater_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_cosmopolitan_freshwater_fish", "#bigger_fish:tier_two_cosmopolitan_freshwater_fish", "#bigger_fish:tier_three_cosmopolitan_freshwater_fish"], "cosmopolitan_freshwater_fish", true)

	tagHelper.tagItems(tier_one_cosmopolitan_saltwater, "tier_one_cosmopolitan_saltwater_fish", true)
	tagHelper.tagItems(tier_two_cosmopolitan_saltwater, "tier_two_cosmopolitan_saltwater_fish", true)
	tagHelper.tagItems(tier_three_cosmopolitan_saltwater, "tier_three_cosmopolitan_saltwater_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_cosmopolitan_saltwater_fish", "#bigger_fish:tier_two_cosmopolitan_saltwater_fish", "#bigger_fish:tier_three_cosmopolitan_saltwater_fish"], "cosmopolitan_saltwater_fish", true)

	tagHelper.tagItems(tier_one_cold_freshwater, "tier_one_cold_freshwater_fish", true)
	tagHelper.tagItems(tier_two_cold_freshwater, "tier_two_cold_freshwater_fish", true)
	tagHelper.tagItems(tier_three_cold_freshwater, "tier_three_cold_freshwater_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_cold_freshwater_fish", "#bigger_fish:tier_two_cold_freshwater_fish", "#bigger_fish:tier_three_cold_freshwater_fish"], "cold_freshwater_fish", true)

	tagHelper.tagItems(tier_one_cold_saltwater, "tier_one_cold_saltwater_fish", true)
	tagHelper.tagItems(tier_two_cold_saltwater, "tier_two_cold_saltwater_fish", true)
	tagHelper.tagItems(tier_three_cold_saltwater, "tier_three_cold_saltwater_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_cold_saltwater_fish", "#bigger_fish:tier_two_cold_saltwater_fish", "#bigger_fish:tier_three_cold_saltwater_fish"], "cold_saltwater_fish", true)

	tagHelper.tagItems(tier_one_hot_freshwater, "tier_one_hot_freshwater_fish", true)
	tagHelper.tagItems(tier_two_hot_freshwater, "tier_two_hot_freshwater_fish", true)
	tagHelper.tagItems(tier_three_hot_freshwater, "tier_three_hot_freshwater_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_hot_freshwater_fish", "#bigger_fish:tier_two_hot_freshwater_fish", "#bigger_fish:tier_three_hot_freshwater_fish"], "hot_freshwater_fish", true)

	tagHelper.tagItems(tier_one_hot_saltwater, "tier_one_hot_saltwater_fish", true)
	tagHelper.tagItems(tier_two_hot_saltwater, "tier_two_hot_saltwater_fish", true)
	tagHelper.tagItems(tier_three_hot_saltwater, "tier_three_hot_saltwater_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_hot_saltwater_fish", "#bigger_fish:tier_two_hot_saltwater_fish", "#bigger_fish:tier_three_hot_saltwater_fish"], "hot_saltwater_fish", true)

	tagHelper.tagItems(tier_one_temperate_freshwater, "tier_one_temperate_freshwater_fish", true)
	tagHelper.tagItems(tier_two_temperate_freshwater, "tier_two_temperate_freshwater_fish", true)
	tagHelper.tagItems(tier_three_temperate_freshwater, "tier_three_temperate_freshwater_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_temperate_freshwater_fish", "#bigger_fish:tier_two_temperate_freshwater_fish", "#bigger_fish:tier_three_temperate_freshwater_fish"], "temperate_freshwater_fish", true)
	
	tagHelper.tagItems(tier_one_temperate_saltwater, "tier_one_temperate_saltwater_fish", true)
	tagHelper.tagItems(tier_two_temperate_saltwater, "tier_two_temperate_saltwater_fish", true)
	tagHelper.tagItems(tier_three_temperate_saltwater, "tier_three_temperate_saltwater_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_temperate_saltwater_fish", "#bigger_fish:tier_two_temperate_saltwater_fish", "#bigger_fish:tier_three_temperate_saltwater_fish"], "temperate_saltwater_fish", true)

	tagHelper.tagItems(tier_one_brackish, "tier_one_brackish_fish", true)
	tagHelper.tagItems(tier_two_brackish, "tier_two_brackish_fish", true)
	tagHelper.tagItems(tier_three_brackish, "tier_three_brackish_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_brackish_fish", "#bigger_fish:tier_two_brackish_fish", "#bigger_fish:tier_three_brackish_fish"], "brackish_fish", true)


	tagHelper.tagItems(mushroom_fields, "shroomy_fish", true)
	tagHelper.tagItems(deep_dark, "deep_dark_fish", true)
	tagHelper.tagItems(lava, "lava_fish", true)

	tagHelper.tagItems(tier_one_caves, "tier_one_cave_fish", true)
	tagHelper.tagItems(tier_two_caves, "tier_two_cave_fish", true)
	tagHelper.tagItems(tier_three_caves, "tier_three_cave_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_cave_fish", "#bigger_fish:tier_two_cave_fish", "#bigger_fish:tier_three_cave_fish"], "cave_fish", true)

	tagHelper.tagItems(tier_one_brackish_cave, "tier_one_brackish_cave_fish", true)
	tagHelper.tagItems(tier_two_brackish_cave, "tier_two_brackish_cave_fish", true)
	tagHelper.tagItems(tier_three_brackish_cave, "tier_three_brackish_cave_fish", true)
	tagHelper.tagItems(["#bigger_fish:tier_one_brackish_cave_fish", "#bigger_fish:tier_two_brackish_cave_fish", "#bigger_fish:tier_three_brackish_cave_fish"], "brackish_cave_fish", true)

	tagHelper.tagItems(["minecraft:lily_pad", "minecraft:leather", "minecraft:leather_boots", "minecraft:bone", "minecraft:string", "minecraft:fishing_rod", "minecraft:bowl", "minecraft:stick", "minecraft:ink_sac", "minecraft:tripwire_hook", "minecraft:rotten_flesh", "minecraft:bamboo", "fish_bones", "can"], "junk", true)
	tagHelper.tagItems(["minecraft:name_tag", "minecraft:saddle", "minecraft:bow", "minecraft:fishing_rod", "minecraft:nautilus_shell"], "treasure", true)


	const fish = deep_dark.concat(
		tier_one_caves, tier_two_caves, tier_three_caves, 
		tier_one_brackish_cave, tier_two_brackish_cave, tier_three_brackish_cave, 
		tier_one_cold_freshwater, tier_two_cold_freshwater, tier_three_cold_freshwater, 
		tier_one_cosmopolitan_freshwater, tier_two_cosmopolitan_freshwater, tier_three_cosmopolitan_freshwater, 
		tier_one_cold_saltwater, tier_two_cold_saltwater, tier_three_cold_saltwater, 
		tier_one_temperate_freshwater, tier_two_temperate_freshwater, tier_three_temperate_freshwater, 
		tier_one_temperate_saltwater, tier_two_temperate_saltwater, tier_three_temperate_saltwater, 
		tier_one_hot_freshwater, tier_two_hot_freshwater, tier_three_hot_freshwater, 
		tier_one_hot_saltwater, tier_two_hot_saltwater, tier_three_hot_saltwater, 
		tier_one_cosmopolitan_freshwater, tier_two_cosmopolitan_freshwater, tier_three_cosmopolitan_freshwater, 
		tier_one_cosmopolitan_saltwater, tier_two_cosmopolitan_saltwater, tier_three_cosmopolitan_saltwater,  
		lava, 
		tier_one_brackish, tier_two_brackish, tier_three_brackish
	)

	const level_one_bait = [
		"worm",
		"aquaculture:worm",
		"fishofthieves:earthworms",
		"tide:bait"
	]

	const level_two_bait = [
		"leech",
		"fishofthieves:grubs",
		"aquaculture:leech",
		"fishofthieves:leeches"
	]

	const level_three_bait = [
		"aquaculture:minnow",
		"bigger_fish:sardine",
		"#c:foods/raw_fish"
	]

	const bait = level_one_bait.concat(level_two_bait, level_three_bait)

	const food = [
		"fried_fish",
		"fish_kebab",
		"fish_stew",
		"fish_taco",
		"sashimi",
		"sushi",
		"canned_fish",
		"fish_fingers"
	]
	const junk = [
		"fish_bones",
		"can"
	]

	fish.forEach(function(ish) {
		if (!ish.includes(":")) {
			langHelper.generateLang(ish, "item", modID)
			itemModelWriter.writeFishItemModels(ish)
			tagHelper.tagItem(ish, "fish", true)
		}
	})
	bait.forEach(function(b) {
		if (!b.includes(":")) { 
			writeItem(b)
		}
	})

	food.forEach(function(b) {
		writeItem(b)
	})

	junk.forEach(function(b) {
		writeItem(b)
	})
	// diamond hook
	writeItem("diamond_hook")
	recipeWriter.writeShapedRecipe({
		"C": "minecraft:diamond"
	  }, "bigger_fish:diamond_hook", 1, [
		" C",
		"CC"
	  ], undefined, true)

	// netherite hook
	writeItem("netherite_hook")
	recipeWriter.writeShapedRecipe({
		"C": "minecraft:netherite_scrap"
	  }, "bigger_fish:netherite_hook", 1, [
		" C",
		"CC"
	  ], undefined, true)

	recipeWriter.writeFoodCookingRecipes("#bigger_fish:fish", "fried_fish")
	recipeWriter.writeFoodCookingRecipes("minecraft:tropical_fish", "fried_fish", undefined, undefined, undefined, "_tropical")

	const fishingRods = [
	"copper_rod"
	]
	
	tagHelper.tagItems(fishingRods, "c:tools/fishing_rod", true)
	tagHelper.tagItems(fishingRods, "minecraft:enchantable/fishing", true)
	tagHelper.tagItems(fishingRods, "requires_minigame_to_catch", true)
	// copper rod
	recipeWriter.writeShapedRecipe({
		"#": "#c:strings",
		"C": "#c:ingots/copper",
	  }, "bigger_fish:copper_rod", 1, [
		"  C",
		" C#",
		"C #"
	  ], undefined, true)
	advancements.writeRecipeAdvancement("copper_rod", "#minecraft:fishes")
	//sushi
	advancements.writeRecipeAdvancement("sushi", "minecraft:dried_kelp")
	recipeWriter.writeShapelessRecipe(["#c:foods/raw_fish", "minecraft:dried_kelp"], 
		"bigger_fish:sushi", 1, undefined, undefined, "food")
	// canned fish
	advancements.writeRecipeAdvancement("canned_fish", "bigger_fish:can")
	recipeWriter.writeShapelessRecipe(["#c:foods/raw_fish", "bigger_fish:can"], 
		"bigger_fish:canned_fish", 1, undefined, undefined, "food")
	//fish kebab
	advancements.writeRecipeAdvancement("fish_kebab", "#c:foods/cooked_fish")
	recipeWriter.writeShapelessRecipe(["#c:foods/cooked_fish", "minecraft:stick"], 
		"bigger_fish:fish_kebab", 1, undefined, undefined, "food")
	//fish stew
	advancements.writeRecipeAdvancement("fish_stew", "#c:foods/cooked_fish")
	recipeWriter.writeShapelessRecipe(["#c:foods/cooked_fish", "minecraft:bowl", "minecraft:carrot", "minecraft:potato"], 
		"bigger_fish:fish_stew", 1, undefined, undefined, "food")
		// advancements.writeRecipeAdvancement("minecraft:bone_meal", "bigger_fish:fish_bones")
	recipeWriter.writeShapelessRecipe(["bigger_fish:fish_bones"], 
		"minecraft:bone_meal", 1, "_from_fish_bones", undefined, "misc")
	// advancements.writeRecipeAdvancement("minecraft:iron_nugget", "bigger_fish:can")
	recipeWriter.writeSmeltingRecipe(["bigger_fish:can"], 
		"minecraft:iron_nugget", undefined, undefined, undefined, "misc", "_from_can")
	tagHelper.tagItem("#bigger_fish:fish", "minecraft:fishes", true)
	tagHelper.tagItem("#bigger_fish:fish", "c:foods/raw_fish", true)
	tagHelper.tagItem("fried_fish", "c:foods/cooked_fish", true)
	tagHelper.tagItem("worm", "minecraft:chicken_food", true)
	tagHelper.tagItem("fish_bones", "c:bones", true)
	var hooks = ["diamond_hook", "netherite_hook"]
	tagHelper.tagItems(hooks, "hooks", true)
	tagHelper.tagItem("diamond_hook", "attracts_treasure", true)
	tagHelper.tagItems(hooks.concat(["copper_rod"]), "minecraft:enchantable/durability", true)

	tagHelper.tagItems(level_one_bait, "level_one_bait", true)
	tagHelper.tagItems(level_two_bait, "level_two_bait", true)
	tagHelper.tagItems(level_three_bait, "level_three_bait", true)

	tagHelper.tagItems(["#bigger_fish:level_one_bait", "#bigger_fish:level_two_bait", "#bigger_fish:level_three_bait"], "bait", true)

	tagHelper.tagItems(["#bigger_fish:bait", "#bigger_fish:hooks"], "allowed_in_baited_rod", true)

	tagHelper.tagItem("copper_hook", "c:hidden_from_recipe_viewers")

	langHelper.generateLang()

	langHelper.writeLang()
}

else if (modID == "lemonade") {
	// blockWriter.writeBlock("crimson_wart_block", "crumbling", "minecraft:nether_wart_block", undefined, "minecraft:nether_wart_block")
	
	// recipeWriter.writeShapedRecipe({
	// 	"#": "minecraft:chiseled_stone_bricks",
	// 	"I": "minecraft:iron_ingot"
	//   }, "minecraft:lodestone", 1, [
	// 	"###",
	// 	"#I#",
	// 	"###"
	//   ], "minecraft")
	//   recipeWriter.writeShapedRecipe({
	// 	"#": "minecraft:leather",
	// 	"I": "minecraft:string"
	//   }, "minecraft:bundle", 1, [
	// 	"#",
	// 	"I"
	//   ])
	//   recipeWriter.writeShapedRecipe({
	// 	"#": "#c:rods/wooden",
	// 	"I": "#minecraft:logs_that_burn"
	//   }, "minecraft:campfire", 1, [
	// 	"##",
	// 	"II"
	//   ], "minecraft")

	// blockWriter.writeBlock("cobbled_granite", "cobblestone", "granite", undefined, "cobbled_granite", true, true, undefined, undefined)
	// blockWriter.writeBlock("cobbled_andesite", "cobblestone", "andesite", undefined, "cobbled_andesite", true, true, undefined, undefined)
	// blockWriter.writeBlock("cobbled_diorite", "cobblestone", "diorite", undefined, "cobbled_diorite", true, true, undefined, undefined)

	// tagHelper.tagBlocks(["cobbled_granite", "cobbled_diorite", "cobbled_andesite"], "cobblestones", true)



	// createVariantSwapWoodSet("minecraft:birch")


	// tagHelper.tagBlocks(["lemonade:cobblestones"], "minecraft:mineable/pickaxe", true)

	// tagHelper.tagItems(["minecraft:leather_horse_armor", "minecraft:iron_horse_armor", "minecraft:golden_horse_armor", "minecraft:diamond_horse_armor"], "c:horse_armor", true)

	// stones = ["minecraft:granite", "minecraft:andesite", "minecraft:diorite", "minecraft:cobbled_deepslate", "minecraft:deepslate", "minecraft:tuff"]
	//   tagHelper.tagItems(stones, "minecraft:stone_tool_materials", true)
	//   tagHelper.tagItems(stones, "minecraft:stone_crafting_materials", true) 
	//   tagHelper.tagItems(["minecraft:chest"], "c:chests/untrapped", true) 

	//   langHelper.generateLang("horse_armor", "tag.item", "c")
	//   tagHelper.tagItems(["cobbled_granite", "cobbled_diorite", "cobbled_andesite", "minecraft:granite", "minecraft:andesite", "minecraft:diorite", "minecraft:cobbled_deepslate", "minecraft:deepslate"], "minecraft:stone_tool_materials", true)
	//   tagHelper.tagItems(["cobbled_granite", "cobbled_diorite", "cobbled_andesite", "minecraft:granite", "minecraft:andesite", "minecraft:diorite", "minecraft:cobbled_deepslate", "minecraft:deepslate"], "minecraft:stone_crafting_materials", true) 
	//   blockWriter.writeBlock("cobbled_granite", "cobblestone")
	//   blockWriter.writeBlock("cobbled_diorite", "cobblestone")
	//   blockWriter.writeBlock("cobbled_andesite", "cobblestone")
	//   langHelper.writeLang()

// 	tagHelper.tagBlocks(readFileAsJson("./overrides/lemonade/mineable/pickaxe.json"), "minecraft:mineable/pickaxe", true)
// 	tagHelper.tagBlocks(readFileAsJson("./overrides/lemonade/mineable/axe.json"), "minecraft:mineable/axe")
// 	tagHelper.tagBlocks(readFileAsJson("./overrides/lemonade/mineable/shovel.json"), "minecraft:mineable/shovel", true)
// 	tagHelper.tagBlocks(["warped_wart_block", "crimson_wart_block"], "minecraft:leaves", true)

// 	// itemModelWriter.writeGeneratedItemModel("smithing_template")
// 	tagHelper.tagItem("minecraft:stick", "flammable_sticks", true)


	disabledItems = readFileAsJson("overrides/lemonade/disabled.json")

	tagHelper.tagItems(disabledItems, "c:hidden_from_recipe_viewers", true)


	start = `{
		// -----------------------------------------------------------
		//              Item Obliterator by ElocinDev
		// -----------------------------------------------------------
		//  
		// How to add items?
		//   - They are json strings, so you need to separate each
		//     entry with a comma, except the last
		//   - If you start an entry with !, it will be treated as a regular expression
		//     Example: "!minecraft:.*_sword" to disable all swords
		//  
		// -----------------------------------------------------------
		// Do not touch this
		"configVersion": 2,
		// -----------------------------------------------------------
		// Items here will be unusable completely
		//    Example: minecraft:diamond
		"blacklisted_items": `

end = `,
  // -----------------------------------------------------------
  // Removes an item if it contains certain nbt tag. If the whole entry (or expression) is present, the item gets removed.
  // Use with caution! This is a very expensive operation and can cause lag if you have a lot of items blacklisted.
  // 	
  // 	 Example to disable a regeneration potion: Potion:"minecraft:regeneration"
  // 	
  // 	 You can also use regular expressions by starting the value with !
  "blacklisted_nbt": [],
  // -----------------------------------------------------------
  // Items here will not be able to be right-clicked (Interact)
  //    Example: minecraft:apple
  "only_disable_interactions": [
    "examplemod:example_item"
  ],
  // -----------------------------------------------------------
  // Items here will not be able to be used to attack
  //    Example: minecraft:diamond_sword
  "only_disable_attacks": [
    "examplemod:example_item"
  ],
  // -----------------------------------------------------------
  // Items here will get their recipes disabled
  // Keep in mind this already is applied to blacklisted items
  "only_disable_recipes": [
    "examplemod:example_item"
  ],
  // -----------------------------------------------------------
  // If true, the mod will use a hashset to handle the blacklisted items
  // This is a more optimized approach only if you have a lot of items blacklisted (20 or more is recommended)
  // If you just have a small amount of items blacklisted, keep this false
  //  
  // [!] Enabling this will disable all regular expressions
  // [!] Does not apply to NBT, only item blacklist / interaction / attack
  "use_hashmap_optimizations": false
}`

	// var sorbet = "/home/deck/Documents/GitHub/Lemon-Sorbet/"
	// var lemonade = '/home/deck/Documents/GitHub/Lemonade/'
	// helpers.writeFile(sorbet+"config/item_obliterator.json5", start + JSON.stringify(disabledItems) + end)
	// const { exec } = require('child_process');
	// exec('./gradlew fabric:build', {cwd: lemonade},(error, stdout, stderr) => {
	// 	if (error) {
	// 		console.error(`exec error: ${error}`);
	// 		return;
	// 	}
	// 	console.log(`stdout: ${stdout}`);
	// 	var jar = "lemonade-fabric-0.1.13+1.21.1.jar"
	// 	fs.copyFile(lemonade+"fabric/build/libs/"+jar, sorbet+"mods/"+jar, (err) => { if (err) throw err} )
	
	// });

	recipeWriter.writeShortcutRecipes()
	// writeItem("copper_helmet")
	// writeItem("copper_chestplate")
	// writeItem("copper_leggings")
	// writeItem("copper_boots")

}

else if (modID == "alloyed") {
	const waxedBlocks = ["waxed_cut_bronze", "waxed_cut_bronze_slab", "waxed_cut_bronze_stairs", "waxed_cut_exposed_bronze", "waxed_cut_exposed_bronze_slab", "waxed_cut_exposed_bronze_stairs", "waxed_cut_weathered_bronze", "waxed_cut_weathered_bronze_slab", "waxed_cut_weathered_bronze_stairs", "waxed_cut_oxidized_bronze", "waxed_cut_oxidized_bronze_slab", "waxed_cut_oxidized_bronze_stairs"]
	waxedBlocks.forEach(function(block) {
		recipeWriter.writeShapelessRecipe([id(block.replace("waxed_", "")), "minecraft:honeycomb"], id(block), 1)
	})

}
else if (modID == "cookscollection") {
	items = [    "chocolate_muffin", "cooking_oil", "fish_and_chips", "fruiting_lemon_leaves", "lemon", "lemon_crate", "lemon_leaves",
		"lemon_log", "lemon_muffin", "lemon_sapling", "lemon_wood", "lemonade", "oven", "rustic_loaf", "rustic_loaf_slice", "salt",
		"salted_dripstone_block", "salted_pointed_dripstone", "sunflower_seeds"
	]
	items.forEach(function(item) {
		writeItem(item)
	})
} else {
	console.log("Mod has no associated generator")
}
function writeDye(item) {
	item = item + "_dye"
	const itemID = id(item)
	const dyeIngredient = helpers.getDyeIngredient(item)
	writeItem(item, modID)
	writeRecipeAdvancement(itemID, dyeIngredient)
	recipeWriter.writeShapelessRecipe(dyeIngredient, itemID, 1)
	tagHelper.tagItem(item, "c:dyes")
	tagHelper.tagItem(item, "enabled", true)
}

function writeItem(item) {
	langHelper.generateLang(item, "item", modID)
	itemModelWriter.writeGeneratedItemModel(item)
}

function generateWoodSet(template, baseBlock, hasStrippedLog) {
	const stainedPlankBase = template + "_planks"
	if (baseBlock == undefined) {
		baseBlock = template
	}
	let hangingSignBase = stainedPlankBase
	if (hasStrippedLog) {
		hangingSignBase = "stripped_"+template+"_log"
	}

	new Block(template + "_button", "button", stainedPlankBase, "wood")
	new Block(template + "_stairs", "stairs", stainedPlankBase, "wood")
	new Block(template + "_slab", "slab", stainedPlankBase, "wood")
	new Block(template + "_pressure_plate", "pressure_plate", stainedPlankBase, "wood")
	new Block(template + "_fence", "fence", stainedPlankBase, "wood")
	new Block(template + "_fence_gate", "fence_gate", stainedPlankBase, "wood")
	new Block(template + "_planks", "planks", baseBlock, "wood")
	new Block(template + "_crafting_table", "crafting_table", stainedPlankBase, "wood")
	new Block(template + "_ladder", "ladder", stainedPlankBase, "wood")
	new Block(template + "_door", "door", stainedPlankBase, "wood")
	new Block(template + "_sign", "sign", stainedPlankBase, "wood")
	new Block(template + "_hanging_sign", "hanging_sign", hangingSignBase, "wood")
	new Block(template + "_trapdoor", "trapdoor", stainedPlankBase, "wood")
	new Block(template + "_chest", "chest", stainedPlankBase, "wood")
	new Block(template + "_cabinet", "cabinet", stainedPlankBase, "wood")

	recipeWriter.writeCuttingRecipe(id(template + "_door"), id(stainedPlankBase), 1, "axe_dig")
	recipeWriter.writeCuttingRecipe(id(template + "_trapdoor"), id(stainedPlankBase), 1, "axe_dig")
	recipeWriter.writeCuttingRecipe(id(template + "_sign"), id(stainedPlankBase), 1, "axe_dig")
	recipeWriter.writeCuttingRecipe(id(template + "_hanging_sign"), id(stainedPlankBase), 1, "axe_dig")

	// helpers.writeFile(`${helpers.paths.base}/itemswapper/itemgroups/v2/wood/${template}.json`, {
    // "type": "palette",
    // "priority": 100,
    // "displayName": `text.${modID}.palette.wood.${template}`,
    // "items": [
    //     `${modID}:${template}_planks`,
    //     `${modID}:${template}_stairs`,
    //     `${modID}:${template}_slab`,
    //     `${modID}:${template}_trapdoor`,
    //     `${modID}:${template}_door`,
    //     `${modID}:${template}_fence_gate`,
    //     `${modID}:${template}_fence`,
    //     `${modID}:${template}_sign`,
    //     `${modID}:${template}_hanging_sign`,
    //     `${modID}:${template}_button`,
    //     `${modID}:${template}_pressure_plate`,
	// 	`${modID}:${template}_chest`,
    //     `${modID}:${template}_cabinet`,
    // ]
	// })

	
	// bibliocraft integration
	// new Block(id("bibliocraft", `${modID}_${template}_bookcase`), "bibliocraft_bookcase", stainedPlankBase, "wood")

}

function generateBrickSet(template, type, baseBlock, shouldGenerateMossyBrickSet, altTexture) {
	let brickBase;
	if (type === undefined) {
		type = "bricks"
	}
	
	if (template.search("bricks") === -1) {
		brickBase = template + "_brick"
	}
	else {
		brickBase = template.slice(0, -1)
	}
	const bricksBase = brickBase + "s"
	if (baseBlock === undefined) {
		baseBlock = template
	}
	if (altTexture === undefined) {
		altTexture == bricksBase
	}

	new Block(bricksBase, type, baseBlock, type)
	new Block(brickBase + "_slab", "slab", bricksBase, type, altTexture)
	new Block(brickBase + "_stairs", "stairs", bricksBase, type, altTexture)
	new Block(brickBase + "_wall", "wall", id(modID, bricksBase), type)
	new Block(brickBase + "_column", "column", id(modID, bricksBase), type)
	new Block(brickBase + "_wall_gate", "wall_gate", id(modID, bricksBase), type)
	if (shouldGenerateMossyBrickSet === true) {
		generateMossyBrickSet(bricksBase, id(bricksBase))
	}
}

function generateCutSet(template, type, baseBlock) {
	if (type === undefined) {
		type = "cut"
	}
	if (baseBlock === undefined) {
		baseBlock = template
	}

	new Block(template, type, baseBlock, baseBlock)
	new Block(template + "_slab", "slab", template, type)
	new Block(template + "_stairs", "stairs", template, type)
	if (helpers.columnsEnabled)
		new Block(template + "_column", "column", id(modID, template), type)
	new Block(template + "_wall", "wall", id(modID, template), type)
	new Block(template + "_wall_gate", "wall_gate", id(modID, template), type)

}

function generateMossyBrickSet(bricksBase, baseBlockID) {
	const mossyBricksBase = "mossy_" + bricksBase
	generateBrickSet(mossyBricksBase, "mossy_stone_bricks", baseBlockID)
	recipeWriter.writeShapelessRecipe([baseBlockID, "minecraft:moss_block"], id(mossyBricksBase), 1, "_from_moss_block")

}

function writeWallGatesFromArray(array, namespace, baseBlockArray) {
	if (namespace == undefined) {
		namespace = mc;
	}
	let i = 0;
	array.forEach(function (wall) {
		let blockTemplate = wall.replace("_wall", "")
		let baseBlock = blockTemplate
		// If a base block is provided, use it.
		if (baseBlockArray != undefined) {
			baseBlock = baseBlockArray[i]
		}
		// If not, try and assume the base block.
		else {
			baseBlock = baseBlock.replace("brick", "bricks")
			baseBlock = baseBlock.replace("tile", "tiles")
		}
		blockWriter.writeWallGates(`${blockTemplate}_wall_gate`, id(namespace, baseBlock))
		tagHelper.tagItem(`${blockTemplate}_wall_gate`, "enabled", true)
		i++
	})
}

function writeCraftingTablesFromArray(woodArray, namespace) {
	if (namespace == undefined) {
		namespace = mc
	}
	woodArray.forEach(function (dye) {
		const template = dye
		const plankBase = template + "_planks"
		new Block(template + "_crafting_table", "crafting_table", id(namespace,plankBase), "wood")
	})
}

function generateTurfSet(block, baseBlockID) {
	const turf = block + "_turf"
	const texture = baseBlockID + "_top"
	blockWriter.writeBlock(turf, "turf", baseBlockID, undefined, texture)
	new Block(block + "_slab", "slab", turf, "turf", texture)
	new Block(block + "_stairs", "stairs", turf, "turf", texture)
	blockWriter.writeCarpet(block + "_carpet", modID, texture, modID)
}

function createVariantSwapWoodSet(id, extshape, generateLogs, generatePlanks) {
	const namespace = helpers.getNamespace(id)
	const path = helpers.getPath(id)
	if (extshape == undefined) {
		extshape = "extshape"
	}

	const logs = [
		`${namespace}:${path}_log`,
		`${extshape}:${path}_log_stairs`,
		`${extshape}:${path}_log_slab`,
		`${extshape}:${path}_log_vertical_slab`,

		`${namespace}:${path}_wood`,
		`${extshape}:${path}_wood_fence`,
		`${extshape}:${path}_wood_fence_gate`,
		`${extshape}:${path}_wood_wall`,
		`${extshape}:${path}_wood_fence_gate`,
		`${extshape}:${path}_wood_pressure_plate`,
		`${extshape}:${path}_wood_button`,
	]
	const stripped_logs = [


		`${namespace}:stripped_${path}_log`,
		`${extshape}:stripped_${path}_log_stairs`,
		`${extshape}:stripped_${path}_log_slab`,
		`${extshape}:stripped_${path}_log_vertical_slab`,
		`${extshape}:stripped_${path}_log_fence`,
		`${namespace}:stripped_${path}_wood`,
		`${extshape}:stripped_${path}_wood_fence`,
		`${extshape}:stripped_${path}_wood_fence_gate`,
		`${extshape}:stripped_${path}_wood_wall`,
		`${extshape}:stripped_${path}_wood_fence_gate`,
		`${extshape}:stripped_${path}_wood_pressure_plate`,
		`${extshape}:stripped_${path}_wood_button`,
	]

	tagHelper.tagItems(logs, `variant_swap:${path}_logs`)
	tagHelper.tagItems(stripped_logs, `variant_swap:stripped_${path}_logs`)

}