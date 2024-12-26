const helpers = require("../helpers/helpers")
const { writeFile, modID, getPath, id } = require("../helpers/helpers")

function writeLootTables(block, namespace, baseBlock, altNamespace) {
	block = getPath(block)
	const filePath = `${helpers.paths.loot}${block}.json`
	if (namespace === undefined) {
		namespace = modID
	}
	if (baseBlock === undefined) {
		baseBlock = block
	}
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
    let modLoadCondition = ""
    if (altNamespace === "aether") {
		modLoadCondition = ", "+ generateModLoadCondition(altNamespace, id(block))
	}
	let lootTable = `{
        "type": "minecraft:block",
        "pools": [
            {
                "rolls": 1,
                "entries": [
                    {
                        "type": "minecraft:item",
                        "name": "${id(namespace, baseBlock)}"
                    }
                ],
                "conditions": [{"condition": "minecraft:survives_explosion"}]
            }
        ]
        ${modLoadCondition}
    }`
	writeFile(filePath, lootTable);
}


function writeSlabLootTables(blockID) {
	const block = getPath(blockID)
	const filePath = `${helpers.paths.loot}${block}.json`
	let lootTable = `{
		"type": "minecraft:block",
		"pools": [
		  {
			"bonus_rolls": 0.0,
			"entries": [
			  {
				"type": "minecraft:item",
				"functions": [
				  {
					"add": false,
					"conditions": [
					  {
						"block": "${blockID}",
						"condition": "minecraft:block_state_property",
						"properties": {
						  "type": "double"
						}
					  }
					],
					"count": 2.0,
					"function": "minecraft:set_count"
				  },
				  {
					"function": "minecraft:explosion_decay"
				  }
				],
				"name": "${blockID}"
			  }
			],
			"rolls": 1.0
		  }
		]
	  }`
	writeFile(filePath, lootTable);


}

function writeDoorLootTables(block, namespace) {
	if (namespace === undefined) {
		namespace = modID
	}
	let lootTable = `{"type": "minecraft:block","pools": [{"bonus_rolls": 0.0,"conditions": [{"condition": "minecraft:survives_explosion"}],"entries": [{"type": "minecraft:item","conditions": [{"block": "${namespace}:${block}","condition": "minecraft:block_state_property","properties": {"half": "lower"}}],"name": "${namespace}:${block}"}],"rolls": 1.0}]}`
	writeFile(`${helpers.paths.loot}${block}.json`, lootTable, true);
}

function generateModLoadCondition(mod, block) {
	return `
		"fabric:load_conditions": [
			{
				"condition": "fabric:registry_contains",
				"values": [
					"${block}"
				]
			}
		]
	`
}

module.exports = {
    writeLootTables: writeLootTables,
    writeDoorLootTables: writeDoorLootTables,
	writeSlabLootTables: writeSlabLootTables
}