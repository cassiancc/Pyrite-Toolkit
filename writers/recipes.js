const recipeHelper = require('../helpers/recipes');
const helpers = require('../helpers/helpers');

const id = helpers.id


function writeRecipes(block, type, other, namespace, altNamespace) {
	let recipe = recipeHelper.generateRecipes(block, type, other, namespace, altNamespace)
	if ((recipe !== "")) {
		if (block.includes(":")) {
			block = block.split(":")[1]
		}
		helpers.writeFile(`${helpers.recipePath}${block}.json`, recipe)
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

function writeShapelessRecipe(ingredients, result, quantity) {
	let recipe = recipeHelper.generateShapelessRecipe(ingredients, result, quantity)
	if ((recipe !== "")) {
		if (result.includes(":")) {
			result = result.split(":")[1]
		}
		helpers.writeFile(`${helpers.recipePath}${result}.json`, recipe)
	}
}

function writeStonecutterRecipes(block, ingredient, quantity, addon) {
	let path;
	if (addon === undefined) { addon = "" } else { addon = addon + "_" }
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

	// Overrides for Quartz and COpper
	if (ingredient.includes("quartz")) {
		ingredient = ingredient.replace("_bottom", "")
		ingredient = ingredient.replace("_top", "")
	}
	else if (ingredient == "minecraft:copper") { ingredient = "minecraft:copper_block" }

	const recipe = `{"type": "minecraft:stonecutting","ingredient": {"item": "${ingredient}"},"result": {"id": "${block}","count": ${quantity}}}`
	helpers.writeFile(`${helpers.recipePath}${addon}${path}_stonecutting.json`, recipe)

}

module.exports = {
    writeRecipes: writeRecipes,
    writeShapedRecipe, writeShapedRecipe,
    writeShapelessRecipe, writeShapelessRecipe,
    writeStonecutterRecipes, writeStonecutterRecipes
}