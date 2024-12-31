const { getPath, paths, writeFile, getNamespace, id } = require("../helpers/helpers");

function writeRecipeAdvancement(block, trigger) {
	// Triggers for compat content are not yet working.
	if (getNamespace(trigger) == "aether")
		return

	// Setup
	// If multiple base blocks exist, use the first one as a trigger.
	if (trigger instanceof Array) {
		trigger = trigger[0]
	}
	if (!block.includes(":")) {
		block = id(block)
	}
	if (!trigger.includes(":")) {
		trigger = id(trigger)
	}
	const path = getPath(block)
	const filePath = `${paths.advancementRecipes}${path}.json`

	// Failsafe for unset trigger.
	if (trigger === undefined) {
		trigger = "minecraft:crafting_table"
	}
  // Failsafe for copper trigger.
  if (trigger === "minecraft:copper")
      trigger = "minecraft:copper_block"

	// Override for quartz
	if (trigger.includes("quartz_block_"))
		trigger = trigger.replace("_top", "").replace("_bottom", "")
	const advancement = `{
        "parent": "minecraft:recipes/root",
        "criteria": {
          "has_needed_item": {
            "conditions": {
              "items": [
                {
                  "items": ["${trigger}"]
                }
              ]
            },
            "trigger": "minecraft:inventory_changed"
          },
          "has_the_recipe": {
            "conditions": {
              "recipe": "${block}"
            },
            "trigger": "minecraft:recipe_unlocked"
          }
        },
        "requirements": [
          [
            "has_the_recipe",
            "has_needed_item"
          ]
        ],
        "rewards": {
          "recipes": [
            "${block}"
          ]
        }
      }`
	writeFile(filePath, advancement);
}

module.exports = {
	writeRecipeAdvancement: writeRecipeAdvancement
}