const { create } = require('domain');
const fs = require('fs');
const { basename } = require('path');

const globalNamespace = "pyrite";
const vanillaNamespace = "minecraft";
const mcVersion = "1.21.1";
const majorVersion = parseInt(mcVersion.split(".")[1]);
const minorVersion = parseInt(mcVersion.split(".")[2]);

const vanillaDyes = [
	"white",
	"orange",
	"magenta",
	"light_blue",
	"yellow",
	"lime",
	"pink",
	"gray",
	"light_gray",
	"cyan",
	"purple",
	"blue",
	"brown",
	"green",
	"red",
	"black"
]

const modDyes = [
	"glow",
	"dragon",
	"star",
	"honey",
	"nostalgia",
	"rose",
	"poisonous",
]

const dyes = vanillaDyes.concat(modDyes)

const vanillaWood = [
	"spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "bamboo", "crimson", "warped"
]

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

const trickyTrialsWalls = [
	"polished_tuff",
	"tuff_brick",
	"tuff"

];

const winterDropWalls = [
	"resin_brick"
];

const winterDropWoods = [
	"pale_oak"
];

const cut = [
	"iron",
	"gold",
	"emerald",
	"diamond",
	"netherite",
	"quartz",
	"amethyst",
	"lapis",
	"redstone",
	"copper",
	"exposed_copper",
	"weathered_copper",
	"oxidized_copper"
]

namespace = globalNamespace

//Base path
paths = {
	//new
	origin: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/`,
	cavesp2: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.18)/src/main/resources/`,
	wild: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.19)/src/main/resources/`,
	trailstales: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.21)/common/src/main/resources`,
	trailstales5: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.20.5)/src/main/resources/`,
	infinite: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (20w14infinite)/src/main/resources/`,





	//legacy
	base: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.21)/common/src/main/resources/`,
	infiniteModels: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (20w14infinite)/src/main/resources/assets/pyrite/models/block/`,
	infiniteBlockstates: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (20w14infinite)/src/main/resources/assets/pyrite/blockstates/`,

}



//Assets and legacy path
paths = Object.assign(paths, {
	//Legacy
	base: paths.trailstales,
	infiniteModels: `${paths.infinite}assets/pyrite/models/block/`,
	infiniteBlockstates: `${paths.infinite}assets/pyrite/blockstates/`,
	//Assets
	assets: `${paths.trailstales}/assets/pyrite/`,
	data: `${paths.trailstales}/data/pyrite/`,
	mcdata: `${paths.trailstales}/data/minecraft/`
})
//Blockstates and models
paths = Object.assign(paths, { blockstates: `${paths.assets}/blockstates/`, models: `${paths.assets}/models/block/`, itemModels: `${paths.assets}/models/item/` })
//Namespace data and Minecraft data folders
paths = Object.assign(paths, { data: `${paths.base}/data/pyrite/`, mcdata: `${paths.base}/data/minecraft/` })
//Tags
paths = Object.assign(paths, {
	blockstates: `${paths.assets}/blockstates/`,
	models: `${paths.assets}/models/block/`,
	itemModels: `${paths.assets}/models/item/`,
	tags: `${paths.data}/tags/`,
	mctags: `${paths.mcdata}/tags/`,

})

if (majorVersion >= 20) {
	paths = Object.assign(paths, {
		loot: `${paths.data}loot_tables/blocks/`,
		recipes: `${paths.data}/recipes/`
	})
}

if (majorVersion <= 21) {
	paths = Object.assign(paths, {
		loot: `${paths.data}loot_table/blocks/`,
		recipes: `${paths.data}/recipe/`
	})
}

let blockIDs = []
let blockTranslations = JSON.parse(fs.readFileSync("./overrides/lang/en_us.json"))

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

		let stonelike;
		if ((material === "stone") || (material.includes("brick"))) {
			stonelike = true;
		}
		else {
			stonelike = false;
		}

		//Generate block state
		if (blockType === "block") {
			writeBlock(this.blockID, this.namespace, special, this.baseBlock, undefined, undefined, undefined, stonelike)
		}
		else if (blockType === "slab") {
			writeSlabsV2(id(this.namespace, this.blockID), id(this.baseNamespace, this.baseBlock), undefined, stonelike)
		}
		else if (blockType === "stairs") {
			writeStairsV2(id(this.namespace, this.blockID), id(this.baseNamespace, this.baseBlock), undefined, stonelike)
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
		else if (blockType === "door") {
			writeDoors(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
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
			writePaneBlock(this.blockID, this.namespace, this.baseBlock)
		}
		else if (blockType === "pressure_plate") {
			writePlates(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
		}
		else {
			writeBlock(this.blockID, this.namespace, this.blockType, this.baseBlock)
		}


		//Generate block loot table
		if (blockType === "door") {
			writeDoorLootTables(this.blockID, this.namespace)

		}
		else {
			writeLootTables(this.blockID, this.namespace)

		}

		//Generate recipes
		// writeRecipes(this.blockID, this.blockType, this.baseBlock, this.namespace, this.baseNamespace)



	}
	generateFullID() {
		console.log(`${this.namespace}:${this.blockID}`)
	}
	addTranslation() {
		return generateLangObject(this.blockID, "block", this.namespace)
	}
}


let tags = "";
function generateResources() {

	new Block("torch_lever", globalNamespace, vanillaNamespace, "torch_lever", "torch", "torch")
	new Block("redstone_torch_lever", globalNamespace, vanillaNamespace, "torch_lever", "redstone_torch", "torch")
	new Block("soul_torch_lever", globalNamespace, vanillaNamespace, "torch_lever", "soul_torch", "torch")



	function generateWoodSet(template) {
		const stainedPlankBase = template + "_planks"

		new Block(template + "_button", globalNamespace, globalNamespace, "button", stainedPlankBase, "wood")
		new Block(template + "_stairs", globalNamespace, globalNamespace, "stairs", stainedPlankBase, "wood")
		new Block(template + "_slab", globalNamespace, globalNamespace, "slab", stainedPlankBase, "wood")
		new Block(template + "_pressure_plate", globalNamespace, undefined, "pressure_plate", stainedPlankBase, "wood")
		new Block(template + "_fence", globalNamespace, globalNamespace, "fence", stainedPlankBase, "wood")
		new Block(template + "_fence_gate", globalNamespace, globalNamespace, "fence_gate", stainedPlankBase, "wood")
		new Block(template + "_planks", globalNamespace, globalNamespace, "planks", template, "wood")
		new Block(template + "_crafting_table", globalNamespace, undefined, "crafting_table", stainedPlankBase, "wood")
		new Block(template + "_ladder", globalNamespace, globalNamespace, "ladder", stainedPlankBase, "wood")
		// chest = new Block(template + "_chest", globalNamespace, globalNamespace, "chest", stainedPlankBase, "wood")
		new Block(template + "_door", globalNamespace, globalNamespace, "door", stainedPlankBase, "wood")
		new Block(template + "_trapdoor", globalNamespace, globalNamespace, "trapdoor", stainedPlankBase, "wood")
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
		new Block(bricksBase, globalNamespace, undefined, type, baseBlock, type)
		new Block(brickBase + "_slab", globalNamespace, undefined, "slab", bricksBase, type)
		new Block(brickBase + "_stairs", globalNamespace, undefined, "stairs", bricksBase, type)
		new Block(brickBase + "_wall", globalNamespace, undefined, "wall", bricksBase, type)
		new Block(brickBase + "_wall_gate", globalNamespace, undefined, "wall_gate", bricksBase, type)

	}

	function generateTurfSet(template, type, baseNamespace, texture) {
		let turfBase = template;
		if (type === undefined) {
			type = "turf"
		}

		new Block(turfBase + "_turf", globalNamespace, baseNamespace, type, texture, type)
		new Block(turfBase + "_slab", globalNamespace, baseNamespace, "slab", texture, type)
		new Block(turfBase + "_stairs", globalNamespace, baseNamespace, "stairs", texture, type)
	}

	function writeWallGatesFromArray(array, namespace) {
		if (namespace == undefined) {
			namespace = vanillaNamespace;
		}
		array.forEach(function (wall) {
			let blockTemplate = wall.replace("_wall", "")
			let baseBlock = blockTemplate
			baseBlock = `${baseBlock.replace("brick", "bricks")}`
			baseBlock = `${baseBlock.replace("tile", "tiles")}`
			new Block(blockTemplate + "_wall_gate", globalNamespace, namespace, "wall_gate", id(vanillaNamespace, baseBlock), "stone")
		})
	}

	function writeCraftingTablesFromArray(woodArray, namespace) {
		if (namespace == undefined) {
			namespace = vanillaNamespace
		}
		woodArray.forEach(function (dye) {
			const template = dye
			const plankBase = template + "_planks"
			writeCraftingTableBlock(template + "_crafting_table", globalNamespace, plankBase, namespace)
		})
	}

	dyes.forEach(function (dye) {
		let stainedBlockTemplate = dye + "_stained"
		generateWoodSet(stainedBlockTemplate)
		generateBrickSet(dye)
		generateBrickSet(dye + "_terracotta_bricks", "terracotta_bricks", `${getDyeNamespace(dye)}:${dye}_terracotta`)

		// Lamps
		lamp = new Block(dye + "_lamp", globalNamespace, undefined, "lamp", dye, "lamp")
		//Torches
		torch = new Block(dye + "_torch", globalNamespace, undefined, "torch", dye, "torch")
		//Torch Levers
		torch_lever = new Block(dye + "_torch_lever", globalNamespace, globalNamespace, "torch_lever", dye, "torch")
		//Framed Glass
		new Block(dye + "_framed_glass", globalNamespace, undefined, "stained_framed_glass", dye, "stained_framed_glass")
		//Framed Glass Panes
		new Block(dye + "_framed_glass_pane", globalNamespace, undefined, "stained_framed_glass_pane", dye, "stained_framed_glass_pane")
	})

	writeCraftingTablesFromArray(vanillaWood, vanillaNamespace)
	if (versionAbove("1.21.4")) {
		writeCraftingTablesFromArray(winterDropWoods, vanillaNamespace)
	}

	const shroomBlockTemplate = "_mushroom"
	const redShroom = "red" + shroomBlockTemplate
	const brownShroom = "brown" + shroomBlockTemplate
	generateWoodSet(redShroom)
	red_stem = new Block(redShroom + "_stem", globalNamespace, undefined, "mushroom_stem", redShroom + "_planks", "wood")
	generateWoodSet(brownShroom)
	brown_stem = new Block(brownShroom + "_stem", globalNamespace, undefined, "mushroom_stem", redShroom + "_planks", "wood")


	generateBrickSet("cobblestone_bricks", "cobblestone_bricks", "minecraft:cobblestone")
	generateBrickSet("mossy_cobblestone_bricks", "mossy_cobblestone_bricks")
	generateBrickSet("smooth_stone_bricks", "smooth_stone_bricks", "minecraft:smooth_stone")


	writeBlock("nostalgia_cobblestone", globalNamespace, "nostalgia_cobblestone", "nostalgia_cobblestone")
	writeBlock("nostalgia_mossy_cobblestone", globalNamespace, "nostalgia_mossy_cobblestone", "nostalgia_mossy_cobblestone")
	writeBlock("nostalgia_netherrack", globalNamespace, "nostalgia_netherrack", "nostalgia_netherrack")
	writeBlock("nostalgia_gravel", globalNamespace, "nostalgia_gravel", "nostalgia_gravel")
	writeBlock("nostalgia_gravel", globalNamespace, "nostalgia_gravel", "nostalgia_gravel")
	writeBlock("nostalgia_grass_block", globalNamespace, "nostalgia_grass_block", "nostalgia_grass_block")

	//Framed Glass
	new Block("framed_glass", globalNamespace, undefined, "framed_glass", "framed_glass", "framed_glass")
	// Framed Glass Panes
	writePaneBlock("framed_glass_pane", globalNamespace, "framed_glass")
	// new Block("framed_glass_pane", globalNamespace, undefined, "framed_glass_pane", "framed_glass_pane", "framed_glass_pane")

	// Nostalgia Turf Set
	writeBlock("nostalgia_grass_turf", globalNamespace, "nostalgia_grass_turf", id(globalNamespace, "nostalgia_grass_block"), undefined, globalNamespace, "pyrite:nostalgia_grass_block_top")
	writeSlabsV2("nostalgia_grass_slab", "nostalgia_grass_turf", "nostalgia_grass_block_top")
	writeStairsV2("nostalgia_grass_stairs", "nostalgia_grass_turf", "nostalgia_grass_block_top")
	writeCarpet("nostalgia_grass_carpet", globalNamespace, "nostalgia_grass_block_top", namespace)

	// Podzol Turf Set
	writeBlock("podzol_turf", globalNamespace, "podzol_turf", id(vanillaNamespace, "podzol"), undefined, vanillaNamespace, "minecraft:podzol_top")
	writeSlabsV2("podzol_slab", "podzol_turf", "minecraft:podzol_top")
	writeStairsV2("podzol_stairs", "podzol_turf", "minecraft:podzol_top")
	writeCarpet("podzol_carpet", globalNamespace, "podzol_top", vanillaNamespace)

	// Grass Turf Set
	writeBlock("grass_turf", globalNamespace, "grass_turf", id(vanillaNamespace,"grass_block"), undefined, vanillaNamespace, "minecraft:grass_block_top")
	writeSlabsV2("grass_slab", "grass_turf", "minecraft:grass_block_top")
	writeStairsV2("grass_stairs", "grass_turf", "minecraft:grass_block_top")
	writeCarpet("grass_carpet", globalNamespace, "minecraft:grass_block_top", vanillaNamespace)

	// Mycelium Turf Set
	writeBlock("mycelium_turf", globalNamespace, "mycelium_turf", id(vanillaNamespace,"mycelium"), undefined, vanillaNamespace, "minecraft:mycelium_top")
	writeSlabsV2("mycelium_slab", "mycelium_turf", "minecraft:mycelium_top")
	writeStairsV2("mycelium_stairs", "mycelium_turf", "minecraft:mycelium_top")
	writeCarpet("mycelium_carpet", globalNamespace, "mycelium_top", vanillaNamespace)

	// Path Turf Set
	writeBlock("path_turf", globalNamespace, "path_turf", id(vanillaNamespace,"dirt_path"), undefined, vanillaNamespace, "minecraft:dirt_path_top")
	writeSlabsV2("path_slab", "path_turf", "minecraft:dirt_path_top")
	writeStairsV2("path_stairs", "path_turf", "minecraft:dirt_path_top")
	writeCarpet("path_carpet", globalNamespace, "dirt_path_top", vanillaNamespace)

	// Pyrite Dyes, Wool, Carpet, Terracotta
	modDyes.forEach(function (dye) {
		writeDye(dye, dye, globalNamespace)
		writeWool(dye, dye, globalNamespace)
		writeCarpet(dye + "_carpet", globalNamespace, dye + "_wool")
		writeTerracotta(dye, dye, globalNamespace)
	})

	// Lamps
	writeLamps("glowstone_lamp", "glowstone")
	writeLamps("lit_redstone_lamp", "lit_redstone", "minecraft:redstone_lamp_on")

	// April Fools Blocks
	writeBlock("glowing_obsidian", globalNamespace, "glowing_obsidian", "glowing_obsidian")
	writeBlock("nostalgia_glowing_obsidian", globalNamespace, "glowing_obsidian", "glowing_obsidian")
	writeBlock("locked_chest", globalNamespace, "locked_chest", "locked_chest")

	// Nether Brick Sets
	generateBrickSet("charred_nether_bricks", "charred_nether_bricks")
	generateBrickSet("blue_nether_bricks", "blue_nether_bricks")

	// 1.20 and below walls
	writeWallGatesFromArray(vanillaWalls)

	// 1.21 - Tricky Trials Tuff walls
	if (majorVersion >= 21) {
		writeWallGatesFromArray(trickyTrialsWalls)
	}

	// 1.21.4 - Winter Drop Resin walls
	if (majorVersion > 22 || (mcVersion == "1.21.4")) {
		writeWallGatesFromArray(winterDropWalls)
	}

	cut.forEach(function (block) {
		let baseBlock = block
		let altNamespace;
		let cutBlockID = `cut_${block}`
		let baseTexture = block + "_block";
		// Overrides for Copper blocks.
		if (block === "copper" || block === "exposed_copper" || block === "oxidized_copper" || block === "weathered_copper") {
			baseTexture = block;
			altNamespace = vanillaNamespace
			// Vanilla swaps Cut and Oxidization state
			cutBlockID = cutBlockID.replace("cut_weathered", "weathered_cut")
			cutBlockID = cutBlockID.replace("cut_oxidized", "oxidized_cut")
			cutBlockID = cutBlockID.replace("cut_exposed", "exposed_cut")
		}
		else {
			baseBlock = baseTexture;
			altNamespace = globalNamespace
			writeBlock(cutBlockID, globalNamespace, cutBlockID, id(vanillaNamespace, baseBlock), undefined, undefined, cutBlockID, true)
			// writeBlock(cutBlockID, globalNamespace, cutBlockID, cutBlockID, undefined, undefined, undefined, true)
			writeSlabs(`${cutBlockID}_slab`, globalNamespace, cutBlockID, undefined, true)
			writeStairs(`${cutBlockID}_stairs`, globalNamespace, cutBlockID, undefined, true)
		}

		writeWalls(`cut_${block}_wall`, globalNamespace, id(altNamespace, cutBlockID))
		writeWallGates(`cut_${block}_wall_gate`, globalNamespace, id(altNamespace, cutBlockID), globalNamespace)

		// Overrides for Quartz Blocks
		if (block === "quartz") {
			baseTexture = baseBlock + "_top"
			// Vanilla uses quartz's bottom texture instead of a dedicated smooth texture.
			writeWalls(`smooth_${block}_wall`, globalNamespace, `minecraft:quartz_block_bottom`)
			writeWallGates(`smooth_${block}_wall_gate`, globalNamespace, `minecraft:quartz_block_bottom`, globalNamespace)
		}
		else {
			writeBlock(`smooth_${block}`, globalNamespace, "smooth_resource", baseBlock, undefined, undefined, undefined, true)
			writeSlabs(`smooth_${block}_slab`, globalNamespace, `smooth_${block}`, undefined, true)
			writeStairs(`smooth_${block}_stairs`, globalNamespace, `smooth_${block}`, undefined, true)
			writeWalls(`smooth_${block}_wall`, globalNamespace, `smooth_${block}`)
			writeWallGates(`smooth_${block}_wall_gate`, globalNamespace, `smooth_${block}`, globalNamespace)
			writeBlock(block + "_bricks", globalNamespace, "resource_bricks", id(altNamespace, cutBlockID), undefined, globalNamespace, undefined, true)
			writeChiseledBlock(`${block}_pillar`, baseBlock, globalNamespace, "resource_pillar")
		}

		// Iron Bars already exist
		if (!block.includes("iron")) {
			writeBarBlock(block, globalNamespace, baseBlock)
		}
		// Copper Doors and Trapdoors should be generated only if version is 1.20 or below.
		if (block.includes("copper")) {
			if (majorVersion < 21) {
				writeChiseledBlock(`chiseled_${block}_block`, baseBlock, globalNamespace, "chiseled_resource")
				writeDoors(`${block}_door`, globalNamespace, id(vanillaNamespace, baseBlock))
				writeTrapdoors(`${block}_trapdoor`, globalNamespace, id(vanillaNamespace, baseBlock))
			}
		}
		else {
			if (!block.includes("quartz")) {
				writeChiseledBlock(`chiseled_${block}_block`, baseBlock, globalNamespace, "chiseled_resource")
			}
			if (!block.includes("iron")) {
				writeDoors(`${block}_door`, globalNamespace, id(vanillaNamespace, baseBlock))
				writeTrapdoors(`${block}_trapdoor`, globalNamespace, id(vanillaNamespace, baseBlock))
			}
		}

		writeBlock(`nostalgia_${block}_block`, globalNamespace, "nostalgia", baseBlock)

		// Unoxidized Copper Blocks use `copper_block` as their texture ID
		if (block === "copper") {
			baseTexture = baseBlock + "_block";
		}
		writeButtons(block + "_button", globalNamespace, id(vanillaNamespace, baseTexture), vanillaNamespace, "metal_buttons")
		// Iron and Gold Pressure Plates already exist.
		if (!((block === "gold") || (block === "iron"))) {
			writePlates(block + "_pressure_plate", globalNamespace, id(vanillaNamespace, baseTexture), vanillaNamespace)
		}

	})

	writeFlower("rose", globalNamespace)
	writeFlower("blue_rose", globalNamespace)
	writeFlower("orange_rose", globalNamespace)
	writeFlower("white_rose", globalNamespace)
	writeFlower("pink_rose", globalNamespace)
	writeFlower("paeonia", globalNamespace)
	writeFlower("pink_daisy", globalNamespace)
	writeFlower("buttercup", globalNamespace)


	// writeStonecutterRecipes(`${block}_button`, "block", baseBlock, globalNamespace, vanillaNamespace)

	writeFenceGates("nether_brick_fence_gate", globalNamespace, id(vanillaNamespace, "nether_bricks"), vanillaNamespace)
	writeFlower("rose", globalNamespace)
	writeFlower("blue_rose", globalNamespace)
	writeFlower("orange_rose", globalNamespace)
	writeFlower("white_rose", globalNamespace)
	writeFlower("pink_rose", globalNamespace)
	writeFlower("paeonia", globalNamespace)
	writeFlower("pink_daisy", globalNamespace)
	writeFlower("buttercup", globalNamespace)

	writeLang()
}



generateResources()

function tagContent(arg, tag, folder) {
	// Ensure all IDs are properly namespaced strings
	if (!arg.includes(":")) {
		arg = id(globalNamespace, arg)
	}
	let namespace;
	if (tag.includes(":")) {
		namespace = tag.split(":")[0];
		tag = tag.split(":")[1];
	}
	else {
		namespace = globalNamespace;
	}
	
	// Create path to tag file.
	let dir = `${paths.base}/data/${namespace}/tags/${folder}/`
	if (tag.includes("/")) {
		dir += tag.split("/")[0];
		tag = tag.split("/")[1];
	}
	let path = `${dir}/${tag}.json`
	// Ensure tag folder exists
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {recursive: true})
	}
	// Ensure tag file exists
	if (!fs.existsSync(path)) {
		// If not, create an empty tag.
		fs.writeFileSync(path, JSON.stringify({"replace": false,"values": []}), function (err) { if (err) throw err; })
	}
	// Read the tag file.
	const currentTag = readFileAsJson(path)
	// Check if the namespaced string is already in the tag.
	if (!currentTag.values.includes(arg)) {
		// If not, add it to the tag.
		currentTag.values.push(arg)
		// Write new tag file to disk.
		fs.writeFileSync(path, JSON.stringify(currentTag))
	}

}

function tagBlock(block, tag) {
	tagContent(block, tag, "block")

}

function tagItem(item, tag, folder) {
	tagContent(item, tag, "item")
}

function writeLang() {
	writeFile(`${paths.assets}lang/en_us.json`, JSON.stringify(blockTranslations, undefined, " "))

}

function writeFile(path, data) {
	const demoMode = false
	if (data instanceof Object) {
		data = JSON.stringify(data)
	}
	else {
		try {
			data = JSON.parse(data)
			data = JSON.stringify(data)
		}
		catch { }

	}
	if (demoMode === false) {
		fs.writeFile(path, data, function (err) { if (err) throw err; })
	}
}

function readFile(path) {
	return fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })
}

function readFileAsJson(path) {
	return JSON.parse(readFile(path))
}

function writeBlockstate(block, blockState, namespace) {
	writeFile(`${paths.blockstates}${block}.json`, blockState)
}

function writeOldBlockstate(block, blockState, namespace) {
	writeFile(`${paths.infiniteBlockstates}${block}.json`, blockState)
}

function writePlankBlockModels(block, namespace, texture, model, render_type) {
	let blockModel = generateBlockModel(block, namespace, texture, model, render_type)
	writeFile(`${paths.models}${block}.json`, blockModel)
}

function writeMirroredBricksBlockModels(block, namespace, baseBlock) {
	writeFile(`${paths.models}${block}.json`, generateBlockModel(block, namespace, baseBlock))
	writeFile(`${paths.models}${block}_north_west_mirrored.json`, generateBlockModel(block, namespace, baseBlock, "minecraft:block/cube_north_west_mirrored_all"))

}

function writeCraftingTableBlockModels(block, namespace, baseBlock, altNamespace) {
	blockModel = generateCraftingTableBlockModel(block, namespace, baseBlock, altNamespace)
	writeFile(`${paths.models}${block}.json`, blockModel, function (err) {
		if (err) throw err;

	});
}

function writeLeverBlockModels(block, namespace, baseBlock, altNamespace) {
	if (altNamespace == vanillaNamespace) {
		writeFile(`${paths.models}${block}_upright.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "upright"))

	}
	altNamespace = getAltNamespace(namespace, altNamespace)
	writeFile(`${paths.models}${block}.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace))
	writeFile(`${paths.models}${block}_on.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "on"))
	writeFile(`${paths.models}${block}_wall.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "wall"))


}

function writeTorchBlockModels(block, namespace, baseBlock, altNamespace) {
	altNamespace = getAltNamespace(namespace, altNamespace)
	writeFile(`${paths.models}${baseBlock}_upright.json`, generateTorchBlockModel(block, namespace, baseBlock, altNamespace, "template_torch"))
	writeFile(`${paths.models}${block}_wall.json`, generateTorchBlockModel(block, namespace, baseBlock, altNamespace, "template_torch_wall"))


}




function writeCubeColumnBlockModels(block, namespace, baseBlock) {
	writeFile(`${paths.models}${block}.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column"))
	writeFile(`${paths.models}${block}_horizontal.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column_horizontal"))

}

function writeFlowerBlockModels(block, namespace) {
	writeFile(`${paths.models}${block}.json`, generateFlowerBlockModel(block, namespace))

}



function writeLogBlockModels(block, namespace, baseBlock) {
	writeFile(`${paths.models}${block}.json`, generateLogModel(block, namespace, baseBlock, "cube_column"))
	writeFile(`${paths.models}${block}_horizontal.json`, generateLogModel(block, namespace, baseBlock, "cube_column_horizontal"))

}

function generateLang(block, type, namespace) {
	if (type === undefined) {
		type = "block"
	}
	let langBlock = block
	langBlock = langBlock.replaceAll("_", " ")
	langBlock = langBlock.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(); });
	return `"${type}.${namespace}.${block}": "${langBlock}",`

}

function generateLangObject(block, type, namespace) {
	if (type === undefined) {
		type = "block";
	}
	let langBlock = block;
	langBlock = langBlock.replaceAll("_", " ");
	langBlock = langBlock.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(); });
	const key = `${type}.${namespace}.${block}`;
	const value = langBlock;
	if (!blockTranslations.hasOwnProperty(key)) {
		blockTranslations = Object.assign(blockTranslations, JSON.parse(`{"${key}": "${value}"}`));
	}
}

function generateBlockLangObject(block) {
	generateLangObject(block, "block", globalNamespace)
}

function generateWallBlockModel(block, namespace, baseBlock, parent) {
	return `{
	  "parent": "minecraft:block/${parent}",
	  "textures": {
		"wall": "${namespace}:block/${baseBlock}"
	  }
	}`
}

function writeWallBlockModels(block, namespace, baseBlock) {
	if (baseBlock.includes(":")) {
		namespace = baseBlock.split(":")[0]
		baseBlock = baseBlock.split(":")[1]
	}
	postModel = generateWallBlockModel(block, namespace, baseBlock, "template_wall_post")
	sideModel = generateWallBlockModel(block, namespace, baseBlock, "template_wall_side")
	invModel = generateWallBlockModel(block, namespace, baseBlock, "wall_inventory")
	tallModel = generateWallBlockModel(block, namespace, baseBlock, "template_wall_side_tall")

	writeFile(`${paths.models}${block}_post.json`, postModel)
	writeFile(`${paths.models}${block}_side.json`, sideModel)
	writeFile(`${paths.models}${block}_inventory.json`, invModel)
	writeFile(`${paths.models}${block}_side_tall.json`, tallModel)
}


function writePaneBlockModels(block, namespace, baseBlock) {
	writeFile(`${paths.models}${block}_post.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_post"))
	writeFile(`${paths.models}${block}_side.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_side"))
	writeFile(`${paths.models}${block}_noside.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_noside"))
	writeFile(`${paths.models}${block}_side_alt.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_side_alt"))
	writeFile(`${paths.models}${block}_noside_alt.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_noside_alt"))
}

function generatePaneBlockModels(block, namespace, baseBlock, model) {
	let edge;
	if (block.includes("bars")) {
		edge = baseBlock
	}
	else {
		edge = "framed_glass_pane_top"
	}
	return `{
	"parent": "minecraft:block/${model}",
	"textures": {
	  "pane": "${namespace}:block/${baseBlock}",
	  "edge": "${namespace}:block/${edge}"
	},
	"render_type": "translucent"
  }`
}

function generateStairBlockModel(block, namespace, baseBlock, model) {
	if (baseBlock === "grass_block_top") {
		if (model === "stairs") {
			return readFile("./overrides/models/grass_stairs.json")
		}
		else if (model === "inner_stairs") {
			return readFile("./overrides/models/grass_stairs_inner.json")
		}
		else if (model === "outer_stairs") {
			return readFile("./overrides/models/grass_stairs_outer.json")
		}
	}
	return `{
	"parent": "minecraft:block/${model}",
	"textures": {
	  "bottom": "${namespace}:block/${baseBlock}",
	  "top": "${namespace}:block/${baseBlock}",
	  "side": "${namespace}:block/${baseBlock}"
	}
  }`
}

function writeStairBlockModels(block, namespace, baseBlock) {
	if (baseBlock.includes(":")) {
		namespace = baseBlock.split(":")[0]
		baseBlock = baseBlock.split(":")[1]
	}
	writeFile(`${paths.models}${block}.json`, generateStairBlockModel(block, namespace, baseBlock, "stairs"));
	writeFile(`${paths.models}${block}_inner.json`, generateStairBlockModel(block, namespace, baseBlock, "inner_stairs"));
	writeFile(`${paths.models}${block}_outer.json`, generateStairBlockModel(block, namespace, baseBlock, "outer_stairs"));
}

function writeButtonBlockModels(block, namespace, baseBlock) {
	if (namespace == undefined) {
		namespace = globalNamespace
	}
	if (baseBlock.includes(":")) {
		namespace = baseBlock.split(":")[0]
		baseBlock = baseBlock.split(":")[1]
	}
	buttonModel = `{
		"parent": "minecraft:block/button",
		"textures": {
		  "texture": "${namespace}:block/${baseBlock}"
		}
	  }`
	buttonModelInventory = `{
		"parent": "minecraft:block/button_inventory",
		"textures": {
			"texture": "${namespace}:block/${baseBlock}"
		}
	  }`
	buttonModelPressed = `{
		"parent": "minecraft:block/button_pressed",
		"textures": {
			"texture": "${namespace}:block/${baseBlock}"
		}
	  }`
	writeFile(`${paths.models}${block}.json`, buttonModel)
	writeFile(`${paths.models}${block}_inventory.json`, buttonModelInventory);
	writeFile(`${paths.models}${block}_pressed.json`, buttonModelPressed);
}

function generateSlabBlockModel(block, namespace, baseBlock, model) {
	if (baseBlock === "grass_block_top") {
		if (model === "slab") {
			return readFile("./overrides/models/grass_slab.json")
		}
		else if (model === "slab_top") {
			return readFile("./overrides/models/grass_slab_top.json")
		}
	}
	return `{
		"parent": "minecraft:block/${model}",
		"textures": {
		"bottom": "${namespace}:block/${baseBlock}",
		"top": "${namespace}:block/${baseBlock}",
		"side": "${namespace}:block/${baseBlock}"
		}
	}`

}

function writeSlabBlockModels(block, namespace, baseBlock) {
	if (baseBlock.includes(":")) {
		namespace = baseBlock.split(":")[0]
		baseBlock = baseBlock.split(":")[1]
	}
	writeFile(`${paths.models}${block}.json`, generateSlabBlockModel(block, namespace, baseBlock, "slab"));
	writeFile(`${paths.models}${block}_top.json`, generateSlabBlockModel(block, namespace, baseBlock, "slab_top"));
}

function writePlateBlockModels(block, namespace, baseBlock) {
	if (baseBlock.includes(":")) {
		namespace = baseBlock.split(":")[0]
		baseBlock = baseBlock.split(":")[1]
	}
	plateModel = `{
		"parent": "minecraft:block/pressure_plate_up",
		"textures": {
		  "texture": "${namespace}:block/${baseBlock}"
		}
	  }`
	plateModelDown = `{
		"parent": "minecraft:block/pressure_plate_down",
		"textures": {
		  "texture": "${namespace}:block/${baseBlock}"
		}
	  }`

	writeFile(`${paths.models}${block}.json`, plateModel);
	writeFile(`${paths.models}${block}_down.json`, plateModelDown);
}

function generateFenceBlockModels(block, baseBlock, namespace, model) {
	return `{
  "parent": "minecraft:block/${model}",
  "textures": {
	"texture": "${namespace}:block/${baseBlock}"
  }
}`
}

function writeFenceBlockModels(block, baseBlock, namespace) {
	writeFile(`${paths.models}${block}_post.json`, generateFenceBlockModels(block, baseBlock, namespace, "fence_post"));
	writeFile(`${paths.models}${block}_side.json`, generateFenceBlockModels(block, baseBlock, namespace, "fence_side"));
	writeFile(`${paths.models}${block}_inventory.json`, generateFenceBlockModels(block, baseBlock, namespace, "fence_inventory"));
}

function generateFenceGateBlockModels(block, namespace, baseBlock, model, altNamespace) {
	return `{
	"parent": "${altNamespace}:block/${model}",
	"textures": {
	  "texture": "${namespace}:block/${baseBlock}"
	}
  }`
}

function writeFenceGateBlockModels(block, namespace, baseBlock) {
	if (baseBlock.includes(":")) {
		namespace = baseBlock.split(":")[0]
		baseBlock = baseBlock.split(":")[1]
	}
	writeFile(`${paths.models}${block}.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate", vanillaNamespace))
	writeFile(`${paths.models}${block}_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_open", vanillaNamespace))
	writeFile(`${paths.models}${block}_wall.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_wall", vanillaNamespace))
	writeFile(`${paths.models}${block}_wall_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_wall_open", vanillaNamespace))
}

function writeWallGateBlockModels(block, namespace, baseBlock) {
	if (baseBlock.includes(":")) {
		namespace = baseBlock.split(":")[0]
		baseBlock = baseBlock.split(":")[1]
	}
	writeFile(`${paths.models}${block}.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate", vanillaNamespace))
	writeFile(`${paths.models}${block}_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_open", vanillaNamespace))
	writeFile(`${paths.models}${block}_wall.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_wall_gate_wall", globalNamespace))
	writeFile(`${paths.models}${block}_wall_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_wall_gate_wall_open", globalNamespace))
}

function writeDoorBlockModels(block, namespace, baseBlock) {

	writeFile(`${paths.models}${block}_top_left.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_left"))
	writeFile(`${paths.models}${block}_top_right.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_right"))
	writeFile(`${paths.models}${block}_bottom_left.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_left"))
	writeFile(`${paths.models}${block}_bottom_right.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_right"))
	writeFile(`${paths.models}${block}_top_left_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_left_open"))
	writeFile(`${paths.models}${block}_top_right_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_right_open"))
	writeFile(`${paths.models}${block}_bottom_left_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_left_open"))
	writeFile(`${paths.models}${block}_bottom_right_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_right_open"))

	//INFINITE MODELS
	writeFile(`${paths.infiniteModels}${block}_top.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top"))
	writeFile(`${paths.infiniteModels}${block}_top_hinge.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_rh"))
	writeFile(`${paths.infiniteModels}${block}_bottom.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom"))
	writeFile(`${paths.infiniteModels}${block}_bottom_hinge.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_rh"))


}


function writeTrapdoorBlockModels(block, namespace, baseBlock) {

	writeFile(`${paths.models}${block}_top.json`, generateTrapdoorBlockModels(block, namespace, baseBlock, "template_orientable_trapdoor_top"));
	writeFile(`${paths.models}${block}_bottom.json`, generateTrapdoorBlockModels(block, namespace, baseBlock, "template_orientable_trapdoor_bottom"));
	writeFile(`${paths.models}${block}_open.json`, generateTrapdoorBlockModels(block, namespace, baseBlock, "template_orientable_trapdoor_open"));
}

function writeCarpetBlockModels(block, namespace, baseBlock) {
	let carpetModel = `{
	"parent": "minecraft:block/carpet",
	"textures": {
	  "wool": "${namespace}:block/${baseBlock}"
	}
  }`
	if (block === "grass_carpet") {
		carpetModel = `{
	  "parent": "minecraft:block/carpet",
	  "textures": {
		"wool": "minecraft:block/grass_block_top"
	  },
	  "elements": [
		{   "from": [ 0, 0, 0 ],
			"to": [ 16, 1, 16 ],
			"faces": {
			  "down":  { "uv": [ 0, 0, 16, 16 ], "texture": "#wool", "cullface": "down", "tintindex": 0  },
			  "up":	{ "uv": [ 0, 0, 16, 16 ], "texture": "#wool",	"cullface": "up", "tintindex": 0 },
			  "north": { "uv": [ 0, 0, 16, 16 ], "texture": "#wool",   "cullface": "north", "tintindex": 0  },
			  "south": { "uv": [ 0, 0, 16, 16 ], "texture": "#wool",   "cullface": "south", "tintindex": 0  },
			  "west":  { "uv": [ 0, 0, 16, 16 ], "texture": "#wool",   "cullface": "west", "tintindex": 0  },
			  "east":  { "uv": [ 0, 0, 16, 16 ], "texture": "#wool",   "cullface": "east", "tintindex": 0  }
	
			}
		}
	]
	}`
	}

	writeFile(`${paths.models}${block}.json`, carpetModel);
}



function writeBlockItemModel(block, namespace) {
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	if (versionAbove("1.21.4")) {
		writeWinterDropItem(namespace, "block", block)
		const modelItem =
		{
			"parent": "minecraft:item/generated",
			"textures": {
				"layer0": `${namespace}:block/${block}`
			}
		}
		writeFile(`${paths.itemModels}${block}.json`, modelItem);
	}
	else {
		const modelItem = `{
	  "parent": "${namespace}:block/${block}"
	}`
		writeFile(`${paths.itemModels}${block}.json`, modelItem);
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


function writeUniqueItemModel(block, namespace) {
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	if (versionAbove("1.21.4")) {
		writeWinterDropItem(namespace, "item", block, block)
	}
	else {
		let modelItem = `{
	  "parent": "minecraft:item/generated",
	  "textures": {
		"layer0": "${namespace}:item/${block}"
	  }
	}`
		writeFile(`${paths.itemModels}${block}.json`, modelItem);
	}
}

function writeUniqueBlockItemModel(block, namespace, altNamespace, baseBlock) {
	if (namespace === undefined) {
		namespace = globalNamespace
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
		const modelItem = `{
	  "parent": "minecraft:item/generated",
	  "textures": {
		"layer0": "${altNamespace}:block/${baseBlock}"
	  }
	}`
		writeFile(`${paths.itemModels}${block}.json`, modelItem)
	}

}


function writeInventoryModel(block, namespace) {
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	if (versionAbove("1.21.4")) {
		writeWinterDropItem(namespace, "block", block, `${block}_inventory`)
	}
	else {
		let modelItem = `{
	  "parent": "${namespace}:block/${block}_inventory"
	}`
		writeFile(`${paths.itemModels}${block}.json`, modelItem);
	}

}

function writePlanks(block, dye, namespace, baseBlock) {
	block = block + "_planks"
	writeBlock(block, dye, namespace, "planks", baseBlock)
}
function writeTerracotta(block, dye, namespace) {
	block = block + "_terracotta"
	writeBlock(block, namespace, "terracotta", dye)
}

function writeLamps(block, dye, texture) {
	writeBlock(block, globalNamespace, "lamps", dye, undefined, undefined, texture, false)
}

function writeWool(block, dye, namespace) {
	block = block + "_wool"
	writeBlock(block, namespace, "wool", dye)
}

function writeTerracottaBricks(block, namespace, special, baseBlock) {
	blockState = `{
	"variants": {
		"": {
			"model": "${namespace}:block/${block}_north_west_mirrored"
			}
		}
  	}`
	writeBlockstate(block, blockState, namespace)
	writeMirroredBricksBlockModels(block, namespace, block)
	writeBlockItemModel(block, namespace)
	createTags(block, namespace)
	writeRecipes(block, special, baseBlock, namespace)
	writeStonecutterRecipes(block, baseBlock, 1)
}

function writeDye(item, dye, namespace) {
	item = item + "_dye"
	writeItem(item, namespace, "dye")

}

function writeItem(item, namespace) {
	generateLangObject(item, "item", globalNamespace)
	writeUniqueItemModel(item, namespace)
}

function writeDoors(block, namespace, baseBlock) {
	doorBlockState = generateDoorBlockState(block, namespace, baseBlock)
	writeBlockstate(block, doorBlockState, namespace)
	writeOldBlockstate(block, generateOldDoorBlockState(block, namespace, baseBlock), namespace)
	writeDoorBlockModels(block, namespace)
	writeUniqueItemModel(block, namespace)
	createTags(block, namespace)
	generateBlockLangObject(block)
	writeRecipes(block, "door", baseBlock)
}

function writeTrapdoors(block, namespace, baseBlock) {
	let doorBlockState = generateTrapdoorBlockState(block, namespace, baseBlock)
	writeBlockstate(block, doorBlockState, namespace)
	writeTrapdoorBlockModels(block, namespace, baseBlock)
	writeTrapdoorItemModel(block, namespace)
	writeLootTables(block, namespace)
	generateBlockLangObject(block)
	writeRecipes(block, "trapdoor", baseBlock)

}


function writeBlock(block, namespace, blockType, baseBlock, render_type, altNamespace, texture, shouldGenerateStonecutterRecipes) {
	if (altNamespace === undefined) {
		altNamespace = namespace;

	}
	if (texture == undefined) {
		texture = baseBlock
	}
	let blockState = `{
	"variants": {
	  "": {
		"model": "${namespace}:block/${block}"
	  }
	}
  }`
	writeBlockstate(block, blockState, namespace)
	writePlankBlockModels(block, namespace, texture, undefined, render_type)
	writeBlockItemModel(block, namespace)
	createTags(block, namespace)
	writeLootTables(block, namespace)
	generateBlockLangObject(block)
	writeRecipes(block, blockType, baseBlock, namespace)

	if (shouldGenerateStonecutterRecipes === true) {
		writeStonecutterRecipes(block, baseBlock, 1)
	}
}

function writeLeverBlock(block, namespace, baseBlock, altNamespace) {
	let uprightBlock;
	if (altNamespace === vanillaNamespace) {
		uprightBlock = block

	}
	else {
		uprightBlock = baseBlock
		uprightBlock += "_torch"
		baseBlock += "_torch"


	}

	let blockState = `{
	"variants": {
	  "face=ceiling,facing=east,powered=false": {
		"model": "${namespace}:block/${uprightBlock}_upright",
		"x": 180,
		"y": 270
	  },
	  "face=ceiling,facing=east,powered=true": {
		"model": "${namespace}:block/${block}",
		"x": 180,
		"y": 270
	  },
	  "face=ceiling,facing=north,powered=false": {
		"model": "${namespace}:block/${uprightBlock}_upright",
		"x": 180,
		"y": 180
	  },
	  "face=ceiling,facing=north,powered=true": {
		"model": "${namespace}:block/${block}",
		"x": 180,
		"y": 180
	  },
	  "face=ceiling,facing=south,powered=false": {
		"model": "${namespace}:block/${uprightBlock}_upright",
		"x": 180
	  },
	  "face=ceiling,facing=south,powered=true": {
		"model": "${namespace}:block/${block}",
		"x": 180
	  },
	  "face=ceiling,facing=west,powered=false": {
		"model": "${namespace}:block/${uprightBlock}_upright",
		"x": 180,
		"y": 90
	  },
	  "face=ceiling,facing=west,powered=true": {
		"model": "${namespace}:block/${block}",
		"x": 180,
		"y": 90
	  },
	  "face=floor,facing=east,powered=false": {
		"model": "${namespace}:block/${uprightBlock}_upright",
		"y": 90
	  },
	  "face=floor,facing=east,powered=true": {
		"model": "${namespace}:block/${block}",
		"y": 90
	  },
	  "face=floor,facing=north,powered=false": {
		"model": "${namespace}:block/${uprightBlock}_upright"
	  },
	  "face=floor,facing=north,powered=true": {
		"model": "${namespace}:block/${block}"
	  },
	  "face=floor,facing=south,powered=false": {
		"model": "${namespace}:block/${uprightBlock}_upright",
		"y": 180
	  },
	  "face=floor,facing=south,powered=true": {
		"model": "${namespace}:block/${block}",
		"y": 180
	  },
	  "face=floor,facing=west,powered=false": {
		"model": "${namespace}:block/${uprightBlock}_upright",
		"y": 270
	  },
	  "face=floor,facing=west,powered=true": {
		"model": "${namespace}:block/${block}",
		"y": 270
	  },
	  "face=wall,facing=east,powered=false": {
		"model": "${namespace}:block/${block}_wall"
	  },
	  "face=wall,facing=east,powered=true": {
		"model": "${namespace}:block/${block}",
		"x": 90,
		"y": 90
	  },
	  "face=wall,facing=north,powered=false": {
		"model": "${namespace}:block/${block}_wall",
		"y": 270
	  },
	  "face=wall,facing=north,powered=true": {
		"model": "${namespace}:block/${block}",
		"x": 90
	  },
	  "face=wall,facing=south,powered=false": {
		"model": "${namespace}:block/${block}_wall",
		"y": 90
	  },
	  "face=wall,facing=south,powered=true": {
		"model": "${namespace}:block/${block}",
		"x": 90,
		"y": 180
	  },
	  "face=wall,facing=west,powered=false": {
		"model": "${namespace}:block/${block}_wall",
		"y": 180
	  },
	  "face=wall,facing=west,powered=true": {
		"model": "${namespace}:block/${block}",
		"x": 90,
		"y": 270
	  }
	}
  }`
	writeBlockstate(block, blockState, namespace)
	writeLeverBlockModels(block, namespace, baseBlock, altNamespace)
	writeUniqueBlockItemModel(block, namespace, altNamespace, baseBlock)
	writeLootTables(block, namespace)
	writeRecipes(block, "torch_lever", baseBlock, namespace, altNamespace)
}

function writeTorchBlock(block, namespace, baseBlock, altNamespace) {
	let blockState = `{
	"variants": {
	  "face=ceiling,facing=east": {
		"model": "${namespace}:block/${block}_upright",
		"x": 180,
		"y": 270
	  },
	  "face=ceiling,facing=north": {
		"model": "${namespace}:block/${block}_upright",
		"x": 180,
		"y": 180
	  },
	  "face=ceiling,facing=south": {
		"model": "${namespace}:block/${block}_upright",
		"x": 180
	  },
	  "face=ceiling,facing=west": {
		"model": "${namespace}:block/${block}_upright",
		"x": 180,
		"y": 90
	  },
	  "face=floor,facing=east": {
		"model": "${namespace}:block/${block}_upright",
		"y": 90
	  },
	  "face=floor,facing=north": {
		"model": "${namespace}:block/${block}_upright"
	  },
	  "face=floor,facing=south": {
		"model": "${namespace}:block/${block}_upright",
		"y": 180
	  },
	  "face=floor,facing=west": {
		"model": "${namespace}:block/${block}_upright",
		"y": 270
	  },
	  "face=wall,facing=east": {
		"model": "${namespace}:block/${block}_wall"
	  },
	  "face=wall,facing=north": {
		"model": "${namespace}:block/${block}_wall",
		"y": 270
	  },  
	  "face=wall,facing=south": {
		"model": "${namespace}:block/${block}_wall",
		"y": 90
	  },
	  "face=wall,facing=west": {
		"model": "${namespace}:block/${block}_wall",
		"y": 180
	  }
	}
  }`
	writeBlockstate(block, blockState, namespace)
	writeTorchBlockModels(block, namespace, block, altNamespace)
	writeUniqueBlockItemModel(block, namespace, namespace, block)
	writeLootTables(block, namespace)
	writeRecipes(block, "torch", baseBlock, namespace, altNamespace)
}

function writeCraftingTableBlock(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	let blockState = `{
	"variants": {
	  "": {
		"model": "${namespace}:block/${block}"
	  }
	}
  }`
	writeBlockstate(block, blockState, namespace)
	writeCraftingTableBlockModels(block, namespace, baseBlock, altNamespace)
	writeBlockItemModel(block, namespace)
	generateBlockLangObject(block)
	tagBlock(block, "crafting_tables")
	checkAndAddStainedTag(block, baseBlock)
	writeRecipes(block, "crafting_table", baseBlock, namespace, altNamespace)
}

function checkAndAddStainedTag(block, baseBlock) {
	if (block.includes("stained")) {
		const colour = baseBlock.split("_stained")[0]
		tagBlock(block, `c:dyed/${colour}`)
	}
}

function writeLadders(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	blockState = `{
	"variants": {
	  "facing=east": {
		"model": "${namespace}:block/${block}",
		"y": 90
	  },
	  "facing=north": {
		"model": "${namespace}:block/${block}"
	  },
	  "facing=south": {
		"model": "${namespace}:block/${block}",
		"y": 180
	  },
	  "facing=west": {
		"model": "${namespace}:block/${block}",
		"y": 270
	  }
	}
  }`
	writeBlockstate(block, blockState, namespace)
	writePlankBlockModels(block, namespace, baseBlock, "pyrite:block/template_ladder")
	writeUniqueBlockItemModel(block, namespace, namespace)
	writeLootTables(block, namespace)
	writeRecipes(block, "ladder", baseBlock, namespace, altNamespace)
}

function writeChests(block, dye, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	block += "_chest"
	blockState = `{
	"variants": {
	  "": {
		"model": "${namespace}:block/${block}"
	  }
	}
  }`
	writeBlockstate(block, blockState, namespace)
	writePlankBlockModels(block, namespace, baseBlock)
	writeUniqueBlockItemModel(block, namespace)
	writeLootTables(block, namespace)
	writeRecipes(block, "chest", baseBlock, namespace, altNamespace)
}

function writeFlower(block, namespace) {
	let blockState = `{
	"variants": {
	  "": {
		"model": "${namespace}:block/${block}"
	  }
	}
  }`
	writeBlockstate(block, blockState, namespace)
	writeFlowerBlockModels(block, namespace)
	writeUniqueBlockItemModel(block, namespace)
	// createTags(block, namespace)
	generateBlockLangObject(block)
	writeLootTables(block, namespace)
	// writeRecipes(block, special, dye)

}

function writeChiseledBlock(block, baseBlock, namespace, special) {
	blockState = `{
	"variants": {
	  "axis=x": {
		"model": "${namespace}:block/${block}_horizontal",
		"x": 90,
		"y": 90
	  },
	  "axis=y": {
		"model": "${namespace}:block/${block}"
	  },
	  "axis=z": {
		"model": "${namespace}:block/${block}_horizontal",
		"x": 90
	  }
	}
  }`
	writeBlockstate(block, blockState, namespace)
	writeCubeColumnBlockModels(block, namespace, baseBlock)
	writeBlockItemModel(block, namespace)
	createTags(block, namespace)
	generateBlockLangObject(block)
	writeLootTables(block, namespace)
	writeRecipes(block, special, baseBlock)
	writeStonecutterRecipes(block, baseBlock, 1)

}

function writePaneBlock(block, namespace, baseBlock) {
	baseBlock = block.replace("_pane", "")
	writeBlockstate(block, generatePaneBlockState(block, namespace, baseBlock), namespace)
	writePaneBlockModels(block, namespace, baseBlock)
	writeUniqueBlockItemModel(block, namespace, namespace, baseBlock)
	createTags(block, namespace)
	writeLootTables(block, namespace)
	writeRecipes(block, "glass_pane", baseBlock)
	generateBlockLangObject(block)
}

function writeBarBlock(block, namespace, baseBlock) {
	baseBlock = block
	block = block + "_bars"
	writeBlockstate(block, generateBarBlockState(block, namespace, baseBlock), namespace)
	writePaneBlockModels(block, namespace, block)
	writeUniqueBlockItemModel(block, namespace)
	createTags(block, namespace)
	generateBlockLangObject(block)
	writeLootTables(block, namespace)
	writeRecipes(block, "bars", baseBlock)

}

function generatePaneBlockState(block, namespace, baseBlock) {
	return `{
	"multipart": [
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_post"
		}
	  },
	  {
		"when": {
		  "north": "true"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_side"
		}
	  },
	  {
		"when": {
		  "east": "true"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "y": 90
		}
	  },
	  {
		"when": {
		  "south": "true"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_side_alt"
		}
	  },
	  {
		"when": {
		  "west": "true"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_side_alt",
		  "y": 90
		}
	  },
	  {
		"when": {
		  "north": "false"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_noside"
		}
	  },
	  {
		"when": {
		  "east": "false"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_noside_alt"
		}
	  },
	  {
		"when": {
		  "south": "false"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_noside_alt",
		  "y": 90
		}
	  },
	  {
		"when": {
		  "west": "false"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_noside",
		  "y": 270
		}
	  }
	]
  }`
}

function generateBarBlockState(block, namespace, baseBlock) {
	return `{
	"multipart": [
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_post_ends"
		}
	  },
	  {
		"when": {
		  "north": "false",
		  "west": "false",
		  "south": "false",
		  "east": "false"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_post"
		}
	  },
	  {
		"when": {
		  "north": "true",
		  "west": "false",
		  "south": "false",
		  "east": "false"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_cap"
		}
	  },
	  {
		"when": {
		  "north": "false",
		  "west": "false",
		  "south": "false",
		  "east": "true"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_cap",
		  "y": 90
		}
	  },
	  {
		"when": {
		  "north": "false",
		  "west": "false",
		  "south": "true",
		  "east": "false"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_cap_alt"
		}
	  },
	  {
		"when": {
		  "north": "false",
		  "west": "true",
		  "south": "false",
		  "east": "false"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_cap_alt",
		  "y": 90
		}
	  },
	  {
		"when": {
		  "north": "true"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_side"
		}
	  },
	  {
		"when": {
		  "east": "true"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "y": 90
		}
	  },
	  {
		"when": {
		  "south": "true"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_side_alt"
		}
	  },
	  {
		"when": {
		  "west": "true"
		},
		"apply": {
		  "model": "${namespace}:block/${block}_side_alt",
		  "y": 90
		}
	  }
	]
  }`
}

function writeLogs(block, namespace, special) {
	blockState = `{
	"variants": {
	  "axis=x": {
		"model": "${namespace}:block/${block}_horizontal",
		"x": 90,
		"y": 90
	  },
	  "axis=y": {
		"model": "${namespace}:block/${block}"
	  },
	  "axis=z": {
		"model": "${namespace}:block/${block}_horizontal",
		"x": 90
	  }
	}
  }`
	writeBlockstate(block, blockState, namespace)
	writeLogBlockModels(block, namespace)
	writeBlockItemModel(block, namespace)
	createTags(block, namespace)
	writeRecipes(block, special)


}

function writeWalls(block, namespace, baseBlock, altNamespace) {
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	if (altNamespace === undefined) {
		altNamespace = namespace
	}

	wallBlockState = `{
	"multipart": [
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_post"
		},
		"when": {
		  "up": "true"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "uvlock": true
		},
		"when": {
		  "north": "low"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "uvlock": true,
		  "y": 90
		},
		"when": {
		  "east": "low"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "uvlock": true,
		  "y": 180
		},
		"when": {
		  "south": "low"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "uvlock": true,
		  "y": 270
		},
		"when": {
		  "west": "low"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side_tall",
		  "uvlock": true
		},
		"when": {
		  "north": "tall"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side_tall",
		  "uvlock": true,
		  "y": 90
		},
		"when": {
		  "east": "tall"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side_tall",
		  "uvlock": true,
		  "y": 180
		},
		"when": {
		  "south": "tall"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side_tall",
		  "uvlock": true,
		  "y": 270
		},
		"when": {
		  "west": "tall"
		}
	  }
	]
  }`
	writeBlockstate(block, wallBlockState, namespace)
	writeWallBlockModels(block, altNamespace, baseBlock)
	writeInventoryModel(block, namespace)
	createTags(block, namespace)
	generateBlockLangObject(block)
	writeRecipes(block, "wall", baseBlock, altNamespace)
	writeStonecutterRecipes(id(namespace, block), id(namespace, baseBlock), 1)

}

function generateStairBlockstate(block, namespace) {
	return `{
		"variants": {
		  "facing=east,half=bottom,shape=inner_left": {
			"model": "${namespace}:block/${block}_inner",
			"y": 270,
			"uvlock": true
		  },
		  "facing=east,half=bottom,shape=inner_right": {
			"model": "${namespace}:block/${block}_inner"
		  },
		  "facing=east,half=bottom,shape=outer_left": {
			"model": "${namespace}:block/${block}_outer",
			"y": 270,
			"uvlock": true
		  },
		  "facing=east,half=bottom,shape=outer_right": {
			"model": "${namespace}:block/${block}_outer"
		  },
		  "facing=east,half=bottom,shape=straight": {
			"model": "${namespace}:block/${block}"
		  },
		  "facing=east,half=top,shape=inner_left": {
			"model": "${namespace}:block/${block}_inner",
			"x": 180,
			"uvlock": true
		  },
		  "facing=east,half=top,shape=inner_right": {
			"model": "${namespace}:block/${block}_inner",
			"x": 180,
			"y": 90,
			"uvlock": true
		  },
		  "facing=east,half=top,shape=outer_left": {
			"model": "${namespace}:block/${block}_outer",
			"x": 180,
			"uvlock": true
		  },
		  "facing=east,half=top,shape=outer_right": {
			"model": "${namespace}:block/${block}_outer",
			"x": 180,
			"y": 90,
			"uvlock": true
		  },
		  "facing=east,half=top,shape=straight": {
			"model": "${namespace}:block/${block}",
			"x": 180,
			"uvlock": true
		  },
		  "facing=north,half=bottom,shape=inner_left": {
			"model": "${namespace}:block/${block}_inner",
			"y": 180,
			"uvlock": true
		  },
		  "facing=north,half=bottom,shape=inner_right": {
			"model": "${namespace}:block/${block}_inner",
			"y": 270,
			"uvlock": true
		  },
		  "facing=north,half=bottom,shape=outer_left": {
			"model": "${namespace}:block/${block}_outer",
			"y": 180,
			"uvlock": true
		  },
		  "facing=north,half=bottom,shape=outer_right": {
			"model": "${namespace}:block/${block}_outer",
			"y": 270,
			"uvlock": true
		  },
		  "facing=north,half=bottom,shape=straight": {
			"model": "${namespace}:block/${block}",
			"y": 270,
			"uvlock": true
		  },
		  "facing=north,half=top,shape=inner_left": {
			"model": "${namespace}:block/${block}_inner",
			"x": 180,
			"y": 270,
			"uvlock": true
		  },
		  "facing=north,half=top,shape=inner_right": {
			"model": "${namespace}:block/${block}_inner",
			"x": 180,
			"uvlock": true
		  },
		  "facing=north,half=top,shape=outer_left": {
			"model": "${namespace}:block/${block}_outer",
			"x": 180,
			"y": 270,
			"uvlock": true
		  },
		  "facing=north,half=top,shape=outer_right": {
			"model": "${namespace}:block/${block}_outer",
			"x": 180,
			"uvlock": true
		  },
		  "facing=north,half=top,shape=straight": {
			"model": "${namespace}:block/${block}",
			"x": 180,
			"y": 270,
			"uvlock": true
		  },
		  "facing=south,half=bottom,shape=inner_left": {
			"model": "${namespace}:block/${block}_inner"
		  },
		  "facing=south,half=bottom,shape=inner_right": {
			"model": "${namespace}:block/${block}_inner",
			"y": 90,
			"uvlock": true
		  },
		  "facing=south,half=bottom,shape=outer_left": {
			"model": "${namespace}:block/${block}_outer"
		  },
		  "facing=south,half=bottom,shape=outer_right": {
			"model": "${namespace}:block/${block}_outer",
			"y": 90,
			"uvlock": true
		  },
		  "facing=south,half=bottom,shape=straight": {
			"model": "${namespace}:block/${block}",
			"y": 90,
			"uvlock": true
		  },
		  "facing=south,half=top,shape=inner_left": {
			"model": "${namespace}:block/${block}_inner",
			"x": 180,
			"y": 90,
			"uvlock": true
		  },
		  "facing=south,half=top,shape=inner_right": {
			"model": "${namespace}:block/${block}_inner",
			"x": 180,
			"y": 180,
			"uvlock": true
		  },
		  "facing=south,half=top,shape=outer_left": {
			"model": "${namespace}:block/${block}_outer",
			"x": 180,
			"y": 90,
			"uvlock": true
		  },
		  "facing=south,half=top,shape=outer_right": {
			"model": "${namespace}:block/${block}_outer",
			"x": 180,
			"y": 180,
			"uvlock": true
		  },
		  "facing=south,half=top,shape=straight": {
			"model": "${namespace}:block/${block}",
			"x": 180,
			"y": 90,
			"uvlock": true
		  },
		  "facing=west,half=bottom,shape=inner_left": {
			"model": "${namespace}:block/${block}_inner",
			"y": 90,
			"uvlock": true
		  },
		  "facing=west,half=bottom,shape=inner_right": {
			"model": "${namespace}:block/${block}_inner",
			"y": 180,
			"uvlock": true
		  },
		  "facing=west,half=bottom,shape=outer_left": {
			"model": "${namespace}:block/${block}_outer",
			"y": 90,
			"uvlock": true
		  },
		  "facing=west,half=bottom,shape=outer_right": {
			"model": "${namespace}:block/${block}_outer",
			"y": 180,
			"uvlock": true
		  },
		  "facing=west,half=bottom,shape=straight": {
			"model": "${namespace}:block/${block}",
			"y": 180,
			"uvlock": true
		  },
		  "facing=west,half=top,shape=inner_left": {
			"model": "${namespace}:block/${block}_inner",
			"x": 180,
			"y": 180,
			"uvlock": true
		  },
		  "facing=west,half=top,shape=inner_right": {
			"model": "${namespace}:block/${block}_inner",
			"x": 180,
			"y": 270,
			"uvlock": true
		  },
		  "facing=west,half=top,shape=outer_left": {
			"model": "${namespace}:block/${block}_outer",
			"x": 180,
			"y": 180,
			"uvlock": true
		  },
		  "facing=west,half=top,shape=outer_right": {
			"model": "${namespace}:block/${block}_outer",
			"x": 180,
			"y": 270,
			"uvlock": true
		  },
		  "facing=west,half=top,shape=straight": {
			"model": "${namespace}:block/${block}",
			"x": 180,
			"y": 180,
			"uvlock": true
		  }
		}
	  }`
}

// DEPRECATED - STAIR GENERATOR
function writeStairs(block, namespace, baseBlock, altNamespace, shouldGenerateStonecutterRecipes) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	let stairBlockState = generateStairBlockstate(block, namespace)
	writeBlockstate(block, stairBlockState, namespace)
	writeStairBlockModels(block, altNamespace, baseBlock)
	writeBlockItemModel(block, namespace)
	createTags(block, namespace)
	generateBlockLangObject(block)
	writeRecipes(block, "stairs", baseBlock, namespace)
	if (shouldGenerateStonecutterRecipes === true) {
		writeStonecutterRecipes(block, baseBlock, 1)
	}
}

// V2 - STAIR GENERATOR
function writeStairsV2(block, baseBlock, texture, shouldGenerateStonecutterRecipes) {
	let textureNamespace, texturePath;
	if (texture == undefined) {
		texture = baseBlock;
	}
	if (texture.includes(":")) {
		textureNamespace = texture.split(":")[0]
		texturePath = texture.split(":")[1]
	}
	else {
		textureNamespace = globalNamespace;
		texturePath = texture;
	}

	let stairBlockState = generateStairBlockstate(block, globalNamespace)
	writeBlockstate(block, stairBlockState, globalNamespace)
	writeStairBlockModels(block, textureNamespace, texture)
	writeBlockItemModel(block, globalNamespace)
	createTags(block, globalNamespace)
	generateBlockLangObject(block)
	writeRecipes(block, "stairs", baseBlock, globalNamespace)

	if (shouldGenerateStonecutterRecipes === true) {
		writeStonecutterRecipes(block, baseBlock, 1)
	}
}

// DEPRECATED - SLAB GENERATOR
function writeSlabs(block, namespace, baseBlock, altNamespace, shouldGenerateStonecutterRecipes) {
	if (altNamespace == undefined) {
		altNamespace = namespace
	}
	let slabBlockState = generateSlabBlockState(block, namespace, baseBlock)
	writeBlockstate(block, slabBlockState, namespace)
	writeSlabBlockModels(block, altNamespace, baseBlock)
	writeBlockItemModel(block, namespace)
	createTags(block, namespace)
	generateBlockLangObject(block)
	writeRecipes(block, "slabs", baseBlock, namespace)

	if (shouldGenerateStonecutterRecipes === true) {
		writeStonecutterRecipes(block, baseBlock, 2)
	}



}

// V2 - STAIR GENERATOR
function writeSlabsV2(block, baseBlock, texture, shouldGenerateStonecutterRecipes) {
	let textureNamespace, texturePath;
	if (texture == undefined) {
		texture = baseBlock;
	}
	if (texture.includes(":")) {
		textureNamespace = texture.split(":")[0]
		texturePath = texture.split(":")[1]
	}
	else {
		textureNamespace = globalNamespace;
		texturePath = texture;
	}

	let slabBlockState = generateSlabBlockState(block, globalNamespace, baseBlock)
	writeBlockstate(block, slabBlockState, globalNamespace)
	writeSlabBlockModels(block, textureNamespace, texture)
	writeBlockItemModel(block, globalNamespace)
	createTags(block, globalNamespace)
	generateBlockLangObject(block)
	writeRecipes(block, "slabs", baseBlock, globalNamespace)

	if (shouldGenerateStonecutterRecipes === true) {
		writeStonecutterRecipes(block, baseBlock, 2)
	}



}

function writePlates(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	plateBlockState = `{
		"variants": {
		  "powered=false": {
			"model": "${namespace}:block/${block}"
		  },
		  "powered=true": {
			"model": "${namespace}:block/${block}_down"
		  }
		}
	  }`
	writeBlockstate(block, plateBlockState)
	writePlateBlockModels(block, altNamespace, baseBlock)
	writeBlockItemModel(block, namespace, namespace)
	createTags(block, namespace, baseBlock)
	generateBlockLangObject(block)
	writeRecipes(block, "plates", baseBlock)

}


function writeButtons(block, namespace, baseBlock, altNamespace, type) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	if (type == undefined) {
		type = "buttons"
	}
	let buttonBlockState = generateButtonBlockState(block, namespace, baseBlock)
	writeBlockstate(block, buttonBlockState)
	writeButtonBlockModels(block, altNamespace, baseBlock)
	writeInventoryModel(block)
	createTags(block)
	generateBlockLangObject(block)
	writeRecipes(block, type, baseBlock, namespace, altNamespace)


}
function writeFences(block, namespace, baseBlock) {
	fenceBlockState = generateFenceBlockState(block, namespace, baseBlock)
	writeBlockstate(block, fenceBlockState)
	writeFenceBlockModels(block, baseBlock, namespace)
	writeInventoryModel(block)
	createTags(block)
	writeRecipes(block, "fences", baseBlock, namespace)



}

function writeFenceGates(block, namespace, baseBlock, altNamespace) {
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	fenceGateBlockState = generateFenceGateBlockState(block, namespace)
	writeBlockstate(block, fenceGateBlockState, namespace, baseBlock)
	writeFenceGateBlockModels(block, altNamespace, baseBlock)
	writeBlockItemModel(block, namespace, baseBlock)
	createTags(block, namespace, baseBlock)
	generateBlockLangObject(block)
	writeRecipes(block, "fence_gates", baseBlock, namespace)



}

function writeWallGates(block, namespace, baseBlock, altNamespace) {
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	let fenceGateBlockState = generateFenceGateBlockState(block, namespace)
	writeBlockstate(block, fenceGateBlockState, globalNamespace, baseBlock)
	writeWallGateBlockModels(block, altNamespace, baseBlock)
	generateBlockLangObject(block)
	writeBlockItemModel(block, globalNamespace, baseBlock)
	createTags(block, namespace, baseBlock)
	writeRecipes(block, "wall_gates", baseBlock, namespace, altNamespace)

}

function generateCarpetBlockState(block, namespace, baseBlock) {
	return `{
	"variants": {
	  "": {
		"model": "${namespace}:block/${block}"
	  }
	}
  }`
}

function writeCarpet(block, namespace, baseBlock, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	writeBlockstate(block, generateCarpetBlockState(block, namespace, baseBlock), globalNamespace)
	writeCarpetBlockModels(block, altNamespace, baseBlock)
	writeBlockItemModel(block, namespace)
	if (baseBlock.search("_top") !== -1) {
		baseBlock = baseBlock.split("_top")[0]

	}
	generateBlockLangObject(block)
	writeRecipes(block, "carpet", baseBlock, namespace, altNamespace)


}

function writeCarpetV2(block, baseBlock, texture) {

	writeBlockstate(block, generateCarpetBlockState(block, namespace, baseBlock), globalNamespace)
	writeCarpetBlockModels(block, altNamespace, baseBlock)
	writeBlockItemModel(block, namespace)
	if (baseBlock.search("_top") !== -1) {
		baseBlock = baseBlock.split("_top")[0]

	}
	writeRecipes(block, "carpet", baseBlock, namespace, altNamespace)


}


function enableNewRecipes() {
	if (((majorVersion === 21) && (minorVersion !== 1)) || (majorVersion > 21)) {
		return true;
	}
	else return false;
}

function itemOrId() {
	if ((majorVersion <= 21)) {
		return "id";
	}
	else return "item";
}

function addIngredients(ingredientArray, ingredient) {
	if (enableNewRecipes()) {
		ingredientArray.push(ingredient)
	}
	else {
		if (ingredient[0] === "#") {
			ingredientArray.push({ "tag": ingredient.slice(1) })
		}
		else {
			ingredientArray.push({ "item": ingredient })
		}
	}
}

function generateShapelessRecipe(ingredients, result, quantity) {
	let recipe = {
		"type": "minecraft:crafting_shapeless",
		"ingredients": []
	}
	if (ingredients instanceof Array) {
		ingredients.forEach(function (i) {
			addIngredients(recipe.ingredients, i)
		})
	}
	else {
		addIngredients(recipe.ingredients, ingredients)
	}

	recipe.result = JSON.parse(`{"${itemOrId()}": "${result}","count": ${quantity}}`)

	return recipe

}

function generateShapedRecipe(ingredients, result, quantity, shape) {
	let newIngredients = {};
	if (!enableNewRecipes()) {
		const keys = Object.keys(ingredients)
		const values = Object.values(ingredients)
		let i = 0;
		values.forEach(function (value) {
			let itemOrTag;
			if (value.charAt(0) == "#") {
				value = value.slice(1)
				itemOrTag = "tag"

			}
			else {
				itemOrTag = "item"
			}
			Object.assign(newIngredients, JSON.parse(`{"${keys[i]}": {"${itemOrTag}": "${value}"}}`))
			i++
		})
	}
	else { newIngredients = ingredients }

	let recipe = {
		"type": "minecraft:crafting_shaped",
		"pattern": shape,
		"key": newIngredients

	}

	recipe.result = JSON.parse(`{"${itemOrId()}": "${result}","count": ${quantity}}`)

	return recipe

}

function createTags(block) {
	tags += `	"pyrite:${block}",\n`

}

function writeTags(file) {
	tags = tags.slice(0, -2)

	tags = `{
	"replace": false,
	"values": [
${tags}
	]
  }`

	writeFile(`${paths.mctags}${file}`, tags);

}

function writeLootTables(block, namespace) {
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	let lootTable = `	{
	"type": "minecraft:block",
	"pools": [
	  {
		"rolls": 1,
		"entries": [
		  {
			"type": "minecraft:item",
			"name": "${namespace}:${block}"
		  }
		],
		"conditions": [
		  {
			"condition": "minecraft:survives_explosion"
		  }
		]
	  }
	]
  }

`
	writeFile(`${paths.loot}${block}.json`, lootTable);
}


function writeDoorLootTables(block, namespace) {
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	let lootTable = `	{
	"type": "minecraft:block",
	"pools": [
	  {
		"bonus_rolls": 0.0,
		"conditions": [
		  {
			"condition": "minecraft:survives_explosion"
		  }
		],
		"entries": [
		  {
			"type": "minecraft:item",
			"conditions": [
			  {
				"block": "${namespace}:${block}",
				"condition": "minecraft:block_state_property",
				"properties": {
				  "half": "lower"
				}
			  }
			],
			"name": "${namespace}:${block}"
		  }
		],
		"rolls": 1.0
	  }
	]
}

`
	writeFile(`${paths.loot}${block}.json`, lootTable);
}

function createDyeRecipe(namespace, block, altNamespace, altBlock, other, baseNamespace) {
	if (baseNamespace === undefined) {
		baseNamespace = altNamespace
	}
	return generateShapedRecipe({ "C": id(baseNamespace, altBlock), "D": id(altNamespace, other) }, id(globalNamespace, block), 8, ["CCC", "CDC", "CCC"])
}

function generateRecipes(block, type, other, namespace, altNamespace) {
	if (namespace === undefined) {
		namespace = globalNamespace
	}
	if (altNamespace === undefined) {
		altNamespace = globalNamespace
	}
	let recipe = ""

	// Fix Quartz texture IDs being used as part of the recipe
	if (other != undefined) {
		if (other.includes("quartz")) {
			other = other.replace("_bottom", "")
			other = other.replace("_top", "")
		}
	}

	if (type === "planks") {
		if ((other === "red_mushroom") || (other === "brown_mushroom")) {
			recipe = generateShapelessRecipe(`pyrite:${other}_stem`, id(namespace, block), 4)
		}
		else {
			other = other.replace("stained", "dye")
			altNamespace = getDyeNamespace(other)
			recipe = generateShapedRecipe({ "C": `#minecraft:planks`, "D": id(altNamespace, other) }, id(globalNamespace, block), 8, ["CCC", "CDC", "CCC"])
		}
	}
	else if (type === "ladder") {
		recipe = generateShapedRecipe({ "C": `minecraft:stick`, "D": id(altNamespace, other) }, id(namespace, block), 3, ["C C", "CDC", "C C"])
	}
	else if (type === "terracotta") {
		other = `${other}_dye`
		altNamespace = getDyeNamespace(other)
		//FIX
		recipe = createDyeRecipe(namespace, block, altNamespace, id(vanillaNamespace, "terracotta"), other)
	}
	if (type === "terracotta_bricks") {
		altNamespace = getDyeNamespace(other)
		recipe = generateShapedRecipe({ "C": id(altNamespace, other) }, id(namespace, block), 3, ["CC", "CC"])
	}
	else if (type === "torch") {
		other = `${other}_dye`
		altNamespace = getDyeNamespace(other)
		let ingredients = [id(altNamespace, other), id(vanillaNamespace, "torch")]
		let result = id(namespace, block)

		recipe = generateShapelessRecipe(ingredients, result, 1)
	}
	else if (type === "wool") {
		recipe = generateShapelessRecipe([id(globalNamespace, `${other}_dye`), "minecraft:white_wool"], id(namespace, block), 1)
	}
	else if (type === "torch_lever") {
		recipe = generateShapelessRecipe([id(altNamespace, other), "minecraft:lever"], id(namespace, block), 1)
	}
	else if (type === "cobblestone_bricks") {
		recipe = generateShapedRecipe({ "C": `minecraft:cobblestone` }, id(globalNamespace, `cobblestone_bricks`), 4, ["CC", "CC"])
	}
	else if (type === "smooth_stone_bricks") {
		recipe = generateShapedRecipe({ "C": `minecraft:smooth_stone` }, `pyrite:smooth_stone_bricks`, 4, ["CC", "CC"])
	}
	else if (type === "mossy_cobblestone_bricks") {
		recipe = generateShapelessRecipe(["pyrite:cobblestone_bricks", "minecraft:vine"], id(namespace, block), 1)
	}
	else if (type === "glowing_obsidian") {
		recipe = generateShapedRecipe({ "X": `minecraft:crying_obsidian`, "#": `minecraft:magma_block` }, `pyrite:glowing_obsidian`, 4, ["X#", "#X"])
	}
	else if (type.includes("cut_")) {
		let baseBlock = type.split("_")[1]
		baseBlock = baseBlock + "_block"
		recipe = generateShapedRecipe({ "#": id(vanillaNamespace, baseBlock) }, id(globalNamespace, type), 4, ["##", "##"])
	}
	else if (type.includes("_turf")) {
		recipe = generateShapedRecipe({ "#": id(vanillaNamespace, other) }, id(globalNamespace, type), 4, ["##", "##"])
	}
	else if (type === "framed_glass") {
		recipe = generateShapedRecipe({ "#": `minecraft:glass`, "X": `minecraft:iron_nugget` }, id(globalNamespace, type), 4, [
			"X#X",
			"#X#",
			"X#X"
		])
	}
	else if ((type === "dyed_framed_glass") || (type === "stained_framed_glass")) {
		const dye = `${other}_dye`
		altNamespace = getDyeNamespace(dye)
		recipe = createDyeRecipe(namespace, block, altNamespace, "framed_glass", dye, namespace)
	}
	else if (type === "glass_pane") {
		const dye = `${other}_dye`
		altNamespace = getDyeNamespace(dye)
		recipe = generateShapedRecipe({ "C": id(namespace, block.replace("_pane", "")) }, id(namespace, block), 16, ["CCC", "CCC"])
	}
	else if (type === "lamp") {
		if (block === "glowstone_lamp") {
			recipe = generateShapedRecipe({ "#": `minecraft:glowstone` }, { "X": `minecraft:iron_nugget` }, id(globalNamespace, block), 4, [
				"X#X",
				"#X#",
				"X#X"
			])
		} else {
			other = `${other}_dye`
			altNamespace = getDyeNamespace(other)
			recipe = createDyeRecipe(namespace, block, altNamespace, "glowstone_lamp", other, namespace)
		}

	}
	else if (type === "bricks") {

		if (block === "charred_nether_bricks") {
			recipe = `{
		"type": "minecraft:smelting",
		"category": "blocks",
		"cookingtime": 200,
		"experience": 0.1,
		"ingredient": {
		  "item": "minecraft:nether_bricks"
		},
		"result": "pyrite:charred_nether_bricks"
	  }`
		}
		else if (block === "blue_nether_bricks") {
			recipe = generateShapedRecipe({ "N": `minecraft:nether_brick` }, { "W": `minecraft:warped_fungus` }, `pyrite:${block}`, 1, [
				"NW",
				"WN"
			])
		}
		else {
			other = `${other}_dye`
			altNamespace = getDyeNamespace(other)
			recipe = generateShapedRecipe({ "C": id(altNamespace, other), "D": `minecraft:bricks` }, `pyrite:${block}`, 4, ["CCC", "CDC", "CCC"])
		}
	}
	else if (type === "resource_bricks") {
		recipe = generateShapedRecipe({ "D": other }, id(namespace, block), 4, [
			"DD",
			"DD"
		])
	}
	else if (type === "nostalgia") {
		if (other == "copper") {
			other += "_block"
		}
		recipe = generateShapelessRecipe([id(globalNamespace, "nostalgia_dye"), id(vanillaNamespace, other)], id(globalNamespace, block), 1)
	}
	else if (type === "chiseled_resource") {
		recipe = generateShapedRecipe({ "D": id(vanillaNamespace, other) }, id(namespace, block), 4, [
			"D",
			"D"
		])
	}
	else if (type === "chiseled_pillar") {
		recipe = generateShapedRecipe({ "D": id(vanillaNamespace, other) }, id(namespace, block), 4, [
			"D",
			"D"
		])
	}
	else if (type === "bars") {
		recipe = generateShapedRecipe({ "D": id(globalNamespace, `cut_${other}`) }, id(namespace, block), 4, [
			"DDD",
			"DDD"
		])
	}
	else if (type === "stairs") {
		recipe = generateShapedRecipe({ "C": id(globalNamespace, other) }, id(namespace, block), 4, [
			"C  ",
			"CC ",
			"CCC"
		])
	}
	else if (type === "wall") {
		if (!other.includes(":")) {
			other = id(other)
		}
		recipe = generateShapedRecipe({ "C": `${other}` }, id(namespace, block), 6, [
			"CCC",
			"CCC"
		])
	}
	else if (type === "slabs") {
		recipe = generateShapedRecipe({ "C": id(globalNamespace, other) }, id(namespace, block), 6, [
			"CCC"
		])
	}
	else if (type === "plates") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, other) }, id(namespace, block), 1, ["CC"])
	}
	else if (type === "door") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, other) }, id(namespace, block), 1, [
			"CC",
			"CC",
			"CC"
		])
	}
	else if (type === "crafting_table") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, other) }, id(namespace, block), 1, [
			"CC",
			"CC"
		])
	}
	else if (type === "trapdoor") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, other) }, id(namespace, block), 2, [
			"CCC",
			"CCC"
		])
	}
	else if (type === "carpet") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, other) }, id(namespace, block), 3, ["CC"])
	}
	else if (type === "fences") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, other), "S": id(vanillaNamespace, "stick") }, id(namespace, block), 1, [
			"CSC",
			"CSC"
		])
	}
	else if (type === "fence_gates") {
		recipe = generateShapedRecipe({ "C": id(namespace, other), "S": `minecraft:stick` }, id(namespace, block), 1, [
			"SCS",
			"SCS"
		])
	}
	else if (type === "wall_gates") {
		let baseWall = other
		baseWall = `${baseWall.replace("bricks", "brick")}`
		baseWall = `${baseWall.replace("tiles", "tile")}`
		baseWall = baseWall + "_wall"
		if (!other.includes(":")) {
			other = id(other)
		}
		if (!baseWall.includes(":")) {
			baseWall = id(altNamespace, baseWall)
		}
		// Override for Cut Copper Walls not existing.
		if (baseWall.includes("copper")) {
			baseWall = baseWall.replace("minecraft", globalNamespace)
		}
		// Override for it picking up Smooth Quartz Block Walls instead of Smooth Quartz Walls
		else if (baseWall.includes("quartz")) {
			other = "minecraft:smooth_quartz"
			baseWall = baseWall = "pyrite:smooth_quartz_wall"
		}
		baseWall = baseWall.replace("weathered_cut", "cut_weathered")
		baseWall = baseWall.replace("oxidized_cut", "cut_oxidized")
		baseWall = baseWall.replace("exposed_cut", "cut_exposed")
		recipe = generateShapedRecipe({ "C": other, "S": baseWall }, id(namespace, block), 6, [
			"SCS",
			"SCS"
		])
	}
	else if (type === "buttons") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, other) }, id(namespace, block), 1, [
			"C"
		])
	}
	else if (type === "metal_buttons") {
		recipe = generateShapelessRecipe([id(altNamespace, other), `#${altNamespace}:buttons`], id(namespace, block), 1)
	}

	return recipe

}

function writeRecipes(block, type, other, namespace, altNamespace) {
	let recipe = generateRecipes(block, type, other, namespace, altNamespace)
	if ((recipe !== "")) {
		writeFile(`${paths.recipes}${block}.json`, recipe)
	}
}

function writeStonecutterRecipes(block, ingredient, quantity, addon) {
	let path;
	if (addon === undefined) {
		addon = ""
	}
	else {
		addon = addon + "_"
	}
	if (!block.includes(":")) {
		path = block
		block = id(block)
	}
	else {
		path = block.split(":")[1]
	}
	if (!ingredient.includes(":")) {
		ingredient = id(ingredient)
	}
	if (ingredient.includes("quartz")) {
		ingredient = ingredient.replace("_bottom", "")
		ingredient = ingredient.replace("_top", "")
	}
	let recipe = `{
	"type": "minecraft:stonecutting",
	"ingredient": {
	  "item": "${ingredient}"
	},
	"result": {
	  "id": "${block}",
	  "count": ${quantity}
	} 
	
  }`
	writeFile(`${paths.recipes}${addon}${path}_stonecutting.json`, recipe)

}



function generateSlabBlockState(block, namespace, baseBlock) {
	return `{
	"variants": {
	  "type=bottom": {
		"model": "${namespace}:block/${block}"
	  },
	  "type=double": {
		"model": "${namespace}:block/${baseBlock}"
	  },
	  "type=top": {
		"model": "${namespace}:block/${block}_top"
	  }
	}
  }`
}

function generateDoorBlockState(block, namespace, baseBlock) {
	return `{
	"variants": {
	  "facing=east,half=lower,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_bottom_left"
	  },
	  "facing=east,half=lower,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_bottom_left_open",
		"y": 90
	  },
	  "facing=east,half=lower,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_bottom_right"
	  },
	  "facing=east,half=lower,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_bottom_right_open",
		"y": 270
	  },
	  "facing=east,half=upper,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_top_left"
	  },
	  "facing=east,half=upper,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_top_left_open",
		"y": 90
	  },
	  "facing=east,half=upper,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_top_right"
	  },
	  "facing=east,half=upper,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_top_right_open",
		"y": 270
	  },
	  "facing=north,half=lower,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_bottom_left",
		"y": 270
	  },
	  "facing=north,half=lower,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_bottom_left_open"
	  },
	  "facing=north,half=lower,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_bottom_right",
		"y": 270
	  },
	  "facing=north,half=lower,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_bottom_right_open",
		"y": 180
	  },
	  "facing=north,half=upper,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_top_left",
		"y": 270
	  },
	  "facing=north,half=upper,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_top_left_open"
	  },
	  "facing=north,half=upper,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_top_right",
		"y": 270
	  },
	  "facing=north,half=upper,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_top_right_open",
		"y": 180
	  },
	  "facing=south,half=lower,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_bottom_left",
		"y": 90
	  },
	  "facing=south,half=lower,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_bottom_left_open",
		"y": 180
	  },
	  "facing=south,half=lower,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_bottom_right",
		"y": 90
	  },
	  "facing=south,half=lower,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_bottom_right_open"
	  },
	  "facing=south,half=upper,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_top_left",
		"y": 90
	  },
	  "facing=south,half=upper,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_top_left_open",
		"y": 180
	  },
	  "facing=south,half=upper,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_top_right",
		"y": 90
	  },
	  "facing=south,half=upper,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_top_right_open"
	  },
	  "facing=west,half=lower,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_bottom_left",
		"y": 180
	  },
	  "facing=west,half=lower,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_bottom_left_open",
		"y": 270
	  },
	  "facing=west,half=lower,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_bottom_right",
		"y": 180
	  },
	  "facing=west,half=lower,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_bottom_right_open",
		"y": 90
	  },
	  "facing=west,half=upper,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_top_left",
		"y": 180
	  },
	  "facing=west,half=upper,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_top_left_open",
		"y": 270
	  },
	  "facing=west,half=upper,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_top_right",
		"y": 180
	  },
	  "facing=west,half=upper,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_top_right_open",
		"y": 90
	  }
	}
  }`
}

function generateOldDoorBlockState(block, namespace, baseBlock) {
	return `{
	"variants": {
	  "facing=east,half=lower,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_bottom"
	  },
	  "facing=east,half=lower,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_bottom_hinge",
		"y": 90
	  },
	  "facing=east,half=lower,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_bottom_hinge"
	  },
	  "facing=east,half=lower,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_bottom",
		"y": 270
	  },
	  "facing=east,half=upper,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_top"
	  },
	  "facing=east,half=upper,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_top_hinge",
		"y": 90
	  },
	  "facing=east,half=upper,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_top_hinge"
	  },
	  "facing=east,half=upper,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_top",
		"y": 270
	  },
	  "facing=north,half=lower,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_bottom",
		"y": 270
	  },
	  "facing=north,half=lower,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_bottom_hinge"
	  },
	  "facing=north,half=lower,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_bottom_hinge",
		"y": 270
	  },
	  "facing=north,half=lower,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_bottom",
		"y": 180
	  },
	  "facing=north,half=upper,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_top",
		"y": 270
	  },
	  "facing=north,half=upper,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_top_hinge"
	  },
	  "facing=north,half=upper,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_top_hinge",
		"y": 270
	  },
	  "facing=north,half=upper,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_top",
		"y": 180
	  },
	  "facing=south,half=lower,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_bottom",
		"y": 90
	  },
	  "facing=south,half=lower,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_bottom_hinge",
		"y": 180
	  },
	  "facing=south,half=lower,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_bottom_hinge",
		"y": 90
	  },
	  "facing=south,half=lower,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_bottom"
	  },
	  "facing=south,half=upper,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_top",
		"y": 90
	  },
	  "facing=south,half=upper,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_top_hinge",
		"y": 180
	  },
	  "facing=south,half=upper,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_top_hinge",
		"y": 90
	  },
	  "facing=south,half=upper,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_top"
	  },
	  "facing=west,half=lower,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_bottom",
		"y": 180
	  },
	  "facing=west,half=lower,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_bottom_hinge",
		"y": 270
	  },
	  "facing=west,half=lower,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_bottom_hinge",
		"y": 180
	  },
	  "facing=west,half=lower,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_bottom",
		"y": 90
	  },
	  "facing=west,half=upper,hinge=left,open=false": {
		"model": "${namespace}:block/${block}_top",
		"y": 180
	  },
	  "facing=west,half=upper,hinge=left,open=true": {
		"model": "${namespace}:block/${block}_top_hinge",
		"y": 270
	  },
	  "facing=west,half=upper,hinge=right,open=false": {
		"model": "${namespace}:block/${block}_top_hinge",
		"y": 180
	  },
	  "facing=west,half=upper,hinge=right,open=true": {
		"model": "${namespace}:block/${block}_top",
		"y": 90
	  }
	}
  }`
}

function generateTrapdoorBlockState(block, namespace, baseBlock) {
	return `{
	"variants": {
	  "facing=east,half=bottom,open=false": {
		"model": "${namespace}:block/${block}_bottom",
		"y": 90
	  },
	  "facing=east,half=bottom,open=true": {
		"model": "${namespace}:block/${block}_open",
		"y": 90
	  },
	  "facing=east,half=top,open=false": {
		"model": "${namespace}:block/${block}_top",
		"y": 90
	  },
	  "facing=east,half=top,open=true": {
		"model": "${namespace}:block/${block}_open",
		"x": 180,
		"y": 270
	  },
	  "facing=north,half=bottom,open=false": {
		"model": "${namespace}:block/${block}_bottom"
	  },
	  "facing=north,half=bottom,open=true": {
		"model": "${namespace}:block/${block}_open"
	  },
	  "facing=north,half=top,open=false": {
		"model": "${namespace}:block/${block}_top"
	  },
	  "facing=north,half=top,open=true": {
		"model": "${namespace}:block/${block}_open",
		"x": 180,
		"y": 180
	  },
	  "facing=south,half=bottom,open=false": {
		"model": "${namespace}:block/${block}_bottom",
		"y": 180
	  },
	  "facing=south,half=bottom,open=true": {
		"model": "${namespace}:block/${block}_open",
		"y": 180
	  },
	  "facing=south,half=top,open=false": {
		"model": "${namespace}:block/${block}_top",
		"y": 180
	  },
	  "facing=south,half=top,open=true": {
		"model": "${namespace}:block/${block}_open",
		"x": 180,
		"y": 0
	  },
	  "facing=west,half=bottom,open=false": {
		"model": "${namespace}:block/${block}_bottom",
		"y": 270
	  },
	  "facing=west,half=bottom,open=true": {
		"model": "${namespace}:block/${block}_open",
		"y": 270
	  },
	  "facing=west,half=top,open=false": {
		"model": "${namespace}:block/${block}_top",
		"y": 270
	  },
	  "facing=west,half=top,open=true": {
		"model": "${namespace}:block/${block}_open",
		"x": 180,
		"y": 90
	  }
	}
  }`
}


function generateBlockModel(block, namespace, texture, model, render_type) {
	if (model === undefined) {
		model = "minecraft:block/cube_all"
	}
	if (render_type === undefined) {
		render_type = ""
	}
	else {
		render_type = `,${render_type}`
	}
	// Extract namespace and block from texture, if present.
	if (texture.includes(":")) {
		namespace = texture.split(":")[0]
		block = texture.split(":")[1]
	}
	// Override for Grass Turf for colour provider tinting.
	if (texture.includes("minecraft:grass_block_top")) {
		return readFile(`./overrides/models/grass_turf.json`)
	}

	return `{
	"parent": "${model}",
	"textures": {
	  "all": "${namespace}:block/${block}"
	}${render_type}
  }`

}

function generateCraftingTableBlockModel(block, namespace, baseBlock, altNamespace) {
	return `{
	"parent": "minecraft:block/cube",
	"textures": {
	  "particle": "${namespace}:block/${block}_front",
	  "north": "${namespace}:block/${block}_front",
	  "south": "${namespace}:block/${block}_side",
	  "east": "${namespace}:block/${block}_side",
	  "west": "${namespace}:block/${block}_front",
	  "up": "${namespace}:block/${block}_top",
	  "down": "${altNamespace}:block/${baseBlock}"
	}
  }`
}

function generateCubeColumnBlockModel(block, namespace, baseBlock, model) {
	return `{
	"parent": "minecraft:block/${model}",
	"textures": {
	  "end": "${namespace}:block/${block}_top",
	  "side": "${namespace}:block/${block}"
	}
  }`
}

function generateLeverBlockModel(block, namespace, baseBlock, altNamespace, addon) {
	if (addon === undefined) {
		addon = ""
	}
	else {
		addon = `_${addon}`
		if (addon === "_wall") {
			let wallName = baseBlock + "_wall"
			if (altNamespace !== vanillaNamespace) {
				return `{
		  "parent": "${altNamespace}:block/${baseBlock}_wall",
		  "render_type": "cutout"
	  }`
			}
			else {
				const torchBlock = baseBlock.replace("torch", "wall_torch")
				return `{
		  "parent": "${altNamespace}:block/${torchBlock}",
		  "render_type": "cutout"
	  }`
			}

		}
		else if (addon === "_upright") {
			return `{
		"parent": "${altNamespace}:block/${baseBlock}",
		"render_type": "cutout"
	}`
		}
		else {
			return `{
		"parent": "pyrite:block/template_torch_lever${addon}",
		"textures": {
		  "texture": "${altNamespace}:block/${baseBlock}"
		},
		"render_type": "cutout"
	  }`
		}
	}
	return `{
	"parent": "pyrite:block/template_torch_lever${addon}",
	"textures": {
	  "texture": "${altNamespace}:block/${baseBlock}"
	},
	"render_type": "cutout"
  }`


}


function generateTorchBlockModel(block, namespace, baseBlock, altNamespace, addon) {

	return `{
	"parent": "minecraft:block/${addon}",
	"textures": {
	  "torch": "${altNamespace}:block/${baseBlock}"
	},
	"render_type": "cutout"
  }`


}

function generateFlowerBlockModel(block, namespace) {
	return `{
	"parent": "minecraft:block/cross",
	"textures": {
	  "cross": "${namespace}:block/${block}"
	}
  }`
}



function generateLogModel(block, namespace, baseBlock, model) {
	return `{
	"parent": "minecraft:block/${model}",
	"textures": {
	  "end": "${namespace}:block/${block}_top",
	  "side": "minecraft:block/mushroom_stem"
	}
  }`
}

function generateFenceBlockState(block, namespace, baseBlock) {

	return `{
	"multipart": [
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_post"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "uvlock": true
		},
		"when": {
		  "north": "true"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "uvlock": true,
		  "y": 90
		},
		"when": {
		  "east": "true"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "uvlock": true,
		  "y": 180
		},
		"when": {
		  "south": "true"
		}
	  },
	  {
		"apply": {
		  "model": "${namespace}:block/${block}_side",
		  "uvlock": true,
		  "y": 270
		},
		"when": {
		  "west": "true"
		}
	  }
	]
  }`
}
function generateButtonBlockState(block, namespace, baseBlock) {
	return `{
  "variants": {
	"face=ceiling,facing=east,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "x": 180,
	  "y": 270
	},
	"face=ceiling,facing=east,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "x": 180,
	  "y": 270
	},
	"face=ceiling,facing=north,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "x": 180,
	  "y": 180
	},
	"face=ceiling,facing=north,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "x": 180,
	  "y": 180
	},
	"face=ceiling,facing=south,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "x": 180
	},
	"face=ceiling,facing=south,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "x": 180
	},
	"face=ceiling,facing=west,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "x": 180,
	  "y": 90
	},
	"face=ceiling,facing=west,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "x": 180,
	  "y": 90
	},
	"face=floor,facing=east,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "y": 90
	},
	"face=floor,facing=east,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "y": 90
	},
	"face=floor,facing=north,powered=false": {
	  "model": "${namespace}:block/${block}"
	},
	"face=floor,facing=north,powered=true": {
	  "model": "${namespace}:block/${block}_pressed"
	},
	"face=floor,facing=south,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "y": 180
	},
	"face=floor,facing=south,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "y": 180
	},
	"face=floor,facing=west,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "y": 270
	},
	"face=floor,facing=west,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "y": 270
	},
	"face=wall,facing=east,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "uvlock": true,
	  "x": 90,
	  "y": 90
	},
	"face=wall,facing=east,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "uvlock": true,
	  "x": 90,
	  "y": 90
	},
	"face=wall,facing=north,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "uvlock": true,
	  "x": 90
	},
	"face=wall,facing=north,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "uvlock": true,
	  "x": 90
	},
	"face=wall,facing=south,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "uvlock": true,
	  "x": 90,
	  "y": 180
	},
	"face=wall,facing=south,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "uvlock": true,
	  "x": 90,
	  "y": 180
	},
	"face=wall,facing=west,powered=false": {
	  "model": "${namespace}:block/${block}",
	  "uvlock": true,
	  "x": 90,
	  "y": 270
	},
	"face=wall,facing=west,powered=true": {
	  "model": "${namespace}:block/${block}_pressed",
	  "uvlock": true,
	  "x": 90,
	  "y": 270
	}
  }
}`}

function generateFenceGateBlockState(block, namespace) {
	return `{
	"variants": {
	"facing=east,in_wall=false,open=false": {
	  "model": "${namespace}:block/${block}",
	  "uvlock": true,
	  "y": 270
	},
	"facing=east,in_wall=false,open=true": {
	  "model": "${namespace}:block/${block}_open",
	  "uvlock": true,
	  "y": 270
	},
	"facing=east,in_wall=true,open=false": {
	  "model": "${namespace}:block/${block}_wall",
	  "uvlock": true,
	  "y": 270
	},
	"facing=east,in_wall=true,open=true": {
	  "model": "${namespace}:block/${block}_wall_open",
	  "uvlock": true,
	  "y": 270
	},
	"facing=north,in_wall=false,open=false": {
	  "model": "${namespace}:block/${block}",
	  "uvlock": true,
	  "y": 180
	},
	"facing=north,in_wall=false,open=true": {
	  "model": "${namespace}:block/${block}_open",
	  "uvlock": true,
	  "y": 180
	},
	"facing=north,in_wall=true,open=false": {
	  "model": "${namespace}:block/${block}_wall",
	  "uvlock": true,
	  "y": 180
	},
	"facing=north,in_wall=true,open=true": {
	  "model": "${namespace}:block/${block}_wall_open",
	  "uvlock": true,
	  "y": 180
	},
	"facing=south,in_wall=false,open=false": {
	  "model": "${namespace}:block/${block}",
	  "uvlock": true
	},
	"facing=south,in_wall=false,open=true": {
	  "model": "${namespace}:block/${block}_open",
	  "uvlock": true
	},
	"facing=south,in_wall=true,open=false": {
	  "model": "${namespace}:block/${block}_wall",
	  "uvlock": true
	},
	"facing=south,in_wall=true,open=true": {
	  "model": "${namespace}:block/${block}_wall_open",
	  "uvlock": true
	},
	"facing=west,in_wall=false,open=false": {
	  "model": "${namespace}:block/${block}",
	  "uvlock": true,
	  "y": 90
	},
	"facing=west,in_wall=false,open=true": {
	  "model": "${namespace}:block/${block}_open",
	  "uvlock": true,
	  "y": 90
	},
	"facing=west,in_wall=true,open=false": {
	  "model": "${namespace}:block/${block}_wall",
	  "uvlock": true,
	  "y": 90
	},
	"facing=west,in_wall=true,open=true": {
	  "model": "${namespace}:block/${block}_wall_open",
	  "uvlock": true,
	  "y": 90
	}
}}`}

function generateTrapdoorBlockModels(block, namespace, baseBlock, modelID) {
	return `{
	"parent": "minecraft:block/${modelID}",
	"textures": {
	  "texture": "${namespace}:block/${block}"
	},
	"render_type": "cutout"
  }`

}

function generateDoorBlockModels(block, namespace, baseBlock, modelID) {
	return `{
	"parent": "minecraft:block/${modelID}",
	"textures": {
	  "bottom": "${namespace}:block/${block}_bottom",
	  "top": "${namespace}:block/${block}_top"
	},
	"render_type": "cutout"
  }`
}

function getDyeNamespace(dye) {
	if (dye.includes(":")) {
		return dye.split(":")[0]
	}
	if (dye.includes("terracotta")) {
		dye = dye.replace("terracotta", "dye")
	}
	if (!dye.includes("_dye")) {
		dye = dye + "_dye"
	}

	if ((dye === "glow_dye") || (dye === "dragon_dye") || (dye === "star_dye") || (dye === "honey_dye") || (dye === "rose_dye") || (dye === "nostalgia_dye") || (dye === "poisonous_dye")) {
		return globalNamespace
	}
	else {
		return vanillaNamespace
	}
}

function getAltNamespace(namespace, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	return altNamespace
}

function id(namespace, path) {
	if (path === undefined) {
		return id(globalNamespace, namespace)
	}
	// If path somehow includes an identifier already, use the path instead.
	if (path.includes(":")) {
		return path
	}
	// If not, create a new identified path.
	return namespace + ":" + path
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