const fs = require('fs');
const langHelper = require('./helpers/language');
const tagHelper = require('./helpers/tags');
const helpers = require('./helpers/helpers');
const stateHelper = require('./helpers/blockstates');
const recipeHelper = require('./helpers/recipes');
const recipeWriter = require('./writers/recipes');
const modelHelper = require('./helpers/models');
const modelWriter = require('./writers/models');
const lootTableWriter = require('./writers/loot_tables');

// Shorthand for helper functions. These will likely be removed later as the code is fully modularized.
const id = helpers.id
const getPath = helpers.getPath
const getNamespace = helpers.getNamespace;
const readFile = helpers.readFile
const readFileAsJson = helpers.readFileAsJson
const writeFile = helpers.writeFile
const writeFileSafe = helpers.writeFileSafe
const writeRecipes = recipeWriter.writeRecipes
const writeStonecutterRecipes = recipeWriter.writeStonecutterRecipes
const writeLootTables = lootTableWriter.writeLootTables

const modID = helpers.modID;
const mc = helpers.mc;
const mcVersion = helpers.mcVersion;
const majorVersion = helpers.majorVersion
const minorVersion = helpers.minorVersion

const vanillaDyes = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"]

const modDyes = ["glow", "dragon", "star", "honey", "nostalgia", "rose", "poisonous",]

const dyes = vanillaDyes.concat(modDyes)

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

const vanillaResources = ["iron", "gold", "emerald", "diamond", "netherite", "quartz", "amethyst", "lapis", "redstone", "copper", "exposed_copper", "weathered_copper", "oxidized_copper"]

// Paths to various files.
const paths = helpers.paths

let blockIDs = []
let blockTranslations = readFileAsJson("./overrides/lang/en_us.json")
let catTranslations = readFileAsJson("./overrides/lang/lol_us.json")
let upsideDownTranslations = langHelper.flipTranslationFile("./overrides/lang/en_us.json")

class Block {  // Create a class
	constructor(blockID, namespace, baseNamespace, blockType, baseBlock, material) {
		// Initialize with basic variables
		this.blockID = blockID;
		this.namespace = namespace
		this.baseNamespace = baseNamespace
		if (baseNamespace === undefined) {
			this.baseNamespace = namespace
		}
		this.blockType = blockType;
		this.baseBlock = baseBlock;
		this.material = material;

		//Add to global list of blocks.
		blockIDs.push(blockID)

		//Add to global list of block translations.
		this.addTranslation()

		let stonelike = false;
		if ((material === "stone") || (material.includes("brick"))) {
			stonelike = true;
		}

		//Generate block state
		if (blockType === "block") {
			writeBlock(this.blockID, this.namespace, special, this.baseBlock, undefined, undefined, undefined, stonelike)
		}
		else if (blockType === "slab") {
			writeSlabs(id(this.namespace, this.blockID), id(this.baseNamespace, this.baseBlock), undefined, stonelike)
		}
		else if (blockType === "stairs") {
			writeStairs(id(this.namespace, this.blockID), id(this.baseNamespace, this.baseBlock), undefined, stonelike)
		}
		else if (blockType === "wall") {
			writeWalls(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "wall_gate") {
			writeWallGates(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "fence") {
			writeFences(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "fence_gate") {
			writeFenceGates(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "ladder") {
			writeLadders(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "sign") {
			writeSigns(this.blockID, id(modID, this.baseBlock))
		}
		else if (blockType === "hanging_sign") {
			writeHangingSigns(this.blockID, id(modID, this.baseBlock))
		}
		else if (blockType === "door") {
			writeDoors(this.blockID, this.baseBlock)
		}
		else if (blockType === "trapdoor") {
			writeTrapdoors(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "crafting_table") {
			writeCraftingTableBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "button") {
			writeButtons(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "torch") {
			writeTorchBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "torch_lever") {
			writeLeverBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType === "mushroom_stem") {
			writeLogs(this.blockID, this.namespace, this.baseBlock)
			tagHelper.tagBoth(this.blockID, "mushroom_stem")
		}
		else if (blockType === "cobblestone_bricks") {
			writeTerracottaBricks(this.blockID, this.namespace, "cobblestone_bricks", this.baseBlock)
		}
		else if (blockType === "mossy_cobblestone_bricks") {
			writeTerracottaBricks(this.blockID, this.namespace, "mossy_cobblestone_bricks", this.baseBlock)
		}
		else if (blockType === "terracotta_bricks") {
			writeTerracottaBricks(this.blockID, this.namespace, "terracotta_bricks", this.baseBlock)
		}
		else if ((blockType === "framed_glass_pane") || (blockType === "stained_framed_glass_pane")) {
			writePanes(this.blockID, this.namespace, this.baseBlock)
		}
		else if (blockType === "pressure_plate") {
			writePlates(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else if (blockType == "framed_glass") {
			tagHelper.tagBoth(blockID, "c:glass_blocks/colorless")
			writeBlock(this.blockID, this.namespace, this.blockType, this.baseBlock, "cutout")
		}
		else if (blockType == "stained_framed_glass") {
			tagHelper.tagBoth(blockID, "c:glass_blocks")
			writeBlock(this.blockID, this.namespace, this.blockType, this.baseBlock, "translucent")
		}
		else if (blockType == "locked_chest") {
			writeOrientableBlock(this.blockID, this.namespace, this.blockType, this.baseBlock)
		}
		else if (blockType == "nostalgia_grass_block") {
			writeUprightColumnBlock(this.blockID, this.namespace, this.blockType, this.baseBlock)
		}
		else if ((blockType == "nostalgia") || (blockType.includes("smooth_stone_bricks"))) {
			writeBlock(this.blockID, this.namespace, this.blockType, this.baseBlock, undefined, undefined, id(this.namespace, this.blockID), true)
		}
		else {
			writeBlock(this.blockID, this.namespace, this.blockType, this.baseBlock)
		}

		//Generate block loot table
		// if (blockType === "door") {
		// 	lootTableWriter.writeDoorLootTables(this.blockID, this.namespace)

		// }
		// else {
		// 	writeLootTables(this.blockID, this.namespace)

		// }

	}
	generateFullID() {
		console.log(`${this.namespace}:${this.blockID}`)
	}
	addTranslation() {
		return generateLang(this.blockID, "block", this.namespace)
	}
}

function generateResources() {

	populateTemplates()

	new Block("torch_lever", modID, mc, "torch_lever", "torch", "torch")
	new Block("redstone_torch_lever", modID, mc, "torch_lever", "redstone_torch", "torch")
	new Block("soul_torch_lever", modID, mc, "torch_lever", "soul_torch", "torch")

	function generateWoodSet(template) {
		const stainedPlankBase = template + "_planks"

		new Block(template + "_button", modID, modID, "button", stainedPlankBase, "wood")
		new Block(template + "_stairs", modID, modID, "stairs", stainedPlankBase, "wood")
		new Block(template + "_slab", modID, modID, "slab", stainedPlankBase, "wood")
		new Block(template + "_pressure_plate", modID, undefined, "pressure_plate", stainedPlankBase, "wood")
		new Block(template + "_fence", modID, modID, "fence", stainedPlankBase, "wood")
		new Block(template + "_fence_gate", modID, modID, "fence_gate", stainedPlankBase, "wood")
		new Block(template + "_planks", modID, modID, "planks", template, "wood")
		new Block(template + "_crafting_table", modID, undefined, "crafting_table", stainedPlankBase, "wood")
		new Block(template + "_ladder", modID, modID, "ladder", stainedPlankBase, "wood")
		// chest = new Block(template + "_chest", globalNamespace, globalNamespace, "chest", stainedPlankBase, "wood")
		new Block(template + "_door", modID, modID, "door", stainedPlankBase, "wood")
		new Block(template + "_sign", modID, modID, "sign", stainedPlankBase, "wood")
		new Block(template + "_hanging_sign", modID, modID, "hanging_sign", stainedPlankBase, "wood")
		new Block(template + "_trapdoor", modID, modID, "trapdoor", stainedPlankBase, "wood")
	}

	function generateBrickSet(template, type, baseBlock) {
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
		if (baseBlock === undefined) {
			baseBlock = template
		}

		const bricksBase = brickBase + "s"
		new Block(bricksBase, modID, undefined, type, baseBlock, type)
		new Block(brickBase + "_slab", modID, undefined, "slab", bricksBase, type)
		new Block(brickBase + "_stairs", modID, undefined, "stairs", bricksBase, type)
		new Block(brickBase + "_wall", modID, undefined, "wall", bricksBase, type)
		new Block(brickBase + "_wall_gate", modID, undefined, "wall_gate", bricksBase, type)

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
				baseBlock = `${baseBlock.replace("brick", "bricks")}`
				baseBlock = `${baseBlock.replace("tile", "tiles")}`
			}
			new Block(blockTemplate + "_wall_gate", modID, namespace, "wall_gate", id(namespace, baseBlock), "stone")
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
			new Block(template + "_crafting_table", modID, namespace, "crafting_table", plankBase, "wood")
		})
	}

	dyes.forEach(function (dye) {
		let stainedBlockTemplate = dye + "_stained"
		generateWoodSet(stainedBlockTemplate)
		generateBrickSet(dye)
		generateBrickSet(dye + "_terracotta_bricks", "terracotta_bricks", `${helpers.getDyeNamespace(dye)}:${dye}_terracotta`)

		// Lamps
		new Block(dye + "_lamp", modID, undefined, "lamp", dye, "lamp")
		//Torches
		new Block(dye + "_torch", modID, undefined, "torch", dye, "torch")
		//Torch Levers
		new Block(dye + "_torch_lever", modID, modID, "torch_lever", dye, "torch")
		//Framed Glass
		new Block(dye + "_framed_glass", modID, undefined, "stained_framed_glass", dye, "stained_framed_glass")
		//Framed Glass Panes
		new Block(dye + "_framed_glass_pane", modID, undefined, "stained_framed_glass_pane", dye, "stained_framed_glass_pane")
	})

	writeCraftingTablesFromArray(vanillaWood, mc)
	if (versionAbove("1.21.4")) {
		writeCraftingTablesFromArray(["pale_oak"], mc)
	}

	writeCraftingTablesFromArray(["skyroot"], "aether")
	writeWallGatesFromArray(["holystone", "mossy_holystone", "holystone_brick", "icestone", "aerogel", "carved", "angelic", "hellfire"], "aether", ["holystone", "mossy_holystone", "holystone_bricks", "icestone", "aerogel", "carved_stone", "angelic_stone", "hellfire_stone"])


	const shroomBlockTemplate = "_mushroom"
	const redShroom = "red" + shroomBlockTemplate
	const brownShroom = "brown" + shroomBlockTemplate
	generateWoodSet(redShroom)
	red_stem = new Block(redShroom + "_stem", modID, undefined, "mushroom_stem", redShroom + "_planks", "wood")
	generateWoodSet(brownShroom)
	brown_stem = new Block(brownShroom + "_stem", modID, undefined, "mushroom_stem", redShroom + "_planks", "wood")

	generateBrickSet("cobblestone_bricks", "cobblestone_bricks", "minecraft:cobblestone")
	generateBrickSet("mossy_cobblestone_bricks", "mossy_cobblestone_bricks")
	recipeWriter.writeShapelessRecipe(["pyrite:cobblestone_bricks", "minecraft:moss_block"], "pyrite:mossy_cobblestone_bricks", 1, "from_moss_block")
	generateBrickSet("smooth_stone_bricks", "smooth_stone_bricks", "minecraft:smooth_stone")

	writeBlock("nostalgia_cobblestone", modID, "nostalgia_cobblestone", "nostalgia_cobblestone")
	writeBlock("nostalgia_mossy_cobblestone", modID, "nostalgia_mossy_cobblestone", "nostalgia_mossy_cobblestone")
	writeBlock("nostalgia_netherrack", modID, "nostalgia_netherrack", "nostalgia_netherrack")
	writeBlock("nostalgia_gravel", modID, "nostalgia_gravel", "nostalgia_gravel")
	new Block("nostalgia_grass_block", modID, undefined, "nostalgia_grass_block", "grass_block", "grass")

	//Framed Glass
	new Block("framed_glass", modID, undefined, "framed_glass", "framed_glass", "framed_glass")
	// Framed Glass Panes
	writePanes("framed_glass_pane", modID, "framed_glass")
	// new Block("framed_glass_pane", globalNamespace, undefined, "framed_glass_pane", "framed_glass_pane", "framed_glass_pane")

	// Nostalgia Turf Set
	writeBlock("nostalgia_grass_turf", modID, "nostalgia_grass_turf", id(modID, "nostalgia_grass_block"), undefined, modID, "pyrite:nostalgia_grass_block_top")
	writeSlabs("nostalgia_grass_slab", "nostalgia_grass_turf", "nostalgia_grass_block_top")
	writeStairs("nostalgia_grass_stairs", "nostalgia_grass_turf", "nostalgia_grass_block_top")
	writeCarpet("nostalgia_grass_carpet", modID, "nostalgia_grass_block_top", modID)

	// Podzol Turf Set
	writeBlock("podzol_turf", modID, "podzol_turf", id(mc, "podzol"), undefined, mc, "minecraft:podzol_top")
	writeSlabs("podzol_slab", "podzol_turf", "minecraft:podzol_top")
	writeStairs("podzol_stairs", "podzol_turf", "minecraft:podzol_top")
	writeCarpet("podzol_carpet", modID, "podzol_top", mc)

	// Grass Turf Set
	writeBlock("grass_turf", modID, "grass_turf", id(mc, "grass_block"), undefined, mc, "minecraft:grass_block_top")
	writeSlabs("grass_slab", "grass_turf", "minecraft:grass_block_top")
	writeStairs("grass_stairs", "grass_turf", "minecraft:grass_block_top")
	writeCarpet("grass_carpet", modID, "minecraft:grass_block_top", mc)

	// Mycelium Turf Set
	writeBlock("mycelium_turf", modID, "mycelium_turf", id(mc, "mycelium"), undefined, mc, "minecraft:mycelium_top")
	writeSlabs("mycelium_slab", "mycelium_turf", "minecraft:mycelium_top")
	writeStairs("mycelium_stairs", "mycelium_turf", "minecraft:mycelium_top")
	writeCarpet("mycelium_carpet", modID, "mycelium_top", mc)

	// Path Turf Set
	writeBlock("path_turf", modID, "path_turf", id(mc, "dirt_path"), undefined, mc, "minecraft:dirt_path_top")
	writeSlabs("path_slab", "path_turf", "minecraft:dirt_path_top")
	writeStairs("path_stairs", "path_turf", "minecraft:dirt_path_top")
	writeCarpet("path_carpet", modID, "dirt_path_top", mc)

	// Pyrite Dyes, Wool, Carpet, Terracotta
	vanillaDyes.forEach(function (dye) {
		const concrete = dye + "_concrete"
		writeSlabs(concrete + "_slab", id(mc, concrete), id(mc, concrete), true)
		writeStairs(concrete + "_stairs", id(mc, concrete), id(mc, concrete), true)

	})

	modDyes.forEach(function (dye) {
		writeDye(dye)
		writeWool(dye + "_wool", dye, modID)
		writeCarpet(dye + "_carpet", modID, dye + "_wool")
		writeTerracotta(dye, dye, modID)
		const concrete = dye + "_concrete"
		writeConcrete(dye, dye, modID)
		writeConcretePowder(dye, dye, modID)
		writeSlabs(concrete + "_slab", id(modID, concrete), id(modID, concrete), true)
		writeStairs(concrete + "_stairs", id(modID, concrete), id(modID, concrete), true)
	})

	// Lamps
	writeLamps("glowstone_lamp", "glowstone")
	writeLamps("lit_redstone_lamp", "lit_redstone", "minecraft:redstone_lamp_on")

	// April Fools Blocks
	writeBlock("glowing_obsidian", modID, "glowing_obsidian", "glowing_obsidian")
	writeBlock("nostalgia_glowing_obsidian", modID, "glowing_obsidian", "glowing_obsidian")
	new Block("locked_chest", modID, undefined, "locked_chest", "locked_chest", "wood")

	// Nether Brick Sets
	generateBrickSet("charred_nether_bricks", "charred_nether_bricks")
	generateBrickSet("blue_nether_bricks", "blue_nether_bricks")

	// 1.20 and below walls
	writeWallGatesFromArray(vanillaWalls)

	// 1.21 - Tricky Trials Tuff walls
	if (majorVersion >= 21) {
		writeWallGatesFromArray(["polished_tuff", "tuff_brick", "tuff"])
	}

	// 1.21.4 - Winter Drop Resin walls
	if (majorVersion > 22 || (mcVersion == "1.21.4")) {
		writeWallGatesFromArray(["resin_brick"])
	}

	vanillaResources.forEach(function (block) {
		let baseBlock = block
		let altNamespace;
		let cutBlockID = `cut_${block}`
		let baseTexture = block + "_block";
		// Cut Blocks - Copper is ignored.
		if (block === "copper" || block === "exposed_copper" || block === "oxidized_copper" || block === "weathered_copper") {
			baseTexture = block;
			altNamespace = mc
			// Vanilla swaps Cut and Oxidization state
			cutBlockID = cutBlockID.replace("cut_weathered", "weathered_cut")
			cutBlockID = cutBlockID.replace("cut_oxidized", "oxidized_cut")
			cutBlockID = cutBlockID.replace("cut_exposed", "exposed_cut")
		}
		else {
			baseBlock = baseTexture;
			altNamespace = modID
			writeBlock(cutBlockID, modID, cutBlockID, id(mc, baseBlock), undefined, undefined, cutBlockID, true)
			writeSlabs(`${cutBlockID}_slab`, cutBlockID, id(modID, cutBlockID), true)
			writeStairs(`${cutBlockID}_stairs`, cutBlockID, id(modID, cutBlockID), true)
		}

		writeWalls(`cut_${block}_wall`, modID, id(altNamespace, cutBlockID))
		writeWallGates(`cut_${block}_wall_gate`, modID, id(altNamespace, cutBlockID), modID)

		// Smooth, Chiseled, and Pillar blocks. Quartz is mostly ignored - Walls and Wall Gates are generated.
		if (block === "quartz") {
			baseTexture = baseBlock + "_top"
			// Vanilla uses quartz's bottom texture instead of a dedicated smooth texture.
			writeWalls(`smooth_${block}_wall`, modID, `minecraft:quartz_block_bottom`)
			writeWallGates(`smooth_${block}_wall_gate`, modID, `minecraft:quartz_block_bottom`, modID)
		}
		else {
			const smooth = `smooth_${block}`
			writeBlock(smooth, modID, "smooth_resource", id(mc, baseBlock), undefined, undefined, smooth, true)
			writeSlabs(`${smooth}_slab`, smooth, id(modID, smooth), true)
			writeStairs(`${smooth}_stairs`, smooth, id(modID, smooth), true)
			writeWalls(`${smooth}_wall`, modID, smooth)
			writeWallGates(`${smooth}_wall_gate`, modID, `${smooth}`, modID)
			writeBlock(block + "_bricks", modID, "resource_bricks", id(altNamespace, cutBlockID), undefined, modID, block + "_bricks", true)
			writeChiseledBlock(`${block}_pillar`, id(mc, baseBlock), modID, "resource_pillar")
		}

		// Iron Bars already exist
		if (!block.includes("iron")) {
			writeBars(block, modID, baseBlock)
		}
		// Copper Doors and Trapdoors should be generated only if version is 1.20 or below.
		if (block.includes("copper")) {
			if (majorVersion < 21) {
				writeChiseledBlock(`chiseled_${block}_block`, id(mc, baseBlock), modID, "chiseled_resource")
				writeDoors(`${block}_door`, id(mc, baseBlock))
				writeTrapdoors(`${block}_trapdoor`, modID, id(mc, baseBlock))
			}
		}
		else {
			if (!block.includes("quartz")) {
				writeChiseledBlock(`chiseled_${block}_block`, id(mc, baseBlock), modID, "chiseled_resource")
			}
			if (!block.includes("iron")) {
				writeDoors(`${block}_door`, id(mc, baseBlock))
				writeTrapdoors(`${block}_trapdoor`, modID, id(mc, baseBlock))
			}
		}

		new Block(`nostalgia_${block}_block`, modID, undefined, "nostalgia", id(mc, baseBlock), block)

		// Unoxidized Copper Blocks use `copper_block` as their texture ID
		if (block === "copper") {
			baseTexture = baseBlock + "_block";
		}
		writeButtons(block + "_button", modID, id(mc, baseTexture), mc, "metal_buttons")
		// Iron and Gold Pressure Plates already exist.
		if (!((block === "gold") || (block === "iron"))) {
			writePlates(block + "_pressure_plate", modID, id(mc, baseTexture), mc)
		}

	})

	writeFlower("rose")
	writeFlower("blue_rose")
	writeFlower("orange_rose")
	writeFlower("white_rose")
	writeFlower("pink_rose")
	writeFlower("paeonia")
	writeFlower("pink_daisy")
	writeFlower("buttercup")

	writeFenceGates("nether_brick_fence_gate", modID, id(mc, "nether_bricks"), mc)
	writePoweredBlock(id(modID, "switchable_glass"))

	// Add Pyrite tags to MC/convention tags.
	tagHelper.tagBoth("#pyrite:dyed_bricks", "c:bricks/normal", true)
	tagHelper.tagBoth("#pyrite:crafting_tables", "c:player_workstations/crafting_tables", true)
	tagHelper.tagBlock("#pyrite:obsidian", "minecraft:dragon_immune")
	tagHelper.tagBlock("#pyrite:ladders", "minecraft:climbable")
	tagHelper.tagBlock("#pyrite:carpet", "minecraft:sword_efficient")
	tagHelper.tagBothFromArray(["#c:dyed/honey", "#c:dyed/glow", "#c:dyed/nostalgia", "#c:dyed/dragon", "#c:dyed/star", "#c:dyed/poisonous", "#c:dyed/rose"], "c:dyed")

	// Add Pyrite tags to tool tags
	tagHelper.tagBlocks(["#pyrite:wall_gates", "#pyrite:bricks"], "minecraft:needs_wood_tool")
	tagHelper.tagBlocks(["#pyrite:iron", "#pyrite:lapis", "#pyrite:copper", "#pyrite:exposed_copper", "#pyrite:weathered_copper", "#pyrite:oxidized_copper"], "minecraft:needs_stone_tool")
	tagHelper.tagBlocks(["#pyrite:gold", "#pyrite:diamond", "#pyrite:emerald"], "minecraft:needs_iron_tool")
	tagHelper.tagBlocks(["#pyrite:obsidian", "#pyrite:netherite"], "minecraft:needs_diamond_tool")

	tagHelper.tagBlocks(readFileAsJson("./overrides/mineable/axe.json"), "minecraft:mineable/axe")
	tagHelper.tagBlocks(["#pyrite:carpet"], "minecraft:mineable/hoe")
	tagHelper.tagBlocks(readFileAsJson("./overrides/mineable/pickaxe.json"), "minecraft:mineable/pickaxe")
	tagHelper.tagBlocks(readFileAsJson("./overrides/mineable/shovel.json"), "minecraft:mineable/shovel")

	// Add Pyrite tags to Pyrite tags
	tagHelper.tagBlock("#pyrite:terracotta_bricks", "bricks")

	// Generate translations for Pyrite item tags.
	const newModTags = [
		"wall_gates", "lamps", "bricks", "dyed_bricks", 
		"stained_framed_glass", "fences", "wool", "metal_bars", "planks", "brick_stairs", "metal_trapdoors", "brick_walls", "metal_buttons",
		"concrete_slabs", "concrete_stairs"
	]
	newModTags.forEach(function(tag) {
		generateLang(tag, "tag.item", modID)
	})
	const newConventionTags = ["dyed/honey", "dyed/glow", "dyed/nostalgia", 
		"dyed/poisonous", "dyed/rose", "dyed/star", "dyed/dragon"]
	newConventionTags.forEach(function(tag) {
		generateLang(tag, "tag.item", "c")
	})


	// Write final language file.
	writeLang()
}

generateResources()

function writeLang() {
	writeFile(`${helpers.paths.assets}lang/en_us.json`, JSON.stringify(blockTranslations, undefined, " "))
	writeFile(`${helpers.paths.assets}lang/lol_us.json`, JSON.stringify(catTranslations, undefined, " "))
	writeFile(`${helpers.paths.assets}lang/en_ud.json`, JSON.stringify(upsideDownTranslations, undefined, " "))
}

function writeBlockstate(block, blockState, namespace, altNamespace) {
	if (altNamespace == undefined) {
		altNamespace = namespace
	}
	let modelSubdirectory = ""
	if ((altNamespace != "pyrite") && (altNamespace != "minecraft")) {
		modelSubdirectory = altNamespace + "/"
	}
	block = getPath(block)
	writeFile(`${paths.blockstates}${block}.json`, blockState)
}

function generateLang(block, type, namespace) {
	if (type === undefined) {
		type = "block";
	}
	block = getPath(block)
	let langBlock = block;
	langBlock = langBlock.replaceAll("_", " ");
	langBlock = langBlock.replaceAll("/", " ");
	langBlock = langBlock.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(); });
	const key = `${type}.${namespace}.${block.replace("/", ".")}`;
	const value = langBlock;
	if (!blockTranslations.hasOwnProperty(key)) {
		blockTranslations = Object.assign(blockTranslations, JSON.parse(`{"${key}": "${value}"}`));
	}
	if (!catTranslations.hasOwnProperty(key)) {
		catTranslations = Object.assign(catTranslations, JSON.parse(`{"${key}": "${langHelper.catify(value)}"}`));
	}
	if (!upsideDownTranslations.hasOwnProperty(key)) {
		upsideDownTranslations = Object.assign(upsideDownTranslations, JSON.parse(`{"${key}": "${langHelper.upsideDownify(value)}"}`));
	}
	return value;
}

function generateBlockLang(block) {
	return generateLang(block, "block", modID)
}

function writeBlockItemModel(block, namespace, altNamespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	let modelSubdirectory = ""
	if ((altNamespace != "pyrite") && (altNamespace != "minecraft")) {
		modelSubdirectory = altNamespace + "/"
	}
	const blockPath = getPath(block)
	if (versionAbove("1.21.4")) {
		writeWinterDropItem(namespace, "block", blockPath)
		const modelItem = { "parent": "minecraft:item/generated", "textures": { "layer0": `${namespace}:block/${modelSubdirectory}${blockPath}` } }
		writeFile(`${paths.itemModels}${blockPath}.json`, modelItem);
	}
	else {
		const modelItem = `{"parent": "${namespace}:block/${modelSubdirectory}${blockPath}"}`
		writeFile(`${paths.itemModels}${blockPath}.json`, modelItem);
	}
}

function writeWinterDropItem(namespace, folder, path, model) {
	if (model == undefined) {
		model = path
	}
	const item =
	{
		"model": {
			"type": "minecraft:model",
			"model": `${namespace}:${folder}/${model}`
		}
	}
	writeFile(`${paths.assets}items/${path}.json`, item);
}

function writeTrapdoorItemModel(block, namespace) {
	if (versionAbove("1.21.4")) {
		writeWinterDropItem(namespace, "block", block, `${block}_bottom`)
	}
	let modelItem = `{
		"parent": "${namespace}:block/${block}_bottom"
	  }`
	writeFile(`${paths.itemModels}${block}.json`, modelItem);
}

function writeUniqueItemModel(block) {
	if (versionAbove("1.21.4")) {
		writeWinterDropItem(modID, "item", block, block)
	}
	else {
		let modelItem = `{"parent": "minecraft:item/generated","textures": {"layer0": "${modID}:item/${block}"}}`
		writeFile(`${paths.itemModels}${block}.json`, modelItem);
	}
}

function writeUniqueBlockItemModel(block, namespace, altNamespace, baseBlock) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (altNamespace === undefined) {
		altNamespace = namespace;
	}
	if (baseBlock === undefined) {
		baseBlock = block
	}
	if (versionAbove("1.21.4")) {
		writeWinterDropItem(altNamespace, "item", block, baseBlock)
	}
	else {
		const modelItem = `{"parent": "minecraft:item/generated","textures": {"layer0": "${altNamespace}:block/${baseBlock}"}}`
		writeFile(`${paths.itemModels}${block}.json`, modelItem)
	}
}

function writeInventoryModel(block, namespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (versionAbove("1.21.4")) {
		writeWinterDropItem(namespace, "block", block, `${block}_inventory`)
	}
	else {
		const modelItem = `{"parent": "${namespace}:block/${block}_inventory"}`
		writeFile(`${paths.itemModels}${block}.json`, modelItem);
	}
}

function writeTerracotta(block, dye, namespace) {
	block = block + "_terracotta"
	tagHelper.tagBoth(block, `c:dyed/${dye}`)
	writeBlock(block, namespace, "terracotta", dye)
}

function writeConcrete(block, dye, namespace) {
	block = block + "_concrete"
	tagHelper.tagBoth(block, `c:dyed/${dye}`)
	tagHelper.tagBoth(block, `c:concrete`)
	tagHelper.tagBlock(block, `minecraft:mineable/pickaxe`)
	writeBlock(block, namespace, "concrete", dye)
}

function writeConcretePowder(block, dye, namespace) {
	block = block + "_concrete_powder"
	tagHelper.tagBoth(block, `c:dyed/${dye}`)
	tagHelper.tagBoth(block, `c:concrete_powder`)
	tagHelper.tagBlock(block, `minecraft:mineable/shovel`)
	writeBlock(block, namespace, "concrete_powder", dye)
}

function writeLamps(block, type, texture) {
	writeBlock(block, modID, "lamps", type, undefined, undefined, texture, false)
}

function writeWool(block, dye, namespace) {
	tagHelper.tagBoth(block, `c:dyed/${dye}`)
	writeBlock(block, namespace, "wool", dye)
}

function writeTerracottaBricks(block, namespace, special, baseBlock) {
	const blockState = stateHelper.gen(`${block}_north_west_mirrored`, namespace)
	writeBlockstate(block, blockState, namespace)
	modelWriter.writeMirroredBricks(block, namespace, block)
	writeBlockItemModel(block, namespace)
	writeRecipes(block, special, baseBlock, namespace)
	lootTableWriter.writeLootTables(block)
	if (block.includes("terracotta")) {
		tagHelper.tagBlock(block, "terracotta_bricks")
	}
	else {
		tagHelper.tagBlock(block, "bricks")
	}
	writeStonecutterRecipes(block, baseBlock, 1)
}

function writeDye(item) {
	item = item + "_dye"
	writeItem(item, modID)
	recipeWriter.writeShapelessRecipe(getDyeIngredient(item), id(item), 1)
}

function writeItem(item) {
	generateLang(item, "item", modID)
	tagHelper.tagItem(item, "c:dyes")
	writeUniqueItemModel(item)
}

function writeDoors(block, baseBlock) {
	const doorBlockState = stateHelper.genDoors(block, modID, baseBlock)
	writeBlockstate(block, doorBlockState, modID)
	modelWriter.writeDoors(block)
	writeUniqueItemModel(block)
	generateBlockLang(block)
	lootTableWriter.writeDoorLootTables(block)
	tagHelper.tagBoth(block, "minecraft:doors")
	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_doors")
	}
	else {
		tagHelper.tagBlock(block, baseBlock.split(":")[1].split("_block")[0])
	}

	writeRecipes(block, "door", baseBlock)
}

function writeTrapdoors(block, namespace, baseBlock) {
	let doorBlockState = stateHelper.genTrapdoors(block, namespace, baseBlock)
	writeBlockstate(block, doorBlockState, namespace)
	modelWriter.writeTrapdoors(block, namespace, baseBlock)
	writeTrapdoorItemModel(block, namespace)
	writeLootTables(block, namespace)
	generateBlockLang(block)
	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_trapdoors")
	}
	else {
		tagHelper.tagBoth(block, "metal_trapdoors")
	}
	writeRecipes(block, "trapdoor", baseBlock)
}

function writeBlock(block, namespace, blockType, baseBlock, render_type, altNamespace, texture, shouldGenerateStonecutterRecipes) {
	if (altNamespace === undefined) {
		altNamespace = namespace;

	}
	if (texture == undefined) {
		texture = baseBlock
	}
	writeBlockstate(block, stateHelper.gen(block, namespace), namespace)
	modelWriter.writeBlock(block, namespace, texture, undefined, render_type)
	writeBlockItemModel(block, namespace)
	writeLootTables(block, namespace)
	generateBlockLang(block)

	// Tag various blocks based off block type.
	if (blockType == "planks") {
		tagHelper.tagBoth(block, "minecraft:planks")
		tagHelper.checkAndAddStainedTag(block, baseBlock)
	}
	else if (blockType == "wool") {
		tagHelper.tagBoth(block, "minecraft:wool")
	}
	else if (blockType == "terracotta") {
		tagHelper.tagBoth(block, "minecraft:terracotta")
	}
	else if ((blockType == "lamps") || (blockType == "lamp")) {
		tagHelper.tagBoth(block, "lamps")
		tagHelper.checkAndAddDyedTag(block, baseBlock)
	}
	else if (blockType.includes("resource_bricks")) {
		const blockType = baseBlock.split(":")[1].split("cut_")[1]
		tagHelper.tagBlock(block, blockType)
		tagHelper.checkAndAddBeaconTag(block, blockType)
	}
	else if (blockType.includes("bricks")) {
		if (blockType == "bricks") {
			tagHelper.tagBoth(block, "dyed_bricks")
		}
		else if (blockType.includes("nether")) {
			tagHelper.tagBoth(block, "c:bricks/nether", true)
		}
		tagHelper.tagBoth(block, "bricks")
		tagHelper.checkAndAddDyedTag(block, baseBlock)
	}
	else if (blockType == "stained_framed_glass") {
		tagHelper.tagBoth(block, "stained_framed_glass")
		tagHelper.checkAndAddStainedTag(block, baseBlock)
	}
	else if (blockType.includes("turf") || blockType.includes("grass_block")) {
		if (blockType.includes("turf")) {
			tagHelper.tagBlock(block, "turf_blocks")
		}
		tagHelper.tagBoth(block, "minecraft:dirt", true)
	}
	else if (blockType.includes("gravel")) {
		tagHelper.tagBlock(block, "minecraft:bamboo_plantable_on", true)
		tagHelper.tagBlock(block, "minecraft:enderman_holdable", true)
	}
	else if (blockType.includes("netherrack")) {
		tagHelper.tagBlock(block, "minecraft:infiniburn_end", true)
		tagHelper.tagBlock(block, "minecraft:infiniburn_nether", true)
		tagHelper.tagBlock(block, "minecraft:infiniburn_overworld", true)
	}
	else if (blockType.includes("smooth_resource")) {
		const blockType = block.split("smooth_")[1]
		tagHelper.tagBlock(block, blockType)
		tagHelper.checkAndAddBeaconTag(block, blockType)
		tagHelper.tagBlock(block, "smooth_blocks")
	}
	else if (blockType.includes("cut_")) {
		const blockType = block.split("cut_")[1]
		tagHelper.tagBlock(block, blockType)
		tagHelper.checkAndAddBeaconTag(block, blockType)
		tagHelper.tagBlock(block, "cut_blocks")
	}
	else if (blockType.includes("obsidian")) (
		tagHelper.tagBlock(block, "obsidian")
	)
	else if (blockType == "nostalgia") {
		tagHelper.tagBlock(block, block.split("nostalgia_")[1].split("_block")[0])
	}

	// Generate recipes
	writeRecipes(block, blockType, baseBlock, namespace)
	if (shouldGenerateStonecutterRecipes === true) {
		writeStonecutterRecipes(block, baseBlock, 1)
	}
	writeLootTables(block)
	return block;
}

function writeLeverBlock(block, namespace, baseBlock, altNamespace) {
	let uprightBlock;
	if (altNamespace === mc) {
		uprightBlock = block
	}
	else {
		uprightBlock = baseBlock
		uprightBlock += "_torch"
		baseBlock += "_torch"
	}

	const blockState = `{"variants":{"face=ceiling,facing=east,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","x":180,"y":270},"face=ceiling,facing=east,powered=true":{"model":"${namespace}:block/${block}","x":180,"y":270},"face=ceiling,facing=north,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","x":180,"y":180},"face=ceiling,facing=north,powered=true":{"model":"${namespace}:block/${block}","x":180,"y":180},"face=ceiling,facing=south,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","x":180},"face=ceiling,facing=south,powered=true":{"model":"${namespace}:block/${block}","x":180},"face=ceiling,facing=west,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","x":180,"y":90},"face=ceiling,facing=west,powered=true":{"model":"${namespace}:block/${block}","x":180,"y":90},"face=floor,facing=east,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","y":90},"face=floor,facing=east,powered=true":{"model":"${namespace}:block/${block}","y":90},"face=floor,facing=north,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright"},"face=floor,facing=north,powered=true":{"model":"${namespace}:block/${block}"},"face=floor,facing=south,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","y":180},"face=floor,facing=south,powered=true":{"model":"${namespace}:block/${block}","y":180},"face=floor,facing=west,powered=false":{"model":"${namespace}:block/${uprightBlock}_upright","y":270},"face=floor,facing=west,powered=true":{"model":"${namespace}:block/${block}","y":270},"face=wall,facing=east,powered=false":{"model":"${namespace}:block/${block}_wall"},"face=wall,facing=east,powered=true":{"model":"${namespace}:block/${block}","x":90,"y":90},"face=wall,facing=north,powered=false":{"model":"${namespace}:block/${block}_wall","y":270},"face=wall,facing=north,powered=true":{"model":"${namespace}:block/${block}","x":90},"face=wall,facing=south,powered=false":{"model":"${namespace}:block/${block}_wall","y":90},"face=wall,facing=south,powered=true":{"model":"${namespace}:block/${block}","x":90,"y":180},"face=wall,facing=west,powered=false":{"model":"${namespace}:block/${block}_wall","y":180},"face=wall,facing=west,powered=true":{"model":"${namespace}:block/${block}","x":90,"y":270}}}`
	writeBlockstate(block, blockState, namespace)
	modelWriter.writeLevers(block, namespace, baseBlock, altNamespace)
	writeUniqueBlockItemModel(block, namespace, altNamespace, baseBlock)
	writeLootTables(block, namespace)
	writeRecipes(block, "torch_lever", baseBlock, namespace, altNamespace)
	writeLootTables(block)
}

function writeTorchBlock(block, namespace, baseBlock, altNamespace) {
	const blockState = `{"variants":{"face=ceiling,facing=east":{"model":"${namespace}:block/${block}_upright","x":180,"y":270},"face=ceiling,facing=north":{"model":"${namespace}:block/${block}_upright","x":180,"y":180},"face=ceiling,facing=south":{"model":"${namespace}:block/${block}_upright","x":180},"face=ceiling,facing=west":{"model":"${namespace}:block/${block}_upright","x":180,"y":90},"face=floor,facing=east":{"model":"${namespace}:block/${block}_upright","y":90},"face=floor,facing=north":{"model":"${namespace}:block/${block}_upright"},"face=floor,facing=south":{"model":"${namespace}:block/${block}_upright","y":180},"face=floor,facing=west":{"model":"${namespace}:block/${block}_upright","y":270},"face=wall,facing=east":{"model":"${namespace}:block/${block}_wall"},"face=wall,facing=north":{"model":"${namespace}:block/${block}_wall","y":270},"face=wall,facing=south":{"model":"${namespace}:block/${block}_wall","y":90},"face=wall,facing=west":{"model":"${namespace}:block/${block}_wall","y":180}}}`
	writeBlockstate(block, blockState, namespace)
	modelWriter.writeTorches(block, namespace, block, altNamespace)
	writeUniqueBlockItemModel(block, namespace, namespace, block)
	writeLootTables(block, namespace)
	tagHelper.tagBoth(block, `c:dyed/${baseBlock}`)
	writeRecipes(block, "torch", baseBlock, namespace, altNamespace)
	writeLootTables(block)
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
	writeBlockstate(block, blockState, namespace)
	modelWriter.writePoweredBlock(block)
	writeBlockItemModel(block, namespace)
	generateBlockLang(block)
	writeLootTables(block, namespace)
	writeRecipes(block, "powered", undefined, namespace)
	writeLootTables(block)
}

function writeCraftingTableBlock(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	const blockState = stateHelper.gen(block, namespace, altNamespace)
	writeBlockstate(block, blockState, namespace)
	modelWriter.writeCraftingTables(block, namespace, baseBlock, altNamespace)
	writeBlockItemModel(block, namespace, altNamespace)
	generateBlockLang(block)
	tagHelper.tagBoth(block, "crafting_tables", true)
	tagHelper.checkAndAddStainedTag(block, baseBlock)
	writeRecipes(block, "crafting_table", baseBlock, namespace, altNamespace)
	writeLootTables(block, namespace, undefined, altNamespace)
}

function writeLadders(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	const blockState = `{"variants":{"facing=east":{"model":"${namespace}:block/${block}","y":90},"facing=north":{"model":"${namespace}:block/${block}"},"facing=south":{"model":"${namespace}:block/${block}","y":180},"facing=west":{"model":"${namespace}:block/${block}","y":270}}}`
	writeBlockstate(block, blockState, namespace)
	modelWriter.writeBlock(block, namespace, baseBlock, "pyrite:block/template_ladder")
	writeUniqueBlockItemModel(block, namespace, namespace)
	writeLootTables(block, namespace)
	tagHelper.tagBlock(block, "ladders")
	writeRecipes(block, "ladder", baseBlock, namespace, altNamespace)
	writeLootTables(block)
}

function writeChests(block, dye, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	block += "_chest"
	const blockState = stateHelper.gen(block, namespace)
	writeBlockstate(block, blockState, namespace)
	modelWriter.writeBlock(block, namespace, baseBlock)
	writeUniqueBlockItemModel(block, namespace)
	writeLootTables(block, namespace)
	writeRecipes(block, "chest", baseBlock, namespace, altNamespace)
}

function writeFlower(block) {
	const blockState =  stateHelper.gen(block, modID)
	writeBlockstate(block, blockState, modID)
	modelWriter.writeFlowers(block, modID)
	writeUniqueBlockItemModel(block, modID)
	tagHelper.tagBoth(block, "minecraft:small_flowers")
	generateBlockLang(block)
	writeLootTables(block, modID)
	writeRecipes(block, "flower")
}

function writeChiseledBlock(block, baseBlock, namespace, special) {
	blockState = `{"variants":{"axis=x":{"model":"${namespace}:block/${block}_horizontal","x":90,"y":90},"axis=y":{"model":"${namespace}:block/${block}"},"axis=z":{"model":"${namespace}:block/${block}_horizontal","x":90}}}`
	writeBlockstate(block, blockState, namespace)
	modelWriter.writeColumns(block, namespace, baseBlock)
	writeBlockItemModel(block, namespace)
	generateBlockLang(block)
	writeLootTables(block, namespace)
	const blockType = getPath(baseBlock).split("_block")[0]
	tagHelper.tagBlock(block, blockType)
	tagHelper.checkAndAddBeaconTag(block, blockType)
	writeRecipes(block, special, baseBlock)
	writeStonecutterRecipes(block, baseBlock, 1)
}

function writeUprightColumnBlock(block, namespace, blockType, baseBlock) {
	writeBlockstate(block, stateHelper.gen(block, namespace), namespace)
	modelWriter.writeColumns(block, namespace, baseBlock)
	writeBlockItemModel(block, namespace)
	lootTableWriter.writeLootTables(block)
	generateBlockLang(block)
	writeRecipes(block, blockType, baseBlock)
}

function writeOrientableBlock(block, namespace, blockType, baseBlock) {
	writeBlockstate(block, stateHelper.genOrientable(id(modID, block)), namespace)
	modelWriter.writeProvided(block, modelHelper.genOrientable(id(modID, block)))
	writeBlockItemModel(block, namespace)
	generateBlockLang(block)
	writeLootTables(block, namespace)
	writeRecipes(block, blockType, baseBlock)
}

function writeSigns(blockID, baseBlockID, texture) {
	// Setup
	const wallBlockID = blockID.replace("_sign", "_wall_sign")
	if (texture == undefined) {
		texture = baseBlockID
	}
	// Blockstates
	writeBlockstate(blockID, stateHelper.gen(blockID, modID), modID)
	writeBlockstate(wallBlockID, stateHelper.gen(blockID, modID), modID)
	// Models
	modelWriter.writeBlock(blockID, modID, texture)
	writeUniqueItemModel(blockID)
	// Loot Tables
	writeLootTables(blockID, modID)
	writeLootTables(wallBlockID, modID, blockID)
	// Language Entries
	generateBlockLang(blockID)
	// Tags
	tagHelper.tagBoth(blockID, "minecraft:signs")
	tagHelper.tagBlock(wallBlockID, "minecraft:wall_signs")
	tagHelper.checkAndAddDyedTag(blockID, baseBlockID)
	tagHelper.checkAndAddDyedTag(wallBlockID, baseBlockID, true)
	// Generate recipes
	writeRecipes(blockID, "sign", baseBlockID, modID)
	return blockID;
}

function writeHangingSigns(blockID, baseBlockID, texture) {
	// Setup
	const wallBlockID = blockID.replace("_sign", "_wall_sign")
	if (texture == undefined) {
		texture = baseBlockID
	}
	// Blockstates
	writeBlockstate(blockID, stateHelper.gen(blockID, modID), modID)
	writeBlockstate(wallBlockID, stateHelper.gen(blockID, modID), modID)
	// Models
	modelWriter.writeBlock(blockID, modID, texture)
	writeUniqueItemModel(blockID)
	// Loot Tables
	writeLootTables(blockID, modID)
	writeLootTables(wallBlockID, modID, blockID)
	// Language Entries
	generateBlockLang(blockID)
	// Tags
	tagHelper.tagBlock(blockID, "minecraft:ceiling_hanging_signs")
	tagHelper.tagBlock(wallBlockID, "minecraft:wall_hanging_signs")
	tagHelper.tagItem(wallBlockID, "minecraft:hanging_signs")
	tagHelper.checkAndAddDyedTag(blockID, baseBlockID)
	tagHelper.checkAndAddDyedTag(wallBlockID, baseBlockID, true)
	// Generate recipes
	writeRecipes(blockID, "hanging_sign", baseBlockID, modID)
	return blockID;
}

function writePanes(block, namespace, baseBlock) {
	baseBlock = block.replace("_pane", "")
	writeBlockstate(block, stateHelper.genPanes(block, namespace, baseBlock), namespace)
	modelWriter.writePanes(block, namespace, baseBlock)
	writeUniqueBlockItemModel(block, namespace, namespace, baseBlock)
	writeLootTables(block, namespace)
	tagHelper.tagBoth(block, "c:glass_panes")
	tagHelper.checkAndAddDyedTag(block, baseBlock)
	writeRecipes(block, "glass_pane", baseBlock)
	generateBlockLang(block)
}

function writeBars(block, namespace, baseBlock) {
	baseBlock = block
	block = block + "_bars"
	writeBlockstate(block, stateHelper.genBars(block, namespace, baseBlock), namespace)
	modelWriter.writeBars(block, namespace, block)
	writeUniqueBlockItemModel(block, namespace)
	tagHelper.tagBoth(block, "metal_bars")
	generateBlockLang(block)
	writeLootTables(block, namespace)
	writeRecipes(block, "bars", baseBlock)
}

function writeLogs(block, namespace, special) {
	blockState = `{"variants":{"axis=x":{"model":"${namespace}:block/${block}_horizontal","x":90,"y":90},"axis=y":{"model":"${namespace}:block/${block}"},"axis=z":{"model":"${namespace}:block/${block}_horizontal","x":90}}}`
	writeBlockstate(block, blockState, namespace)
	modelWriter.writeLogs(block, namespace)
	lootTableWriter.writeLootTables(block)
	writeBlockItemModel(block, namespace)
	tagHelper.tagBoth(block, "minecraft:logs")
	writeRecipes(block, special)
}

function writeWalls(block, namespace, baseBlock, altNamespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (altNamespace === undefined) {
		altNamespace = namespace
	}

	wallBlockState = stateHelper.genWalls(block, namespace)
	writeBlockstate(block, wallBlockState, namespace)
	modelWriter.writeWalls(block, altNamespace, baseBlock)
	writeInventoryModel(block, namespace)
	writeLootTables(block)
	generateBlockLang(block)
	
	tagHelper.tagBoth(block, "minecraft:walls")
	if (baseBlock.includes("bricks")) {
		tagHelper.tagBoth(block, "brick_walls")
	}

	writeRecipes(block, "wall", baseBlock, altNamespace)
	writeStonecutterRecipes(id(namespace, block), id(namespace, baseBlock), 1)
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
	}
	else {
		textureNamespace = modID;
		texturePath = texture;
	}

	const stairBlockState = stateHelper.genStairs(block, modID)
	writeBlockstate(block, stairBlockState, modID)
	modelWriter.writeStairs(block, textureNamespace, texture)
	writeBlockItemModel(block, modID)
	generateBlockLang(block)
	writeLootTables(block)
	
	//Tag stairs
	tagHelper.tagBoth(block, "minecraft:stairs")
	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_stairs")
		tagHelper.checkAndAddStainedTag(block, baseBlock)
	}
	else if (baseBlock.includes("bricks")) {
		tagHelper.tagBoth(block, "brick_stairs")
	}
	else if ((baseBlock.includes("smooth")) || (baseBlock.includes("cut_"))) {
		tagHelper.checkAndAddResourceTag(block, baseBlock)
	}
	else if (baseBlock.includes("concrete")) {
		tagHelper.tagBoth(block, "concrete_stairs")
		tagHelper.checkAndAddDyedTag(block, baseBlock)
	}
	else {
		tagHelper.tagBlock(block, "turf_stairs")
	}

	// Generate recipes
	writeRecipes(block, "stairs", baseBlock, modID)
	if (shouldGenerateStonecutterRecipes === true) {
		writeStonecutterRecipes(block, baseBlock, 1)
	}
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
	}
	else {
		textureNamespace = modID;
		texturePath = texture;
	}

	const slabBlockState = stateHelper.genSlabs(block, modID, baseBlock)
	writeBlockstate(block, slabBlockState, modID)
	modelWriter.writeSlabs(block, textureNamespace, texture)
	writeBlockItemModel(block, modID)
	generateBlockLang(block)
	writeLootTables(block)

	// Tag slabs
	tagHelper.tagBlock(block, "minecraft:slabs")
	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_slabs")
		tagHelper.checkAndAddStainedTag(block, baseBlock)
	}
	else if (baseBlock.includes("bricks")) {
		tagHelper.tagBlock(block, "brick_slabs")
		tagHelper.checkAndAddDyedTag(block, baseBlock)
	}
	else if (baseBlock.includes("smooth_") || baseBlock.includes("cut_")) {
		tagHelper.checkAndAddResourceTag(block, baseBlock)
	}
	else if (baseBlock.includes("concrete")) {
		tagHelper.tagBoth(block, "concrete_slabs")
		tagHelper.checkAndAddDyedTag(block, baseBlock)
	}
	else {
		tagHelper.tagBlock(block, "turf_slabs")
	}

	// Generate recipes
	writeRecipes(block, "slabs", baseBlock, modID)
	if (shouldGenerateStonecutterRecipes === true) {
		writeStonecutterRecipes(block, baseBlock, 2)
	}
}

function writePlates(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	const plateBlockState = stateHelper.genPressurePlates(block, namespace)
	writeBlockstate(block, plateBlockState)
	modelWriter.writePressurePlates(block, altNamespace, baseBlock)
	writeBlockItemModel(block, namespace, namespace)
	generateBlockLang(block)
	writeLootTables(block)

	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_pressure_plates", true)
		tagHelper.checkAndAddStainedTag(block, baseBlock)
	}
	else {
		tagHelper.tagBlock(block, "minecraft:pressure_plates", true)
	}
	
	writeRecipes(block, "plates", baseBlock)
}

function writeButtons(block, namespace, baseBlock, altNamespace, type) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	if (type == undefined) {
		type = "buttons"
	}
	let buttonBlockState = stateHelper.genButtons(block, namespace, baseBlock)
	writeBlockstate(block, buttonBlockState)
	modelWriter.writeButtons(block, altNamespace, baseBlock)
	writeInventoryModel(block)
	generateBlockLang(block)
	writeLootTables(block)

	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_buttons", true)
	}
	else {
		tagHelper.tagBoth(block, "metal_buttons", true)
	}
	
	writeRecipes(block, type, baseBlock, namespace, altNamespace)
}

function writeFences(block, namespace, baseBlock) {
	fenceBlockState = stateHelper.genFences(block, namespace, baseBlock)
	writeBlockstate(block, fenceBlockState)
	modelWriter.writeFences(block, baseBlock, namespace)
	writeInventoryModel(block)
	writeLootTables(block)

	tagHelper.tagBoth(block, "fences")
	if (baseBlock.includes("planks")) {
		tagHelper.tagBoth(block, "minecraft:wooden_fences", true)
	}

	writeRecipes(block, "fences", baseBlock, namespace)
}

function writeFenceGates(block, namespace, baseBlock, altNamespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	fenceGateBlockState = stateHelper.genFenceGates(block, namespace)
	writeBlockstate(block, fenceGateBlockState, namespace, baseBlock)
	modelWriter.writeFenceGates(block, altNamespace, baseBlock, altNamespace)
	writeBlockItemModel(block, namespace, altNamespace)
	generateBlockLang(block)
	writeLootTables(block)

	// Tag Fence Gates
	tagHelper.tagBoth(block, "minecraft:fence_gates", true)
	if (baseBlock.includes("planks")) {
		tagHelper.tagBlock(block, "minecraft:mineable/axe", true)
	}
	else {
		tagHelper.tagBlock(block, "minecraft:mineable/pickaxe", true)
	}

	writeRecipes(block, "fence_gates", baseBlock, namespace)
}

function writeWallGates(block, namespace, baseBlock, altNamespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	const fenceGateBlockState = stateHelper.genFenceGates(block, namespace, altNamespace)
	writeBlockstate(block, fenceGateBlockState, modID, altNamespace)
	modelWriter.writeWallGates(block, altNamespace, baseBlock, altNamespace)
	generateBlockLang(block)
	writeLootTables(block, undefined, undefined, altNamespace)
	writeBlockItemModel(block, modID, altNamespace)
	let optionality = false;
	if ((altNamespace != mc) && (altNamespace != modID)) {
		optionality = true;
	}
	tagHelper.tagBoth(block, "wall_gates", optionality)

	writeRecipes(block, "wall_gates", baseBlock, namespace, altNamespace)
	writeStonecutterRecipes(block, baseBlock, 1)

}

function writeCarpet(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	if (namespace === undefined) {
		namespace = modID
	}
	writeBlockstate(block, stateHelper.genCarpet(block, namespace, baseBlock), modID)
	modelWriter.writeCarpets(block, altNamespace, baseBlock)
	writeBlockItemModel(block, namespace)
	generateBlockLang(block)
	writeLootTables(block)
	if (baseBlock.search("_top") !== -1) {
		baseBlock = baseBlock.split("_top")[0]
	}

	//Tags
	if (baseBlock.includes("wool")) {
		tagHelper.tagBoth(block, "minecraft:wool_carpets")
	}
	else {
		tagHelper.tagBlock(block, "carpet")
	}
	
	// Recipes
	writeRecipes(block, "carpet", baseBlock, namespace, altNamespace)
}

function getDyeIngredient(dye) {
	switch (dye) {
		case "glow_dye":
			return "minecraft:glow_ink_sac"
		case "dragon_dye":
			return "minecraft:dragon_breath"
		case "star_dye":
			return "minecraft:nether_star"
		case "honey_dye":
			return "minecraft:honeycomb"
		case "rose_dye":
			return ["minecraft:red_dye", "minecraft:pink_dye"]
		case "nostalgia_dye":
			return "minecraft:apple"
		case "poisonous_dye":
			return "minecraft:poisonous_potato"
	}
}

function versionAbove(version) {
	const localMajor = parseInt(version.split(".")[1])
	const localMinor = parseInt(version.split(".")[2])

	if ((localMajor > majorVersion) || (majorVersion == localMajor) && (minorVersion >= localMinor)) {
		return true;
	}
	else {
		return false;
	}

}

function populateTemplates() {
	const templatePath = "./overrides/models/templates/"
	const templates = fs.readdirSync(templatePath)
	templates.forEach(function(template) {
		writeFileSafe(`${helpers.modelPath}${template}`, readFile(templatePath + template))
	})
}