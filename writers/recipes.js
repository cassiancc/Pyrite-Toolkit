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

function writeShapelessRecipe(ingredients, result, quantity, addon) {
	if (addon === undefined) {
		addon = ""
	}
	let recipe = recipeHelper.generateShapelessRecipe(ingredients, result, quantity)
	if ((recipe !== "")) {
		if (result.includes(":")) {
			result = result.split(":")[1]
		}
		helpers.writeFile(`${helpers.recipePath}${result}${addon}.json`, recipe)
	}
}

function writeStonecutterRecipes(block, ingredient, quantity, addon) {
	if (block === ingredient) {
		return
	}
	if (addon === undefined) { addon = "" } else { addon = addon + "_" }
	let path;
	if (!block.includes(":")) {
		path = block
		block = id(block)
	}
	else {
		path = block.split(":")[1]
	}
	const recipe = recipeHelper.generateStonecutterRecipe(block, ingredient, quantity, "stonecutting")
	const fullPath = `${addon}${path}_stonecutting`
	writeRecipeAdvancement(id(fullPath), ingredient)
	if (recipe !== undefined) {
		helpers.writeFile(helpers.recipePath + fullPath +`.json`, recipe)
	}
}

module.exports = {
    writeRecipes: writeRecipes,
    writeShapedRecipe, writeShapedRecipe,
    writeShapelessRecipe, writeShapelessRecipe,
    writeStonecutterRecipes, writeStonecutterRecipes
}