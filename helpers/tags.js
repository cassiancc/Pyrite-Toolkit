const { vanillaResourceBlocks: vanillaResources } = require('./constants');
const helpers = require('./helpers');
const fs = require('fs');
const id = helpers.id
const getPath = helpers.getPath
const readFileAsJson = helpers.readFileAsJson
const modID = helpers.modID;

const vanillaDyes = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"]

const modDyes = ["glow", "dragon", "star", "honey", "nostalgia", "rose", "poisonous",]

const dyes = vanillaDyes.concat(modDyes)

function tagContent(arg, tag, folder, optional) {
	// Ensure all IDs are properly namespaced strings
	if (!arg.includes(":")) {
		arg = id(modID, arg)
	}
	let namespace;
	if (tag.includes(":")) {
		namespace = tag.split(":")[0];
		tag = tag.split(":")[1];
	}
	else {
		namespace = modID;
	}
	// Create path to tag file.
	let dir = `${helpers.paths.base}/data/${namespace}/tags/${folder}/`
	if (tag.includes("/")) {
		dir += tag.split("/")[0];
		tag = tag.split("/")[1];
	}
	let path = `${dir}/${tag}.json`
	// Ensure tag folder exists
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}
	// Ensure tag file exists
	const emptyTag = { "replace": false, "values": [] };
	if (!fs.existsSync(path)) {
		// If not, create an empty tag.
		fs.writeFileSync(path, JSON.stringify(emptyTag), function (err) { if (err) throw err; })
	}
	// Read the tag file.
	let currentTag = readFileAsJson(path)
	// Catch file read errors
	if (currentTag === undefined) {
		currentTag = emptyTag
	}
	// Check if the namespaced string is already in the tag.
	if (!currentTag.values.includes(arg) && !(currentTag.values.some(e => e.id === arg))) {
		// If not, add it to the tag.
		if (optional === true) {
			currentTag.values.push({ "id": arg, "required": false })
		}
		else {
			currentTag.values.push(arg)
		}
		// Write new tag file to disk.
		if (helpers.config.disableWriting === false) {
			if (!path.includes("undefined")) {
				fs.writeFileSync(path, JSON.stringify(currentTag))
			}
			else {
				console.log("Preventing write of " + path)
			}
		}
	}
}
function tagBlock(block, tag, optional) {
	tagContent(block, tag, "block" + helpers.getTrialPlural(), optional)
}
function tagBlocks(blocks, tag, optional) {
	blocks.forEach(function (block) {
		tagBlock(block, tag, optional)
	})
}
function tagItem(item, tag, optional) {
	tagContent(item, tag, "item" + helpers.getTrialPlural(), optional)
}
function tagItems(items, tag, optional) {
	items.forEach(function (item) {
		tagItem(item, tag, optional)
	})
}
function tagBoth(arg, tag, optional) {
	tagBlock(arg, tag, optional)
	tagItem(arg, tag, optional)
}
function tagBothFromArray(array, tag, optional) {
	tagBlocks(array, tag, optional)
	tagItems(array, tag, optional)
}

function checkAndAddStainedTag(block, baseBlock, optional) {
	if (optional == undefined) {
		optional = false
	}
	block = getPath(block)
	baseBlock = getPath(block)
	if (block.includes("stained")) {
		const colour = baseBlock.split("_stained")[0]
		if (dyes.includes(colour)) {
			tagBoth(block, `c:dyed/${colour}`, optional)
		}
	}
}


function checkAndAddBeaconTag(block, baseBlock) {
	if ((baseBlock == "iron") || (baseBlock == "gold") || (baseBlock == "emerald") || (baseBlock == "diamond") || (baseBlock == "netherite")) {
		tagBlock(block, `minecraft:beacon_base_blocks`)
	}
}

function checkAndAddResourceTag(block, baseBlock, optionality) {
	let base = getPath(baseBlock);
	if (base.includes("smooth_"))
		base = base.replace("smooth_", "")
	if (base.includes("cut_"))
		base = base.replace("cut_", "")
	if (base.includes("waxed_"))
		base = base.replace("waxed_", "")
	if (base.includes("nostalgia_"))
		base = base.replace("nostalgia_", "")
	if (base.includes("_block"))
		base = base.replace("_block", "")
	if (vanillaResources.includes(base)) {
		tagBoth(block, base, optionality)
	}
}

function checkAndAddBlockTypeTag(block, baseBlock, blockType) {
	if (blockType == "planks") {
		tagBoth(block, "minecraft:planks")
		checkAndAddStainedTag(block, baseBlock)
	} else if (blockType == "wool") {
		tagBoth(block, "minecraft:wool")
	} else if (blockType == "terracotta") {
		tagBoth(block, "minecraft:terracotta")
	} else if ((blockType == "lamps") || (blockType == "lamp")) {
		tagBoth(block, "lamps")
		checkAndAddDyedTag(block, baseBlock)
	} else if (blockType.includes("resource_bricks")) {
		const blockType = baseBlock.split(":")[1].split("cut_")[1]
		tagBoth(block, blockType)
		checkAndAddBeaconTag(block, blockType)
	} else if (blockType.includes("bricks")) {
		if (blockType == "bricks") {
			tagBoth(block, "dyed_bricks")
		}
		else if (blockType.includes("nether")) {
			tagBoth(block, "c:bricks/nether", true)
		}
		tagBoth(block, "bricks")
		checkAndAddDyedTag(block, baseBlock)
	} else if (blockType == "stained_framed_glass") {
		tagBoth(block, "stained_framed_glass")
		checkAndAddStainedTag(block, baseBlock)
	} else if (blockType == "stained_glass") {
		tagBoth(block, "stained_glass")
		checkAndAddStainedTag(block, baseBlock)
	} else if (blockType.includes("turf") || blockType.includes("grass_block")) {
		if (blockType.includes("turf")) {
			tagBlock(block, "turf_blocks")
		}
		tagBoth(block, "minecraft:dirt", true)
	} else if (blockType.includes("gravel")) {
		tagBlock(block, "minecraft:bamboo_plantable_on", true)
		tagBlock(block, "minecraft:enderman_holdable", true)
	}
	else if (blockType.includes("netherrack")) {
		tagBlock(block, "minecraft:infiniburn_end", true)
		tagBlock(block, "minecraft:infiniburn_nether", true)
		tagBlock(block, "minecraft:infiniburn_overworld", true)
	} else if (blockType.includes("smooth_resource")) {
		const blockType = block.split("smooth_")[1]
		checkAndAddResourceTag(block, blockType)
		checkAndAddBeaconTag(block, blockType)
		tagBlock(block, "smooth_blocks")
	} else if (blockType.includes("cut_")) {
		const blockType = block.split("cut_")[1]
		checkAndAddResourceTag(block, blockType)
		checkAndAddBeaconTag(block, blockType)
		tagBlock(block, "cut_blocks")
	} else if (blockType.includes("obsidian")) {
		tagBlock(block, "obsidian")
	} else if (blockType == "nostalgia_resource") {
		tagBoth(block, block.split("nostalgia_")[1].split("_block")[0])
	}
}

function checkAndAddDyedTag(block, baseBlock, blockOnly) {
	block = getPath(block)
	baseBlock = getPath(block)
	let colour;
	if (baseBlock.includes("light_blue")) {
		colour = "light_blue"
	}
	if (baseBlock.includes("light_gray")) {
		colour = "light_gray"
	}
	if (baseBlock.includes("mushroom")) {
		return
	}
	if (baseBlock.includes("blue_nether")) {
		return
	}
	else {
		colour = baseBlock.split("_")[0]
	}
	if (dyes.includes(colour)) {
		if (blockOnly === true) {
			tagBlock(block, `c:dyed/${colour}`)
		}
		else {
			tagBoth(block, `c:dyed/${colour}`)
		}
	}
}

module.exports = {
	tagContent: tagContent,
	tagBlock: tagBlock,
	tagBlocks: tagBlocks,
	tagItem: tagItem,
	tagItems: tagItems,
	tagBoth: tagBoth,
	tagBothFromArray: tagBothFromArray,
	checkAndAddStainedTag: checkAndAddStainedTag,
	checkAndAddDyedTag: checkAndAddDyedTag,
	checkAndAddBeaconTag: checkAndAddBeaconTag,
	checkAndAddResourceTag: checkAndAddResourceTag,
	checkAndAddBlockTypeTag: checkAndAddBlockTypeTag
}