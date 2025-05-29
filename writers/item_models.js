const helpers = require('../helpers/helpers');
const models = require('./models');
const mc = helpers.mc
const modID = helpers.modID
const id = helpers.id

// Writes a generated item model for items (e.g. Pyrite's dye), creating a client item (1.21.4+) and item model.
function writeGeneratedItemModel(item) {
	if (helpers.versionAbove("1.21.4")) {
		writeClientItem(modID, "item", item, item)
	}
	writeProvidedItemModel(item, `{"parent": "minecraft:item/generated","textures": {"layer0": "${modID}:item/${item}"}}`)
}

const fish_sizes = 25;


// Writes the necessary item models for fish (Always a Bigger Fish), creating a client item (1.21.4+) and multiple item models of various scales.
function writeFishItemModels(item) {
	if (helpers.versionAbove("1.21.4")) {
		writeFishClientItem(item)
		var i = 0;
		var scale = 0.2;
		var scaleModel = [ scale, scale, scale ]
		while (i <= fish_sizes) {
			writeProvidedItemModel(`${item}_${i}`, {
				"parent": "minecraft:item/generated",
				"textures": {
					"layer0": `bigger_fish:item/${item}`
				},
				"display": {
					"firstperson_righthand": {
						"scale": scaleModel
					},
					"firstperson_lefthand": {
						"scale": scaleModel
					},
					"thirdperson_righthand": {
						"scale": scaleModel
					},
					"thirdperson_lefthand": {
						"scale": scaleModel
					},
					"fixed": {
						"scale": scaleModel
					},
					"ground": {
						"scale": scaleModel
					}
				}
			})
			i++;
			scale+=0.150
			scale = parseFloat(scale.toFixed(2)) 
			scaleModel = [ scale, scale, scale ]
		}
	} else { 
		// i'll figure out a way to translate these to overrides later
		writeProvidedItemModel(item, `{"parent": "minecraft:item/generated","textures": {"layer0": "${modID}:item/${item}"}}`)
	}
	
}

function writeFishClientItem(item) {
	const itemID = id(item)
	var model =	{
		"model": {
			"type": "minecraft:range_dispatch",
			"property": "minecraft:custom_model_data",
			"scale": 0.2,
			"entries": []
		}
	}
	var i = 0;
	while (i <= fish_sizes) {
		model.model.entries.push({
				"threshold": i,
				"model": {
				"type": "minecraft:model",
				"model": `${helpers.getNamespace(itemID)}:item/${helpers.getPath(itemID)}_${i}`
				}
			})
		i++;
	}
	writeProvidedClientItem(helpers.getPath(itemID), model)
}

function writeProvidedItemModel(item, modelItem) {
	helpers.writeFile(`${helpers.paths.itemModels}${item}.json`, modelItem);
}

// Writes an block item model for blocks with a unique inventory model (e.g. signs), creating a client item (1.21.4+) and item model.
function writeUniqueBlockItemModel(block, namespace, textureNamespace, texture) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (textureNamespace === undefined) {
		textureNamespace = namespace;
	}
	if (texture === undefined) {
		texture = block
	}
	if (helpers.versionAbove("1.21.4")) {
		writeClientItem(textureNamespace, "item", block, texture)
	}
	writeProvidedItemModel(block, `{"parent": "minecraft:item/generated","textures": {"layer0": "${textureNamespace}:block/${texture}"}}`)
}

// Writes an block item model for blocks with a different inventory model (e.g. walls), passing data to create either a client item or legacy item model, depending on the version.
function writeInventoryModel(block, namespace, baseBlockNamespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (helpers.versionAbove("1.21.4")) {
		writeClientItem(namespace, "block", block, `${block}_inventory`)
	}
	else {
		let modelSubdirectory = ""
		if (baseBlockNamespace != undefined) {
			if ((baseBlockNamespace != modID) && (baseBlockNamespace != "minecraft")) {
				modelSubdirectory = baseBlockNamespace + "/"
			}
		}
		const modelItem = `{"parent": "${namespace}:block/${modelSubdirectory}${block}_inventory"}`
		helpers.writeFile(`${helpers.paths.itemModels}${block}.json`, modelItem);
	}
}

// Writes a 1.21.4+ compatible "client item". Client Items handle item rendering in a way similar to blockstates (but for items)
function writeClientItem(namespace, folder, path, model) {
	if (model == undefined) {
		model = path
	}
	if (model.includes(":")) {
		namespace = helpers.getNamespace(model)
		model = helpers.getPath(model)
	}
	let tints;
	if (model.includes("grass")) {
		tints = [
			{
				"type": "minecraft:grass",
				"downfall": 1.0,
				"temperature": 0.5
			}
		]
	}
	const item =
	{
		"model": {
			"type": "minecraft:model",
			"model": `${namespace}:${folder}/${model}`,
			"tints": tints
		}
	}
	if (path.includes(":")) {
		namespace = helpers.getNamespace(path)
		path = helpers.getPath(path)
	}
	writeProvidedClientItem(path, item)
}

function writeProvidedClientItem(path, item) {
	helpers.writeFile(`${helpers.paths.assets}items/${path}.json`, item);
}

// Writes a block item model, passing data to create either a client item or legacy item model, depending on the version.
function writeBlockItemModel(block, namespace, altNamespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	let modelSubdirectory = ""
	if ((altNamespace != modID) && (altNamespace != "minecraft")) {
		modelSubdirectory = altNamespace + "/"
	}
	const blockPath = helpers.getPath(block)
	if (helpers.versionAbove("1.21.4")) {
		writeClientItem(namespace, "block", blockPath)
		const modelItem = { "parent": "minecraft:item/generated", "textures": { "layer0": `${namespace}:block/${modelSubdirectory}${blockPath}` } }
		helpers.writeFile(`${helpers.paths.itemModels}${blockPath}.json`, modelItem);
	}
	else {
		const modelItem = `{"parent": "${namespace}:block/${modelSubdirectory}${blockPath}"}`
		helpers.writeFile(`${helpers.paths.itemModels}${blockPath}.json`, modelItem);
	}
}

// Writes a trapdoor item model.
function writeTrapdoorItemModel(block, namespace) {
	if (helpers.versionAbove("1.21.4")) {
		writeClientItem(namespace, "block", block, `${block}_bottom`)
	}
	let modelItem = `{
		"parent": "${namespace}:block/${block}_bottom"
	  }`
      helpers.writeFile(`${helpers.paths.itemModels}${block}.json`, modelItem);
}

module.exports = {
    writeUniqueBlockItemModel: writeUniqueBlockItemModel,
    writeInventoryModel: writeInventoryModel,
    writeGeneratedItemModel: writeGeneratedItemModel,
    writeBlockItemModel: writeBlockItemModel,
    writeTrapdoorItemModel: writeTrapdoorItemModel,
	writeFishItemModels: writeFishItemModels
}