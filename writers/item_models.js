const helpers = require('../helpers/helpers');
const mc = helpers.mc
const modID = helpers.modID
const id = helpers.id

// Writes an block item model for items (e.g. dye), creating a client item (1.21.4+) and item model.
function writeGeneratedItemModel(item) {
	if (helpers.versionAbove("1.21.4")) {
		writeClientItem(modID, "item", item, item)
	}
	let modelItem = `{"parent": "minecraft:item/generated","textures": {"layer0": "${modID}:item/${item}"}}`
	helpers.writeFile(`${helpers.paths.itemModels}${item}.json`, modelItem);
}

// Writes an block item model for blocks with a unique inventory model (e.g. signs), creating a client item (1.21.4+) and item model.
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
	if (helpers.versionAbove("1.21.4")) {
		writeClientItem(altNamespace, "item", block, baseBlock)
	}
	const modelItem = `{"parent": "minecraft:item/generated","textures": {"layer0": "${altNamespace}:block/${baseBlock}"}}`
	helpers.writeFile(`${helpers.paths.itemModels}${block}.json`, modelItem)
}

// Writes an block item model for blocks with a different inventory model (e.g. walls), passing data to create either a client item or legacy item model, depending on the version.
function writeInventoryModel(block, namespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (helpers.versionAbove("1.21.4")) {
		writeClientItem(namespace, "block", block, `${block}_inventory`)
	}
	else {
		const modelItem = `{"parent": "${namespace}:block/${block}_inventory"}`
		helpers.writeFile(`${helpers.paths.itemModels}${block}.json`, modelItem);
	}
}

// Writes a 1.21.4+ compatible "client item". Client Items handle item rendering in a way similar to blockstates (but for items)
function writeClientItem(namespace, folder, path, model) {
	if (model == undefined) {
		model = path
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
	if ((altNamespace != "pyrite") && (altNamespace != "minecraft")) {
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
    writeTrapdoorItemModel: writeTrapdoorItemModel
}