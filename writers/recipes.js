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

function writeShapedRecipe(ingredients, result, quantity, shape, overrideNamespace, customLoadedChecks) {
	if (overrideNamespace == undefined) {
		namespace = helpers.modID
	}
	else namespace = overrideNamespace
	let recipe = recipeHelper.generateShapedRecipe(ingredients, result, quantity, shape, customLoadedChecks)
	if ((recipe !== "")) {
		if (result.includes(":")) {
			result = result.split(":")[1]
		}
		helpers.writeFile(`${helpers.getRecipePath(namespace)}${result}.json`, recipe)
	}
}

function writeShapelessRecipe(ingredients, result, quantity, addon, components, recipeCategory, customLoadedChecks) {
	if (addon === undefined) {
		addon = ""
	}
	let recipe = recipeHelper.generateShapelessRecipe(ingredients, result, quantity, components, recipeCategory, customLoadedChecks)
	if ((recipe !== "")) {
		if (result.includes(":")) {
			result = result.split(":")[1]
		}
		helpers.writeFile(`${helpers.recipePath}${result}${addon}.json`, recipe)
	}
}

function writeSmeltingRecipe(ingredient, result, type, cookingTime, experience, recipeCategory, fileNameSuffix) {
	if (fileNameSuffix === undefined) {
		fileNameSuffix = ""
	}
	if (type !== undefined) {
		fileNameSuffix += "_from_" +type
	}
	let recipe = recipeHelper.generateSmeltingRecipe(result, ingredient, type, cookingTime, experience, recipeCategory)
	if ((recipe !== "")) {
		if (result.includes(":")) {
			result = result.split(":")[1]
		}
		helpers.writeFile(`${helpers.recipePath}${result}${fileNameSuffix}.json`, recipe)
	}
}

function writeCampfireRecipe(ingredient, result, recipeCategory, cookingTime, experience, fileNameSuffix) {
	if (recipeCategory === undefined) {
		recipeCategory = "food"
	}
	if (cookingTime === undefined) {
		cookingTime = 600
	}
	if (experience === undefined) {
		experience = 0.35
	}

	writeSmeltingRecipe(ingredient, result, "campfire_cooking", cookingTime, experience, recipeCategory, fileNameSuffix)
}

function writeSmokingRecipe(ingredient, result, recipeCategory, cookingTime, experience, fileNameSuffix) {
	if (recipeCategory === undefined) {
		recipeCategory = "food"
	}
	if (cookingTime === undefined) {
		cookingTime = 100
	}
	if (experience === undefined) {
		experience = 0.1
	}

	writeSmeltingRecipe(ingredient, result, "smoking", cookingTime, experience, recipeCategory, fileNameSuffix)
}

function writeCuttingRecipe(ingredients, result, quantity, action) {
	helpers.writeFile(`${helpers.recipePath}cutting/${helpers.getPath(result)}_from_${helpers.getPath(ingredients.replace("#", "").replace("/", "_"))}.json`, recipeHelper.generateCuttingRecipe(ingredients, result, quantity, action))

}

function writeFoodCookingRecipes(ingredient, result, cookingTime, experience, recipeCategory, fileNameSuffix) {
	writeSmeltingRecipe(ingredient, result, undefined, cookingTime, experience, recipeCategory, fileNameSuffix)
	writeCampfireRecipe(ingredient, result, undefined, cookingTime, experience, fileNameSuffix)
	writeSmokingRecipe(ingredient, result, undefined, cookingTime, experience, fileNameSuffix)
}

function writeDyeRecipe(ingredient, result, dye, addon) {
	if (addon === undefined) {
		addon = ""
	}
	const dyeID = id("c", "dyes/"+ dye)
	let recipe =  recipeHelper.generateDyeRecipe(result, ingredient, dyeID)

	if ((recipe !== "")) {
		if (result.includes(":")) {
			result = result.split(":")[1]
		}
		helpers.writeFile(`${helpers.recipePath}${result}${addon}.json`, recipe)
	}
}

function writeStonecutterRecipe(block, ingredient, quantity, addonBefore, addonAfter, customLoadedChecks) {
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
	const recipe = recipeHelper.generateStonecutterRecipe(block, ingredient, quantity, "stonecutting", customLoadedChecks)
	const fullPath = `${addonBefore}${path}_stonecutting${addonAfter}`
	writeRecipeAdvancement(id(fullPath), ingredient)
	if (recipe !== undefined) {
		helpers.writeFile(helpers.recipePath + fullPath +`.json`, recipe)
	}
}

function writeStonecutterRecipes(blocks, ingredient, quantity, addonBefore, addonAfter, customLoadedChecks) {
	if (blocks instanceof Array) {
		blocks.forEach(block => {
			writeStonecutterRecipe(block, ingredient, quantity, addonBefore, addonAfter, customLoadedChecks)
		});
	}
	else {
		writeStonecutterRecipe(blocks, ingredient, quantity, addonBefore, addonAfter, customLoadedChecks)
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
	writeSmeltingRecipe: writeSmeltingRecipe,
	writeFoodCookingRecipes: writeFoodCookingRecipes,
    writeStonecutterRecipe: writeStonecutterRecipe, 
	writeStonecutterRecipes: writeStonecutterRecipes,
	writeDyeRecipe: writeDyeRecipe,
	writeShortcutRecipes: writeShortcutRecipes,
	writeCuttingRecipe: writeCuttingRecipe
}