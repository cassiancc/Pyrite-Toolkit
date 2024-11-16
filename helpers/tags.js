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
	let dir = `${helpers.basePath()}/data/${namespace}/tags/${folder}/`
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
	if (!fs.existsSync(path)) {
		// If not, create an empty tag.
		fs.writeFileSync(path, JSON.stringify({ "replace": false, "values": [] }), function (err) { if (err) throw err; })
	}
	// Read the tag file.
	const currentTag = readFileAsJson(path)
	// Check if the namespaced string is already in the tag.
	if (!currentTag.values.includes(arg) && !(currentTag.values.some(e => e.id === arg))) {
		// If not, add it to the tag.
		if (optional === true) {
			currentTag.values.push({ "id": arg, "optional": true })
		}
		else {
			currentTag.values.push(arg)
		}
		// Write new tag file to disk.
		fs.writeFileSync(path, JSON.stringify(currentTag))
	}
}
function tagBlock(block, tag, optional) {
	tagContent(block, tag, "block", optional)
}
function tagBlocks(blocks, tag, optional) {
	blocks.forEach(function(block) {
		tagBlock(block, tag, optional)
	})
}
function tagItem(item, tag, optional) {
	tagContent(item, tag, "item", optional)
}
function tagItems(items, tag, optional) {
	items.forEach(function(block) {
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

function checkAndAddStainedTag(block, baseBlock) {
	block = getPath(block)
	baseBlock = getPath(block)
	if (block.includes("stained")) {
		const colour = baseBlock.split("_stained")[0]
		if (dyes.includes(colour)) {
			tagBoth(block, `c:dyed/${colour}`)
		}
	}
}
function checkAndAddDyedTag(block, baseBlock) {
	block = getPath(block)
	baseBlock = getPath(block)
	let colour;
	if (baseBlock.includes("light_blue")) {
		colour = "light_blue"
	}
	if (baseBlock.includes("light_gray")) {
		colour = "light_gray"
	}
	else {
		colour = baseBlock.split("_")[0]
	}
	if (dyes.includes(colour)) {
		tagBoth(block, `c:dyed/${colour}`)
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
    
    checkAndAddDyedTag: checkAndAddDyedTag
}