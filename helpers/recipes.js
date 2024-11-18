const helpers = require('./helpers');

const id = helpers.id
const getDyeNamespace = helpers.getDyeNamespace
const majorVersion = helpers.majorVersion
const minorVersion = helpers.minorVersion
const modID = helpers.modID
const mc = helpers.mc

function use21dot2Recipes() {
	if (((majorVersion === 21) && (minorVersion !== 1)) || (majorVersion > 21)) {
		return true;
	}
	else return false;
}

function usePre21dot1Recipes() {
	return !use21dot2Recipes()
}

function itemOrId() {
	if ((majorVersion <= 21)) {
		return "id";
	}
	else return "item";
}

function addIngredients(ingredientArray, ingredient) {
	if (use21dot2Recipes()) {
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

function generateModLoadCondition(mod) {
	return {
		"fabric:load_conditions": [
			{
				"condition": "fabric:all_mods_loaded",
				"values": [
					mod
				]
			}
		],
		"neoforge:conditions": [
				{
				"type": "neoforge:mod_loaded",
				"modid": mod
				}
			]
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
	let newIngredients = {}, loadCondition;
	if (usePre21dot1Recipes()) {
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
			const valueNamespace = value.split(":")[0]
			if ((valueNamespace !== modID) && (valueNamespace !== mc)) {
				loadCondition = generateModLoadCondition(valueNamespace)
			}
			Object.assign(newIngredients, JSON.parse(`{"${keys[i]}": {"${itemOrTag}": "${value}"}}`))
			i++
		})
	}
	else { 
		newIngredients = ingredients 
		if ((valueNamespace !== modID) && (valueNamespace !== mc)) {
			loadCondition = generateModLoadCondition(newIngredients.split(":")[0]);
		}
	}

	let recipe = {
		"type": "minecraft:crafting_shaped",
		"pattern": shape,
		"key": newIngredients

	}

	if (loadCondition != undefined) {
		Object.assign(recipe, loadCondition)
	}


	recipe.result = JSON.parse(`{"${itemOrId()}": "${result}","count": ${quantity}}`)

	return recipe
}

function createDyeRecipe(namespace, block, altNamespace, altBlock, other, baseNamespace) {
	if (baseNamespace === undefined) {
		baseNamespace = altNamespace
	}
	return generateShapedRecipe({ "C": id(baseNamespace, altBlock), "D": id(altNamespace, other) }, id(modID, block), 8, ["CCC", "CDC", "CCC"])
}

function generateRecipes(block, type, base, namespace, altNamespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	if (altNamespace === undefined) {
		altNamespace = modID
	}
	let recipe = ""

	// Fix Quartz texture IDs being used as part of the recipe
	if (base != undefined) {
		if (base.includes("quartz")) {
			base = base.replace("_bottom", "")
			base = base.replace("_top", "")
		}
	}

	if (type === "planks") {
		if ((base === "red_mushroom") || (base === "brown_mushroom")) {
			recipe = generateShapelessRecipe(`pyrite:${base}_stem`, id(namespace, block), 4)
		}
		else {
			base = base.replace("stained", "dye")
			altNamespace = getDyeNamespace(base)
			recipe = generateShapedRecipe({ "C": `#minecraft:planks`, "D": id(altNamespace, base) }, id(modID, block), 8, ["CCC", "CDC", "CCC"])
		}
	}
	else if (type === "ladder") {
		recipe = generateShapedRecipe({ "C": `minecraft:stick`, "D": id(altNamespace, base) }, id(namespace, block), 3, ["C C", "CDC", "C C"])
	}
	else if (type === "terracotta") {
		base = `${base}_dye`
		altNamespace = getDyeNamespace(base)
		recipe = createDyeRecipe(namespace, block, altNamespace, id(mc, "terracotta"), base)
	}
	else if (type === "concrete_powder") {
		base = `${base}_dye`
		altNamespace = getDyeNamespace(base)
		recipe = generateShapelessRecipe(["minecraft:sand", "minecraft:sand", "minecraft:sand", "minecraft:sand", "minecraft:gravel", "minecraft:gravel", "minecraft:gravel", "minecraft:gravel", id(altNamespace, base)], id(namespace, block), 8)
	}
	else if (type === "terracotta_bricks") {
		altNamespace = getDyeNamespace(base)
		recipe = generateShapedRecipe({ "C": id(altNamespace, base) }, id(namespace, block), 3, ["CC", "CC"])
	}
	else if (type === "torch") {
		base = `${base}_dye`
		altNamespace = getDyeNamespace(base)
		let ingredients = [id(altNamespace, base), id(mc, "torch")]
		let result = id(namespace, block)

		recipe = generateShapelessRecipe(ingredients, result, 1)
	}
	else if (type === "wool") {
		recipe = generateShapelessRecipe([id(modID, `${base}_dye`), "minecraft:white_wool"], id(namespace, block), 1)
	}
	else if (type === "torch_lever") {
		recipe = generateShapelessRecipe([id(altNamespace, base), "minecraft:lever"], id(namespace, block), 1)
	}
	else if (type === "cobblestone_bricks") {
		recipe = generateShapedRecipe({ "C": `minecraft:cobblestone` }, id(modID, `cobblestone_bricks`), 4, ["CC", "CC"])
	}
	else if (type === "smooth_stone_bricks") {
		recipe = generateShapedRecipe({ "C": `minecraft:smooth_stone` }, `pyrite:smooth_stone_bricks`, 4, ["CC", "CC"])
	}
	else if (type === "mossy_cobblestone_bricks") {
		recipe = generateShapelessRecipe(["pyrite:cobblestone_bricks", "minecraft:vine"], id(namespace, block), 1)
	}
	else if (type === "glowing_obsidian") {
		if (block === "glowing_obsidian") {
			recipe = generateShapedRecipe({ "X": `minecraft:crying_obsidian`, "#": `minecraft:magma_block` }, `pyrite:glowing_obsidian`, 4, ["X#", "#X"])
		}
		else {
			recipe = generateShapelessRecipe([ `pyrite:glowing_obsidian`, `pyrite:nostalgia_dye` ], `pyrite:nostalgia_glowing_obsidian`, 1)
		}
	}
	else if (type.includes("cut_")) {
		let baseBlock = type.split("_")[1]
		baseBlock = baseBlock + "_block"
		recipe = generateShapedRecipe({ "#": id(mc, baseBlock) }, id(modID, type), 4, ["##", "##"])
	}
	else if (type.includes("_turf")) {
		recipe = generateShapedRecipe({ "#": id(mc, base) }, id(modID, type), 4, ["##", "##"])
	}
	else if (type === "framed_glass") {
		recipe = generateShapedRecipe({ "#": `minecraft:glass`, "X": `minecraft:iron_nugget` }, id(modID, type), 4, [
			"X#X",
			"#X#",
			"X#X"
		])
	}
	else if ((type === "dyed_framed_glass") || (type === "stained_framed_glass")) {
		const dye = `${base}_dye`
		altNamespace = getDyeNamespace(dye)
		recipe = createDyeRecipe(namespace, block, altNamespace, "framed_glass", dye, namespace)
	}
	else if (type === "glass_pane") {
		const dye = `${base}_dye`
		altNamespace = getDyeNamespace(dye)
		recipe = generateShapedRecipe({ "C": id(namespace, block.replace("_pane", "")) }, id(namespace, block), 16, ["CCC", "CCC"])
	}
	else if (type === "lamps") {
		if (block === "glowstone_lamp") {
			recipe = generateShapedRecipe({ "#": `minecraft:glowstone`, "X": `minecraft:iron_nugget` }, id(modID, block), 4, [
				"X#X",
				"#X#",
				"X#X"
			])
		}
		else if (block === "lit_redstone_lamp") {
			// console.log(block)
			generateShapelessRecipe([id(mc, "redstone_torch"), id(mc, "redstone_lamp")], id(modID, block), 1)
		} 
		else {
			base = `${base}_dye`
			altNamespace = getDyeNamespace(base)
			recipe = createDyeRecipe(namespace, block, altNamespace, "glowstone_lamp", base, namespace)
		}

	}
	else if (type === "bricks") {
		base = `${base}_dye`
		altNamespace = getDyeNamespace(base)
		recipe = generateShapedRecipe({ "C": id(altNamespace, base), "D": `minecraft:bricks` }, `pyrite:${block}`, 4, ["CCC", "CDC", "CCC"])
	}
	else if (block === "charred_nether_bricks") {
		recipe = `{
			"type": "minecraft:smelting",
			"category": "blocks",
			"cookingtime": 200,
			"experience": 0.1,
			"ingredient": {
			"item": "minecraft:nether_bricks"
			},
			"result": {"id": "pyrite:charred_nether_bricks"}
		}`
	}
	else if (type === "blue_nether_bricks") {
		recipe = generateShapedRecipe({ "N": `minecraft:nether_brick`, "W": `minecraft:warped_fungus` }, `pyrite:${block}`, 1, [
			"NW",
			"WN"
		])
	}
	else if (type === "resource_bricks") {
		recipe = generateShapedRecipe({ "D": base }, id(namespace, block), 4, [
			"DD",
			"DD"
		])
	}
	else if (type === "chiseled_resource") {
		const n = base.split(":")[0]
		const ingredient = `cut_${base.split(":")[1].replace("_block", "_slab")}`
		recipe = generateShapedRecipe({ "D": id(modID, ingredient) }, id(namespace, block), 1, [
			"D",
			"D"
		])
	}
	else if (type === "resource_pillar") {
		if (base == "minecraft:copper") {
			base += "_block"
		}
		recipe = generateShapedRecipe({ "D": id(mc, base) }, id(namespace, block), 2, [
			"D",
			"D"
		])
	}
	else if (type === "bars") {
		let localID, cutBlockID;
		cutBlockID = `cut_${base}`
		if (block.includes("copper")) {
			localID = mc;
			cutBlockID = cutBlockID.replace("cut_weathered", "weathered_cut")
			cutBlockID = cutBlockID.replace("cut_oxidized", "oxidized_cut")
			cutBlockID = cutBlockID.replace("cut_exposed", "exposed_cut")
		}
		else { localID = modID }
		recipe = generateShapedRecipe({ "D": id(localID, cutBlockID) }, id(namespace, block), 32, [
			"DDD",
			"DDD"
		])
	}
	else if (type === "stairs") {
		recipe = generateShapedRecipe({ "C": id(modID, base) }, id(namespace, block), 4, [
			"C  ",
			"CC ",
			"CCC"
		])
	}
	else if (type === "wall") {
		if (!base.includes(":")) {
			base = id(base)
		}
		recipe = generateShapedRecipe({ "C": `${base}` }, id(namespace, block), 6, ["CCC","CCC"])
	}
	else if (type === "slabs") {
		recipe = generateShapedRecipe({ "C": id(modID, base) }, id(namespace, block), 6, ["CCC"])
	}
	else if (type === "plates") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, base) }, id(namespace, block), 1, ["CC"])
	}
	else if (type === "door") {
		base.replace("gold_block", "gold_ingot")
		base.replace("netherite_block", "netherite_ingot")
		recipe = generateShapedRecipe({ "C": id(altNamespace, base) }, id(namespace, block), 3, ["CC","CC","CC"])
	}
	else if (type === "crafting_table") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, base) }, id(namespace, block), 1, ["CC","CC"])
	}
	else if (type === "trapdoor") {
		base.replace("gold_block", "gold_ingot")
		base.replace("netherite_block", "netherite_ingot")
		recipe = generateShapedRecipe({ "C": id(altNamespace, base) }, id(namespace, block), 2, ["CCC","CCC"])
	}
	else if (type === "carpet") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, base) }, id(namespace, block), 3, ["CC"])
	}
	else if (type === "fences") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, base), "S": id(mc, "stick") }, id(namespace, block), 1, [
			"CSC",
			"CSC"
		])
	}
	else if (type === "fence_gates") {
		recipe = generateShapedRecipe({ "C": id(namespace, base), "S": `minecraft:stick` }, id(namespace, block), 1, [
			"SCS",
			"SCS"
		])
	}
	else if (type === "wall_gates") {
		let baseWall = base
		baseWall = `${baseWall.replace("bricks", "brick")}`
		baseWall = `${baseWall.replace("tiles", "tile")}`
		baseWall = baseWall + "_wall"
		if (altNamespace == "aether") {
			baseWall = baseWall.replace("_stone", "")
		}
 		if (!base.includes(":")) {
			base = id(base)
		}
		if (!baseWall.includes(":")) {
			baseWall = id(altNamespace, baseWall)
		}
		// Override for Cut Copper Walls not existing.
		if (baseWall.includes("copper")) {
			baseWall = baseWall.replace("minecraft", modID)
		}
		// Override for it picking up Smooth Quartz Block Walls instead of Smooth Quartz Walls
		else if (baseWall.includes("quartz")) {
			base = "minecraft:smooth_quartz"
			baseWall = baseWall = "pyrite:smooth_quartz_wall"
		}
		baseWall = baseWall.replace("weathered_cut", "cut_weathered")
		baseWall = baseWall.replace("oxidized_cut", "cut_oxidized")
		baseWall = baseWall.replace("exposed_cut", "cut_exposed")
		recipe = generateShapedRecipe({ "C": base, "S": baseWall }, id(namespace, block), 6, [
			"SCS",
			"SCS"
		])
	}
	else if (type === "buttons") {
		recipe = generateShapedRecipe({ "C": id(altNamespace, base) }, id(namespace, block), 1, ["C"])
	}
	else if (type === "metal_buttons") {
		recipe = generateShapelessRecipe([id(altNamespace, base), `#${mc}:buttons`], id(namespace, block), 1)
	}
	else if ((type.includes("nostalgia")) || (type === "locked_chest")) {
		if (base == "minecraft:copper") {
			base += "_block"
		}
		base = base.replace("nostalgia_", "")
		base = base.replace("locked_chest", "chest")
		recipe = generateShapelessRecipe([id(modID, "nostalgia_dye"), id(mc, base)], id(modID, block), 1)
	}
	else if (type == "flower") {
		let vanillaFlower;
		if (block === "rose") {
			vanillaFlower = "poppy"
		}
		else if (block === "paeonia") {
			vanillaFlower = "peony"
		}
		else if (block === "buttercup") {
			vanillaFlower = "dandelion"
		}
		else if (block === "blue_rose") {
			vanillaFlower = "blue_orchid"
		}
		else if (block === "pink_daisy") {
			vanillaFlower = "oxeye_daisy"
		}
		else {
			vanillaFlower = block.replace("rose", "tulip")
		}
		recipe = generateShapelessRecipe([id(modID, "nostalgia_dye"), id(mc, vanillaFlower)], id(modID, block), 1)
	}
	else if (type == "powered") {
		recipe = generateShapedRecipe({ "G": "minecraft:tinted_glass", "R": "minecraft:redstone" }, id(namespace, block), 2, [
			" R ",
			"RGR",
			" R ",
		])
	}
	else {
		// console.log(block, type)
	}

	return recipe

}

module.exports = {
    generateRecipes: generateRecipes,
    generateShapedRecipe: generateShapedRecipe,
    generateShapelessRecipe: generateShapelessRecipe,
	generateModLoadCondition: generateModLoadCondition

}