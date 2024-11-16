const helpers = require('../helpers/helpers');

const writeFile = helpers.writeFile

module.exports = {
    writePlankBlockModels: function writePlankBlockModels(block, namespace, texture, model, render_type) {
        let blockModel = generateBlockModel(block, namespace, texture, model, render_type)
        writeFile(`${helpers.modelPath}${block}.json`, blockModel)
    },
    
    writeMirroredBricksBlockModels: function writeMirroredBricksBlockModels(block, namespace, baseBlock) {
        writeFile(`${helpers.modelPath}${block}.json`, generateBlockModel(block, namespace, baseBlock))
        writeFile(`${helpers.modelPath}${block}_north_west_mirrored.json`, generateBlockModel(block, namespace, baseBlock, "minecraft:block/cube_north_west_mirrored_all"))
    
    },
    
    writeCraftingTableBlockModels: function writeCraftingTableBlockModels(block, namespace, baseBlock, altNamespace) {
        blockModel = generateCraftingTableBlockModel(block, namespace, baseBlock, altNamespace)
        writeFile(`${helpers.modelPath}${block}.json`, blockModel, function (err) {
            if (err) throw err;
    
        });
    },
    
    writeLeverBlockModels: function writeLeverBlockModels(block, namespace, baseBlock, altNamespace) {
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
        writeFile(`${helpers.modelPath}${baseBlock}_upright.json`, generateBlockModel(baseBlock, altNamespace, baseBlock, "template_torch", "cutout", "torch"))
        writeFile(`${helpers.modelPath}${block}_wall.json`, generateBlockModel(baseBlock, altNamespace, baseBlock, "template_torch_wall", "cutout", "torch"))
    },
    
    writeCubeColumnBlockModels: function writeCubeColumnBlockModels(block, namespace, baseBlock) {
        writeFile(`${helpers.modelPath}${block}.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column"))
        writeFile(`${helpers.modelPath}${block}_horizontal.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column_horizontal"))
    
    },
    
    writeFlowerBlockModels: function writeFlowerBlockModels(block, namespace) {
        writeFile(`${helpers.modelPath}${block}.json`, generateBlockModel(block, namespace, block, "cross", undefined, "cross"))
    
    },

    writeProvidedBlockModel: function writeProvidedBlockModel(block, model) {
        writeFile(`${helpers.modelPath}${block}.json`, model)
    },
    
    writeLogBlockModels: function writeLogBlockModels(block, namespace, baseBlock) {
        writeFile(`${helpers.modelPath}${block}.json`, generateMushroomStemModel(block, namespace, baseBlock, "cube_column"))
        writeFile(`${helpers.modelPath}${block}_horizontal.json`, generateMushroomStemModel(block, namespace, baseBlock, "cube_column_horizontal"))
    
    }
}