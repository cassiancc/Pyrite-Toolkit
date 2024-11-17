const helpers = require('../helpers/helpers');
const modelHelper = require("../helpers/models")
const writeFile = helpers.writeFile

const modID = helpers.modID
const mc = helpers.mc
const id = helpers.id
const getNamespace = helpers.getNamespace
const getPath = helpers.getPath
const generateBlockModel = modelHelper.generateBlockModel
const readFile = helpers.readFile


module.exports = {
    writePlankBlockModels: function writePlankBlockModels(block, namespace, texture, model, render_type) {
        let blockModel = modelHelper.generateBlockModel(block, namespace, texture, model, render_type)
        writeFile(`${helpers.modelPath}${block}.json`, blockModel)
    },
    
    writeMirroredBricksBlockModels: function writeMirroredBricksBlockModels(block, namespace, baseBlock) {
        writeFile(`${helpers.modelPath}${block}.json`, modelHelper.generateBlockModel(block, namespace, baseBlock))
        writeFile(`${helpers.modelPath}${block}_north_west_mirrored.json`, modelHelper.generateBlockModel(block, namespace, baseBlock, "minecraft:block/cube_north_west_mirrored_all"))
    
    },
    
    writeCraftingTableBlockModels: function writeCraftingTableBlockModels(block, namespace, baseBlock, altNamespace) {
        blockModel = generateCraftingTableBlockModel(block, namespace, baseBlock, altNamespace)
        writeFile(`${helpers.modelPath}${block}.json`, blockModel, function (err) {
            if (err) throw err;
    
        });
    },

    writeDoorBlockModels: function writeDoorBlockModels(block) {
        const generate = modelHelper.generateDoorBlockModels
        writeFile(`${helpers.modelPath}${block}_top_left.json`, generate(block, modID, "door_top_left"))
        writeFile(`${helpers.modelPath}${block}_top_right.json`, generate(block, modID, "door_top_right"))
        writeFile(`${helpers.modelPath}${block}_bottom_left.json`, generate(block, modID, "door_bottom_left"))
        writeFile(`${helpers.modelPath}${block}_bottom_right.json`, generate(block, modID, "door_bottom_right"))
        writeFile(`${helpers.modelPath}${block}_top_left_open.json`, generate(block, modID, "door_top_left_open"))
        writeFile(`${helpers.modelPath}${block}_top_right_open.json`, generate(block, modID, "door_top_right_open"))
        writeFile(`${helpers.modelPath}${block}_bottom_left_open.json`, generate(block, modID, "door_bottom_left_open"))
        writeFile(`${helpers.modelPath}${block}_bottom_right_open.json`, generate(block, modID, "door_bottom_right_open"))
    },
    
    writeLevers: function writeLeverBlockModels(block, namespace, baseBlock, altNamespace) {
        if (altNamespace == mc) {
            writeFile(`${helpers.modelPath}${block}_upright.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "upright"))
    
        }
        altNamespace = getAltNamespace(namespace, altNamespace)
        writeFile(`${helpers.modelPath}${block}.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace))
        writeFile(`${helpers.modelPath}${block}_on.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "on"))
        writeFile(`${helpers.modelPath}${block}_wall.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "wall"))
    },
    
    writeTorchBlockModels: function writeTorchBlockModels(block, namespace, baseBlock, altNamespace) {
        altNamespace = getAltNamespace(namespace, altNamespace)
        writeFile(`${helpers.modelPath}${baseBlock}_upright.json`, modelHelper.generateBlockModel(baseBlock, altNamespace, baseBlock, "template_torch", "cutout", "torch"))
        writeFile(`${helpers.modelPath}${block}_wall.json`, modelHelper.generateBlockModel(baseBlock, altNamespace, baseBlock, "template_torch_wall", "cutout", "torch"))
    },
    
    writeCubeColumnBlockModels: function writeCubeColumnBlockModels(block, namespace, baseBlock) {
        writeFile(`${helpers.modelPath}${block}.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column"))
        writeFile(`${helpers.modelPath}${block}_horizontal.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column_horizontal"))
    
    },
    
    writeFlowerBlockModels: function writeFlowerBlockModels(block, namespace) {
        writeFile(`${helpers.modelPath}${block}.json`, modelHelper.generateBlockModel(block, namespace, block, "cross", undefined, "cross"))
    
    },

    writeProvidedBlockModel: function writeProvidedBlockModel(block, model) {
        writeFile(`${helpers.modelPath}${block}.json`, model)
    },
    
    writeLogBlockModels: function writeLogBlockModels(block, namespace, baseBlock) {
        writeFile(`${helpers.modelPath}${block}.json`, generateMushroomStemModel(block, namespace, baseBlock, "cube_column"))
        writeFile(`${helpers.modelPath}${block}_horizontal.json`, generateMushroomStemModel(block, namespace, baseBlock, "cube_column_horizontal"))
    
    },

    writeWallBlockModels: function writeWallBlockModels(block, namespace, baseBlock) {
        if (baseBlock.includes(":")) {
            namespace = baseBlock.split(":")[0]
            baseBlock = baseBlock.split(":")[1]
        }
        const generate = modelHelper.generateWallBlockModel
        const postModel = generate(block, namespace, baseBlock, "template_wall_post")
        const sideModel = generate(block, namespace, baseBlock, "template_wall_side")
        const invModel = generate(block, namespace, baseBlock, "wall_inventory")
        const tallModel = generate(block, namespace, baseBlock, "template_wall_side_tall")
    
        writeFile(`${helpers.modelPath}${block}_post.json`, postModel)
        writeFile(`${helpers.modelPath}${block}_side.json`, sideModel)
        writeFile(`${helpers.modelPath}${block}_inventory.json`, invModel)
        writeFile(`${helpers.modelPath}${block}_side_tall.json`, tallModel)
    },

    writePaneBlockModels: function writePaneBlockModels(block, namespace, baseBlock) {
        const generate = modelHelper.generatePaneBlockModels
        writeFile(`${helpers.modelPath}${block}_post.json`, generate(block, namespace, baseBlock, "template_glass_pane_post"))
        writeFile(`${helpers.modelPath}${block}_side.json`, generate(block, namespace, baseBlock, "template_glass_pane_side"))
        writeFile(`${helpers.modelPath}${block}_noside.json`, generate(block, namespace, baseBlock, "template_glass_pane_noside"))
        writeFile(`${helpers.modelPath}${block}_side_alt.json`, generate(block, namespace, baseBlock, "template_glass_pane_side_alt"))
        writeFile(`${helpers.modelPath}${block}_noside_alt.json`, generate(block, namespace, baseBlock, "template_glass_pane_noside_alt"))
    },
    
    writeBarBlockModels: function writeBarBlockModels(block, namespace, baseBlock) {
        const generate = modelHelper.generateBarBlockModel
        writeFile(`${helpers.modelPath}${block}_cap.json`, generate(block, namespace, "cap"))
        writeFile(`${helpers.modelPath}${block}_post.json`, generate(block, namespace, "post"))
        writeFile(`${helpers.modelPath}${block}_side.json`, generate(block, namespace, "side"))
        writeFile(`${helpers.modelPath}${block}_cap_alt.json`, generate(block, namespace, "cap_alt"))
        writeFile(`${helpers.modelPath}${block}_side_alt.json`, generate(block, namespace, "side_alt"))
        writeFile(`${helpers.modelPath}${block}_post_ends.json`, generate(block, namespace, "post_ends"))
    },
    
    writeStairBlockModels: function writeStairBlockModels(block, namespace, baseBlock) {
        if (baseBlock.includes(":")) {
            namespace = getNamespace(baseBlock)
            baseBlock = getPath(baseBlock)
        }
        block = getPath(block)
        writeFile(`${helpers.modelPath}${block}.json`, modelHelper.generateStairBlockModel(block, namespace, baseBlock, "stairs"));
        writeFile(`${helpers.modelPath}${block}_inner.json`, modelHelper.generateStairBlockModel(block, namespace, baseBlock, "inner_stairs"));
        writeFile(`${helpers.modelPath}${block}_outer.json`, modelHelper.generateStairBlockModel(block, namespace, baseBlock, "outer_stairs"));
    },
    
    writeButtonBlockModels: function writeButtonBlockModels(block, namespace, baseBlock) {
        if (namespace == undefined) {
            namespace = modID
        }
        if (!baseBlock.includes(":")) {
            baseBlock = id(modID, baseBlock)
        }
    
        const generate = modelHelper.generateBlockModel
        
        const buttonModel = generate(block, namespace, baseBlock, "button", undefined, "texture")
        const buttonModelInventory = generate(block, namespace, baseBlock, "button_inventory", undefined, "texture")
        const buttonModelPressed = generate(block, namespace, baseBlock, "button_pressed", undefined, "texture")
        
        writeFile(`${helpers.modelPath}${block}.json`, buttonModel)
        writeFile(`${helpers.modelPath}${block}_inventory.json`, buttonModelInventory);
        writeFile(`${helpers.modelPath}${block}_pressed.json`, buttonModelPressed);
    },
    
    writeSlabBlockModels: function writeSlabBlockModels(block, namespace, baseBlock) {
        if (baseBlock.includes(":")) {
            namespace = baseBlock.split(":")[0]
            baseBlock = baseBlock.split(":")[1]
        }
        block = getPath(block)
        const generateSlabBlockModel = modelHelper.generateSlabBlockModel
        writeFile(`${helpers.modelPath}${block}.json`, generateSlabBlockModel(block, namespace, baseBlock, "slab"));
        writeFile(`${helpers.modelPath}${block}_top.json`, generateSlabBlockModel(block, namespace, baseBlock, "slab_top"));
    },
    
    writePlateBlockModels: function writePlateBlockModels(block, namespace, baseBlock) {
        if (baseBlock.includes(":")) {
            namespace = baseBlock.split(":")[0]
            baseBlock = baseBlock.split(":")[1]
        }
        const plateModel = modelHelper.generateBlockModel(block, namespace, id(namespace, baseBlock), "pressure_plate_up", undefined, "texture")
        const plateModelDown = modelHelper.generateBlockModel(block, namespace, id(namespace, baseBlock), "pressure_plate_down", undefined, "texture")
    
        writeFile(`${helpers.modelPath}${block}.json`, plateModel);
        writeFile(`${helpers.modelPath}${block}_down.json`, plateModelDown);
    },
    
    writeFenceBlockModels: function writeFenceBlockModels(block, baseBlock, namespace) {
        writeFile(`${helpers.modelPath}${block}_post.json`, modelHelper.generateFenceBlockModels(block, baseBlock, namespace, "fence_post"));
        writeFile(`${helpers.modelPath}${block}_side.json`, modelHelper.generateFenceBlockModels(block, baseBlock, namespace, "fence_side"));
        writeFile(`${helpers.modelPath}${block}_inventory.json`, modelHelper.generateFenceBlockModels(block, baseBlock, namespace, "fence_inventory"));
    },

    writeFenceGateBlockModels: function writeFenceGateBlockModels(block, namespace, baseBlock) {
        if (baseBlock.includes(":")) {
            namespace = baseBlock.split(":")[0]
            baseBlock = baseBlock.split(":")[1]
        }
        writeFile(`${helpers.modelPath}${block}.json`, modelHelper.generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate", mc))
        writeFile(`${helpers.modelPath}${block}_open.json`, modelHelper.generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_open", mc))
        writeFile(`${helpers.modelPath}${block}_wall.json`, modelHelper.generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_wall", mc))
        writeFile(`${helpers.modelPath}${block}_wall_open.json`, modelHelper.generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_wall_open", mc))
    },
    
    writeWallGateBlockModels: function writeWallGateBlockModels(block, namespace, baseBlock) {
        if (baseBlock.includes(":")) {
            namespace = baseBlock.split(":")[0]
            baseBlock = baseBlock.split(":")[1]
        }
        writeFile(`${helpers.modelPath}${block}.json`, modelHelper.generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate", mc))
        writeFile(`${helpers.modelPath}${block}_open.json`, modelHelper.generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_open", mc))
        writeFile(`${helpers.modelPath}${block}_wall.json`, modelHelper.generateFenceGateBlockModels(block, namespace, baseBlock, "template_wall_gate_wall", modID))
        writeFile(`${helpers.modelPath}${block}_wall_open.json`, modelHelper.generateFenceGateBlockModels(block, namespace, baseBlock, "template_wall_gate_wall_open", modID))
    },
    
    writeTrapdoorBlockModels: function writeTrapdoorBlockModels(block, namespace) {
        const generate = modelHelper.generateBlockModel
        writeFile(`${helpers.modelPath}${block}_top.json`, generate(block, namespace, block, "template_orientable_trapdoor_top", "cutout", "texture"));
        writeFile(`${helpers.modelPath}${block}_bottom.json`, generate(block, namespace, block, "template_orientable_trapdoor_bottom", "cutout", "texture"));
        writeFile(`${helpers.modelPath}${block}_open.json`, generate(block, namespace, block, "template_orientable_trapdoor_open", "cutout", "texture"));
    },
    
    writeCarpetBlockModels: function writeCarpetBlockModels(block, namespace, baseBlock) {
        const generate = modelHelper.generateBlockModel
        let carpetModel = generate(block, namespace, id(namespace, baseBlock), "carpet", undefined, "wool")
        if (block === "grass_carpet") {
            carpetModel = readFile(`./overrides/models/grass_carpet.json`)
        }
    
        writeFile(`${helpers.modelPath}${block}.json`, carpetModel);
    },

    writeCraftingTableBlockModels: function writeCraftingTableBlockModels(block, namespace, baseBlock, altNamespace) {
        blockModel = modelHelper.generateCraftingTableBlockModel(block, namespace, baseBlock, altNamespace)
        writeFile(`${helpers.modelPath}${block}.json`, blockModel)
    },
    
    writeLevers: function writeLeverBlockModels(block, namespace, baseBlock, altNamespace) {
        const generate = modelHelper.generateLeverBlockModel
        if (altNamespace == mc) {
            writeFile(`${helpers.modelPath}${block}_upright.json`, generate(block, namespace, baseBlock, altNamespace, "upright"))
        }
        altNamespace = getAltNamespace(namespace, altNamespace)
        writeFile(`${helpers.modelPath}${block}.json`, generate(block, namespace, baseBlock, altNamespace))
        writeFile(`${helpers.modelPath}${block}_on.json`, generate(block, namespace, baseBlock, altNamespace, "on"))
        writeFile(`${helpers.modelPath}${block}_wall.json`, generate(block, namespace, baseBlock, altNamespace, "wall"))
    },
    
    writeTorchBlockModels: function writeTorchBlockModels(block, namespace, baseBlock, altNamespace) {
        altNamespace = getAltNamespace(namespace, altNamespace)
        writeFile(`${helpers.modelPath}${baseBlock}_upright.json`, generateBlockModel(baseBlock, altNamespace, baseBlock, "template_torch", "cutout", "torch"))
        writeFile(`${helpers.modelPath}${block}_wall.json`, generateBlockModel(baseBlock, altNamespace, baseBlock, "template_torch_wall", "cutout", "torch"))
    },
    
    writeCubeColumnBlockModels: function writeCubeColumnBlockModels(block, namespace, baseBlock) {
        writeFile(`${helpers.modelPath}${block}.json`, modelHelper.generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column"))
        writeFile(`${helpers.modelPath}${block}_horizontal.json`, modelHelper.generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column_horizontal"))
    },
    
    writeFlowerBlockModels: function writeFlowerBlockModels(block, namespace) {
        writeFile(`${helpers.modelPath}${block}.json`, modelHelper.generateBlockModel(block, namespace, block, "cross", undefined, "cross"))
    },
    
    writeLogBlockModels: function writeLogBlockModels(block, namespace, baseBlock) {
        writeFile(`${helpers.modelPath}${block}.json`, modelHelper.generateMushroomStemModel(block, namespace, baseBlock, "cube_column"))
        writeFile(`${helpers.modelPath}${block}_horizontal.json`, modelHelper.generateMushroomStemModel(block, namespace, baseBlock, "cube_column_horizontal"))
    }
}

function getAltNamespace(namespace, altNamespace) {
	if (altNamespace === undefined) {
		altNamespace = namespace
	}
	return altNamespace
}