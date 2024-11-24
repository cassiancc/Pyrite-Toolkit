const helpers = require('../helpers/helpers');
const mc = helpers.mc
const modID = helpers.modID
const id = helpers.id

function writeUniqueItemModel(block) {
	if (helpers.versionAbove("1.21.4")) {
		writeWinterDropItem(modID, "item", block, block)
	}
	let modelItem = `{"parent": "minecraft:item/generated","textures": {"layer0": "${modID}:item/${block}"}}`
	helpers.writeFile(`${helpers.paths.itemModels}${block}.json`, modelItem);
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
	if (helpers.versionAbove("1.21.4")) {
		writeWinterDropItem(altNamespace, "item", block, baseBlock)
	}
	const modelItem = `{"parent": "minecraft:item/generated","textures": {"layer0": "${altNamespace}:block/${baseBlock}"}}`
	helpers.writeFile(`${helpers.paths.itemModels}${block}.json`, modelItem)
}

function writeInventoryModel(block, namespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (helpers.versionAbove("1.21.4")) {
		writeWinterDropItem(namespace, "block", block, `${block}_inventory`)
	}
	else {
		const modelItem = `{"parent": "${namespace}:block/${block}_inventory"}`
		helpers.writeFile(`${helpers.paths.itemModels}${block}.json`, modelItem);
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
	helpers.writeFile(`${helpers.paths.assets}items/${path}.json`, item);
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
	const blockPath = helpers.getPath(block)
	if (helpers.versionAbove("1.21.4")) {
		writeWinterDropItem(namespace, "block", blockPath)
		const modelItem = { "parent": "minecraft:item/generated", "textures": { "layer0": `${namespace}:block/${modelSubdirectory}${blockPath}` } }
		helpers.writeFile(`${helpers.paths.itemModels}${blockPath}.json`, modelItem);
	}
	else {
		const modelItem = `{"parent": "${namespace}:block/${modelSubdirectory}${blockPath}"}`
		helpers.writeFile(`${helpers.paths.itemModels}${blockPath}.json`, modelItem);
	}
}

function writeTrapdoorItemModel(block, namespace) {
	if (helpers.versionAbove("1.21.4")) {
		writeWinterDropItem(namespace, "block", block, `${block}_bottom`)
	}
	let modelItem = `{
		"parent": "${namespace}:block/${block}_bottom"
	  }`
      helpers.writeFile(`${helpers.paths.itemModels}${block}.json`, modelItem);
}

module.exports = {
    writeUniqueBlockItemModel: writeUniqueBlockItemModel,
    writeInventoryModel: writeInventoryModel,
    writeUniqueItemModel: writeUniqueItemModel,
    writeBlockItemModel: writeBlockItemModel,
    writeTrapdoorItemModel: writeTrapdoorItemModel
}