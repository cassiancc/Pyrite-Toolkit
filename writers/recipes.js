const recipeHelper = require('../helpers/recipes');
const helpers = require('../helpers/helpers');
const { writeRecipeAdvancement } = require('./advancements');

const id = helpers.id

function writeRecipes(block, type, other, namespace, altNamespace) {
	let recipe = recipeHelper.generateRecipes(block, type, other, namespace, altNamespace)
	if ((recipe !== "")) {
		if (block.includes(":")) {
			block = block.split(":")[1]
		}
		let recipePath = helpers.recipePath
		if (altNamespace == "aether") {
			recipePath = recipePath.replace("pyrite", "aether")
		}
		helpers.writeFile(`${recipePath}${block}.json`, recipe)
	}
}

function writeShapedRecipe(ingredients, result, quantity, shape, pattern) {
	let recipe = recipeHelper.generateShapedRecipe(ingredients, result, quantity, shape, pattern)
	if ((recipe !== "")) {
		if (result.includes(":")) {
			result = result.split(":")[1]
		}
		helpers.writeFile(`${helpers.recipePath}${result}.json`, recipe)
	}
}

function writeShapelessRecipe(ingredients, result, quantity, addon, components) {
	if (addon === undefined) {
		addon = ""
	}
	let recipe = recipeHelper.generateShapelessRecipe(ingredients, result, quantity, components)
	if ((recipe !== "")) {
		if (result.includes(":")) {
			result = result.split(":")[1]
		}
		helpers.writeFile(`${helpers.recipePath}${result}${addon}.json`, recipe)
	}
}

function writeDyeRecipe(ingredient, result, dye, addon) {
	if (addon === undefined) {
		addon = ""
	}
	const dyeID = id(helpers.getDyeNamespace(dye), dye) + "_dye"
	let recipe =  recipeHelper.generateDyeRecipe(result, ingredient, dyeID)

	if ((recipe !== "")) {
		if (result.includes(":")) {
			result = result.split(":")[1]
		}
		helpers.writeFile(`${helpers.recipePath}${result}${addon}.json`, recipe)
	}
}

function writeStonecutterRecipe(block, ingredient, quantity, addonBefore, addonAfter) {
	if (block === ingredient) {
		return
	}
	if (addonBefore === undefined) { addonBefore = "" } else { addonBefore = addonBefore + "_" }
	if (addonAfter === undefined) { addonAfter = "" } else { addonAfter = "_" + addonAfter }
	let path;
	if (!block.includes(":")) {
		path = block
		block = id(block)
	}
	else {
		path = block.split(":")[1]
	}
	const recipe = recipeHelper.generateStonecutterRecipe(block, ingredient, quantity, "stonecutting")
	const fullPath = `${addonBefore}${path}_stonecutting${addonAfter}`
	writeRecipeAdvancement(id(fullPath), ingredient)
	if (recipe !== undefined) {
		helpers.writeFile(helpers.recipePath + fullPath +`.json`, recipe)
	}
}

function writeStonecutterRecipes(blocks, ingredient, quantity, addonBefore, addonAfter) {
	if (blocks instanceof Array) {
		blocks.forEach(block => {
			writeStonecutterRecipe(block, ingredient, quantity, addonBefore, addonAfter)
		});
	}
	else {
		writeStonecutterRecipe(blocks, ingredient, quantity, addonBefore, addonAfter)
	}
}

function writeShortcutRecipes(blocks, baseBlockID) {
	let blockSet = [];
	const baseBlock = helpers.getPath(baseBlockID)
	blocks.forEach(function(block) {
		blockSet.push(baseBlock + "_" + block)
	})
	writeStonecutterRecipes(blockSet, baseBlockID, 1, undefined, "from_"+baseBlock)
}

module.exports = {
    writeRecipes: writeRecipes,
    writeShapedRecipe, writeShapedRecipe,
    writeShapelessRecipe, writeShapelessRecipe,
    writeStonecutterRecipe: writeStonecutterRecipe, 
	writeStonecutterRecipes: writeStonecutterRecipes,
	writeDyeRecipe: writeDyeRecipe,
	writeShortcutRecipes: writeShortcutRecipes
}