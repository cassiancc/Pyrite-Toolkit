const langHelper = require('./helpers/language');
const tagHelper = require('./helpers/tags');
const helpers = require('./helpers/helpers');
const recipeWriter = require('./writers/recipes');
const blockWriter = require("./writers/blocks")
const { writeRecipeAdvancement } = require('./writers/advancements');
const itemModelWriter = require('./writers/item_models');
const vanillaConstants = require('./helpers/constants');


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
	constructor(blockID, blockType, baseBlock, material, textureID) {
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
			blockWriter.writeBlock(id(this.namespace, this.blockID), special, this.baseBlock, undefined, textureID, stonelike, true)
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
		else if (blockType == "locked_chest") {
			blockWriter.writeOrientableBlock(this.blockID, this.namespace, this.blockType, this.baseBlock)
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

	}
	generateFullID() {
		console.log(`${this.namespace}:${this.blockID}`)
	}
	addTranslation() {
		return langHelper.generateLang(this.blockID, "block", this.namespace)
	}
}

function generatePyriteResources() {

	helpers.populateTemplates()

	new Block("torch_lever", "torch_lever", id(mc,"torch"), "torch")
	new Block("redstone_torch_lever", "torch_lever", id(mc,"redstone_torch"), "torch")
	new Block("soul_torch_lever", "torch_lever", id(mc,"soul_torch"), "torch")

	dyes.forEach(function (dye) {
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
		//Torch Levers
		new Block(dye + "_torch_lever", "torch_lever", dye, "torch")
		//Framed Glass
		new Block(dye + "_framed_glass", "stained_framed_glass", dye, "stained_framed_glass")
		//Framed Glass Panes
		new Block(dye + "_framed_glass_pane", "stained_framed_glass_pane", dye, "stained_framed_glass_pane")
	})

	// Vanilla Crafting Tables
	writeCraftingTablesFromArray(vanillaWood, mc)
	if (helpers.versionAbove("1.21.4")) {
		writeCraftingTablesFromArray(["pale_oak"], mc)
	}

	// Aether compat
	writeCraftingTablesFromArray(["skyroot"], "aether")
	writeWallGatesFromArray(["holystone", "mossy_holystone", "holystone_brick", "icestone", "aerogel", "carved", "angelic", "hellfire"], "aether", ["holystone", "mossy_holystone", "holystone_bricks", "icestone", "aerogel", "carved_stone", "angelic_stone", "hellfire_stone"])

	// Red Mushroom
	const redShroom = "red_mushroom"
	generateWoodSet(redShroom)
	new Block(redShroom + "_stem", "mushroom_stem", "minecraft:mushroom_stem", "wood")
	// Brown Mushroom
	const brownShroom = "brown_mushroom"
	generateWoodSet(brownShroom)
	new Block(brownShroom + "_stem", "mushroom_stem", "minecraft:mushroom_stem", "wood")

	// Azalea
	const azalea = "azalea_log"
	generateWoodSet("azalea", azalea, true)
	new Block(azalea, "log", azalea, "wood")
	new Block("stripped_"+azalea, "log", "stripped_"+azalea, "wood")
	new Block("azalea_wood", "wood", azalea, "wood", "azalea_log")
	new Block("stripped_azalea_wood", "wood", "stripped_azalea_log", "wood")



	// Cobblestone Bricks
	generateBrickSet("cobblestone_bricks", "terracotta_bricks", "minecraft:cobblestone", true)
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:cobblestone")
	//Cobbled Deepslate Bricks
	generateBrickSet("cobbled_deepslate_bricks", "terracotta_bricks", "minecraft:cobblestone", true)
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:cobbled_deepslate")
	// Sandstone
	generateBrickSet("sandstone_bricks", "terracotta_bricks", "minecraft:cut_sandstone", false)
	recipeWriter.writeShortcutRecipes(["brick_stairs", "brick_slab", "brick_wall", "brick_wall_gate"], "minecraft:sandstone")
	recipeWriter.writeStonecutterRecipes(["sandstone_brick_stairs", "sandstone_brick_slab", "sandstone_brick_wall", "sandstone_brick_wall_gate"], "minecraft:cut_sandstone", 1, undefined, "from_cut_sandstone")
	recipeWriter.writeStonecutterRecipes("sandstone_bricks", "minecraft:sandstone", 1, undefined, "from_sandstone")

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


	blockWriter.writeBlock("nostalgia_cobblestone", "nostalgia_cobblestone", "nostalgia_cobblestone")
	blockWriter.writeBlock("nostalgia_mossy_cobblestone", "nostalgia_mossy_cobblestone", "nostalgia_mossy_cobblestone")
	blockWriter.writeBlock("nostalgia_netherrack", "nostalgia_netherrack", "nostalgia_netherrack")
	blockWriter.writeBlock("nostalgia_gravel", "nostalgia_gravel", "nostalgia_gravel")
	new Block("nostalgia_grass_block", "nostalgia_grass_block", "grass_block", "grass")

	//Framed Glass
	new Block("framed_glass", "framed_glass", "framed_glass", "framed_glass")
	// Framed Glass Panes
	blockWriter.writePanes("framed_glass_pane", modID, "framed_glass")
	// new Block("framed_glass_pane", globalNamespace, undefined, "framed_glass_pane", "framed_glass_pane", "framed_glass_pane")

	// Nostalgia Turf Set
	generateTurfSet("nostalgia_grass", "pyrite:nostalgia_grass_block")
	// Podzol
	generateTurfSet("podzol", id(mc, "podzol"))
	// Grass Turf Set
	generateTurfSet("grass", id(mc, "grass_block"))
	// Mycelium Turf Set
	generateTurfSet("mycelium", id(mc, "mycelium"))
	// Path Turf Set
	generateTurfSet("path", id(mc, "dirt_path"))

	// Pyrite Dyes, Wool, Carpet, Terracotta
	helpers.vanillaDyes.forEach(function (dye) {
		const concrete = dye + "_concrete"
		blockWriter.writeSlabs(concrete + "_slab", id(mc, concrete), id(mc, concrete), true)
		blockWriter.writeStairs(concrete + "_stairs", id(mc, concrete), id(mc, concrete), true)

	})

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

	// Lamps
	// new Block("glowstone_lamp", "lamp", id(mc, "glowstone"), "glass")
	// new Block("lit_redstone_lamp", "lit_redstone", id(mc, "glowstone"), "glass", id(mc, "redstone_lamp_on"))
	blockWriter.writeLamps("glowstone_lamp", "glowstone")
	blockWriter.writeLamps("lit_redstone_lamp", "lit_redstone", "minecraft:redstone_lamp_on")

	// April Fools Blocks
	new Block("glowing_obsidian", "glowing_obsidian", id(mc, "obsidian"), "obsidian")
	new Block("nostalgia_glowing_obsidian", "nostalgia", id("glowing_obsidian"), "obsidian")
	new Block("locked_chest", "locked_chest", "locked_chest", "wood")

	// Nether Brick Sets
	generateBrickSet("charred_nether_bricks", "charred_nether_bricks")
	generateBrickSet("blue_nether_bricks", "blue_nether_bricks")

	// 1.20 and below walls
	writeWallGatesFromArray(vanillaWalls)
	recipeWriter.writeStonecutterRecipes(["polished_blackstone_wall_gate", "polished_blackstone_brick_wall_gate"], "minecraft:blackstone", 1, undefined, "from_blackstone")
	recipeWriter.writeStonecutterRecipes(["deepslate_brick_wall_gate", "deepslate_tile_wall_gate"], "minecraft:polished_deepslate", 1, undefined, "from_polished_deepslate")
	recipeWriter.writeStonecutterRecipes(["deepslate_brick_wall_gate", "deepslate_tile_wall_gate", "polished_deepslate_wall_gate"], "minecraft:cobbled_deepslate", 1, undefined, "from_cobbled_deepslate")
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
		blockWriter.writeWalls(`waxed_${cutBlock}_wall`, baseCutBlockID)
		blockWriter.writeWallGates(`waxed_${cutBlock}_wall_gate`, baseCutBlockID)
		const smooth = `smooth_${block}`
		const smoothID = id(modID, smooth)
		blockWriter.writeBlock("waxed_"+smooth, "smooth_resource", id(mc, block), undefined, smoothID, false, true, false, false)
		new Block(`waxed_${smooth}_slab`, "slab", smoothID, block, smoothID)
		new Block(`waxed_${smooth}_stairs`, "stairs", smoothID, block, smoothID)
		blockWriter.writeColumns(`waxed_${smooth}_column`, smoothID, smoothID)
		blockWriter.writeWalls(`waxed_${smooth}_wall`, smoothID, smoothID)
		blockWriter.writeWallGates(`waxed_${smooth}_wall_gate`, smoothID, smoothID)
		blockWriter.writeBlock(`waxed_${block}_bricks`, "resource_bricks", baseCutBlockID, undefined, block + "_bricks", true)
		blockWriter.writeChiseledBlock(`waxed_${block}_pillar`, id(mc, block), "resource_pillar", `${block}_pillar`)
		recipeWriter.writeStonecutterRecipes([`waxed_${block}_bricks`, `waxed_${smooth}_slab`, `waxed_${smooth}_stairs`, `waxed_${smooth}_wall`, `waxed_${smooth}_wall_gate`], id(mc, "waxed_"+ baseBlock), 1, undefined, "from_"+block)
		blockWriter.writeBars("waxed_"+block, modID, baseWaxedCutBlockID, block+"_bars")
		blockWriter.writeBlock(`waxed_nostalgia_${block}_block`, "nostalgia_resource", id(mc, block), undefined, id(`nostalgia_${block}_block`), false, true, false, false)

		let waxedBlocks = [
			`waxed_${cutBlock}_wall`, `waxed_${cutBlock}_wall_gate`, 
			"waxed_"+smooth, `waxed_${smooth}_slab`, `waxed_${smooth}_stairs`, `waxed_${smooth}_wall`,
			`waxed_${block}_bricks`, `waxed_${block}_pillar`, "waxed_"+block+"_bars", `waxed_nostalgia_${block}_block`
		]
		
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
			recipeWriter.writeStonecutterRecipes([`${cutBlock}_wall`, `${cutBlock}_wall_gate`], id(mc, baseBlock), 1, undefined, "from_"+baseBlock)
		}
		else {
			baseBlock = baseTexture;
			altNamespace = modID
			blockWriter.writeBlock(cutBlock, cutBlock, id(mc, baseBlock), undefined, cutBlock, true, true)
			blockWriter.writeSlabs(`${cutBlock}_slab`, cutBlock, id(altNamespace, cutBlock), true)
			blockWriter.writeStairs(`${cutBlock}_stairs`, cutBlock, id(altNamespace, cutBlock), true)
			recipeWriter.writeStonecutterRecipes([`${cutBlock}_slab`, `${cutBlock}_stairs`, `${cutBlock}_wall`, `${cutBlock}_wall_gate`], id(mc, baseBlock), 1, undefined, "from_"+baseBlock)
		}

		blockWriter.writeColumns(`cut_${block}_column`, baseCutBlockID)
		blockWriter.writeWalls(`${cutBlock}_wall`, baseCutBlockID)
		blockWriter.writeWallGates(`${cutBlock}_wall_gate`, baseCutBlockID)

		// Smooth, Chiseled, Brick, and Pillar blocks. Quartz is mostly ignored - Walls and Wall Gates are generated.
		if (block === "quartz") {
			baseTexture = baseBlock + "_top"
			// Vanilla uses quartz's bottom texture instead of a dedicated smooth texture.
			blockWriter.writeColumns(`smooth_${block}_column`, id(mc, "smooth_quartz"), id(mc, "quartz_block_bottom"))
			blockWriter.writeWalls(`smooth_${block}_wall`, "minecraft:quartz_block", id(mc, "quartz_block_bottom"))
			blockWriter.writeWallGates(`smooth_${block}_wall_gate`, "minecraft:quartz_block", id(mc, "quartz_block_bottom"))
		}
		else {
			const smooth = `smooth_${block}`
			const smoothID = id(modID, smooth)
			new Block(smooth, "smooth_resource", id(mc, baseBlock), block)
			new Block(`${smooth}_slab`, "slab", smoothID, block)
			new Block(`${smooth}_stairs`, "stairs", smoothID, block)
			blockWriter.writeColumns(smooth+`_column`, smoothID)
			blockWriter.writeWalls(`${smooth}_wall`, smoothID, smoothID)
			blockWriter.writeWallGates(`${smooth}_wall_gate`, smoothID, smoothID)
			blockWriter.writeBlock(`${block}_bricks`, "resource_bricks", baseCutBlockID, undefined, block + "_bricks", true)
			blockWriter.writeChiseledBlock(`${block}_pillar`, id(mc, baseBlock), "resource_pillar")
			recipeWriter.writeStonecutterRecipes([`${block}_bricks`, `${smooth}_slab`, `${smooth}_stairs`, `${smooth}_wall`, `${smooth}_wall_gate`], id(mc, baseBlock), 1, undefined, "from_"+baseBlock)
		}

		// Iron Bars already exist
		if (!block.includes("iron")) {
			blockWriter.writeBars(block, modID, baseCutBlockID)
		}
		// Copper Doors and Trapdoors should be generated only if version is 1.20 or below.
		if (block.includes("copper")) {
			if (majorVersion < 21) {
				blockWriter.writeChiseledBlock(`chiseled_${block}_block`, id(mc, baseBlock), "chiseled_resource")
				new Block(`${block}_door`, "door", id(mc, baseBlock), block)
				new Block(`${block}_trapdoor`, "trapdoor", id(mc, baseBlock), block)
			}
		}
		else {
			if (!block.includes("quartz")) {
				blockWriter.writeChiseledBlock(`chiseled_${block}_block`, id(mc, baseBlock), "chiseled_resource")
			}
			if (!block.includes("iron")) {
				new Block(`${block}_door`, "door", id(mc, baseBlock), block)
				new Block(`${block}_trapdoor`, "trapdoor", id(mc, baseBlock), block)
			}
		}

		new Block(`nostalgia_${block}_block`, "nostalgia_resource", id(mc, baseBlock), block)

		// Unoxidized Copper Blocks use `copper_block` as their texture ID
		if (block === "copper") {
			baseTexture = baseBlock + "_block";
			baseBlock = baseBlock + "_block"
		}
		blockWriter.writeButtons(block + "_button", id(mc, baseBlock), id(mc, baseTexture), "metal_buttons")
		// Iron and Gold Pressure Plates already exist.
		if (!((block === "gold") || (block === "iron"))) {
			blockWriter.writePlates(block + "_pressure_plate", id(mc, baseBlock), id(mc, baseTexture))
		}

	})

	blockWriter.writeFlower("rose")
	blockWriter.writeFlower("blue_rose")
	blockWriter.writeFlower("orange_rose")
	blockWriter.writeFlower("white_rose")
	blockWriter.writeFlower("pink_rose")
	blockWriter.writeFlower("paeonia")
	blockWriter.writeFlower("pink_daisy")
	blockWriter.writeFlower("buttercup")

	new Block("nether_brick_fence_gate", "fence_gate", id(mc, "nether_bricks"), "nether_bricks")
	blockWriter.writePoweredBlock(id(modID, "switchable_glass"))

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
			recipeWriter.writeStonecutterRecipes([`cut_${resourceBlock}_column`, `smooth_${resourceBlock}_column`], `minecraft:${blockBlock}`, 1, undefined, `from_${resourceBlock}`)
		})
		helpers.vanillaDyes.forEach(function(dye) {
			recipeWriter.writeStonecutterRecipes([`${dye}_terracotta_brick_column`], `minecraft:${dye}_terracotta`, 1, undefined, `from_${dye}_terracotta`)
		})
		pyriteDyes.forEach(function(dye) {
			recipeWriter.writeStonecutterRecipes([`${dye}_terracotta_brick_column`], `pyrite:${dye}_terracotta`, 1, undefined, `from_${dye}_terracotta`)
		})
		recipeWriter.writeStonecutterRecipe("sandstone_brick_column", "minecraft:sandstone", 1, undefined, "from_sandstone")
		recipeWriter.writeStonecutterRecipe("sandstone_brick_column", "minecraft:cut_sandstone", 1, undefined, "from_cut_sandstone")
		recipeWriter.writeStonecutterRecipe("andesite_brick_column", "minecraft:polished_andesite", 1, undefined, "from_cut_polished_andesite")
		recipeWriter.writeStonecutterRecipe("diorite_brick_column", "minecraft:polished_diorite", 1, undefined, "from_polished_diorite")
		recipeWriter.writeStonecutterRecipe("granite_brick_column", "minecraft:polished_granite", 1, undefined, "from_polished_granite")
		recipeWriter.writeStonecutterRecipe("terracotta_brick_column", "minecraft:terracotta", 1, undefined, "from_terracotta")
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
	blockWriter.writeBlock("lead_grate", modID, "grate", "oreganized:lead_block", undefined, true, true, undefined, false)

	langHelper.writeLang()
}

function writeDye(item) {
	item = item + "_dye"
	const itemID = id(item)
	const dyeIngredient = helpers.getDyeIngredient(item)
	writeItem(item, modID)
	writeRecipeAdvancement(itemID, dyeIngredient)
	recipeWriter.writeShapelessRecipe(dyeIngredient, itemID, 1)
	tagHelper.tagItem(item, "c:dyes")
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
	// chest = new Block(template + "_chest", globalNamespace, globalNamespace, "chest", stainedPlankBase, "wood")
	new Block(template + "_door", "door", stainedPlankBase, "wood")
	new Block(template + "_sign", "sign", stainedPlankBase, "wood")
	new Block(template + "_hanging_sign", "hanging_sign", hangingSignBase, "wood")
	new Block(template + "_trapdoor", "trapdoor", stainedPlankBase, "wood")
	
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