const helpers = require('./helpers');
const modeler = require('./models');

module.exports = {
    generateBlockModel: function generateBlockModel(block, namespace, texture, model, render_type, texture_type) {
        if (model === undefined) {
            model = "minecraft:block/cube_all"
        }
        if (!model.includes("block/")) {
            model = "minecraft:block/" + model
        }
        if (render_type === undefined) {
            render_type = ""
        }
        else {
            render_type = `,"render_type": "${render_type}"`
        }
        if (texture_type === undefined) {
            texture_type = "all"
        }
        // Extract namespace and block from texture, if present.
        if (texture.includes(":")) {
            namespace = texture.split(":")[0]
            block = texture.split(":")[1]
        }
        // Override for Grass Turf for colour provider tinting.
        if (texture.includes("minecraft:grass_block_top")) {
            return readFile(`./overrides/models/grass_turf.json`)
        }
    
        return `{"parent": "${model}","textures": {"${texture_type}": "${namespace}:block/${block}"}${render_type}}`
    
    },
    generatePaneBlockModels: function generatePaneBlockModels(block, namespace, baseBlock, model) {
        let edge;
        if (block.includes("bars")) {
            edge = baseBlock
        }
        else {
            edge = "framed_glass_pane_top"
        }
        return `{
        "parent": "minecraft:block/${model}",
        "textures": {
          "pane": "${namespace}:block/${baseBlock}",
          "edge": "${namespace}:block/${edge}"
        },
        "render_type": "translucent"
      }`
    },
    
    generateStairBlockModel: function generateStairBlockModel(block, namespace, baseBlock, model) {
        if (baseBlock === "grass_block_top") {
            if (model === "stairs") {
                return readFile("./overrides/models/grass_stairs.json")
            }
            else if (model === "inner_stairs") {
                return readFile("./overrides/models/grass_stairs_inner.json")
            }
            else if (model === "outer_stairs") {
                return readFile("./overrides/models/grass_stairs_outer.json")
            }
        }
        return `{
        "parent": "minecraft:block/${model}",
        "textures": {
          "bottom": "${namespace}:block/${baseBlock}",
          "top": "${namespace}:block/${baseBlock}",
          "side": "${namespace}:block/${baseBlock}"
        }
      }`
    },

    generateWallBlockModel: function generateWallBlockModel(block, namespace, baseBlock, parent) {
        return `{
          "parent": "minecraft:block/${parent}",
          "textures": {
            "wall": "${namespace}:block/${baseBlock}"
          }
        }`
    },

    generateCraftingTableBlockModel: function generateCraftingTableBlockModel(block, namespace, baseBlock, altNamespace) {
        return `{"parent": "minecraft:block/cube","textures": {"particle": "${namespace}:block/${block}_front","north": "${namespace}:block/${block}_front","south": "${namespace}:block/${block}_side","east": "${namespace}:block/${block}_side","west": "${namespace}:block/${block}_front","up": "${namespace}:block/${block}_top","down": "${altNamespace}:block/${baseBlock}"}}`
    },
    
    generateCubeColumnBlockModel: function generateCubeColumnBlockModel(block, namespace, baseBlock, model) {
        return `{"parent":"minecraft:block/${model}","textures":{"end":"${namespace}:block/${block}_top","side":"${namespace}:block/${block}"}}`
    },
    
    generateLeverBlockModel: function generateLeverBlockModel(block, namespace, baseBlock, altNamespace, addon) {
        if (addon === undefined) {
            addon = ""
        }
        else {
            addon = `_${addon}`
            if (addon === "_wall") {
                let wallName = baseBlock + "_wall"
                if (altNamespace !== mc) {
                    return `{"parent": "${altNamespace}:block/${baseBlock}_wall","render_type": "cutout"}`
                }
                else {
                    const torchBlock = baseBlock.replace("torch", "wall_torch")
                    return `{"parent": "${altNamespace}:block/${torchBlock}","render_type": "cutout"}`
                }
            }
            else if (addon === "_upright") {
                return `{"parent": "${altNamespace}:block/${baseBlock}","render_type": "cutout"}`
            }
            else {
                return `{"parent": "pyrite:block/template_torch_lever${addon}","textures": {"texture": "${altNamespace}:block/${baseBlock}"},"render_type": "cutout"}`
            }
        }
        return `{"parent": "pyrite:block/template_torch_lever${addon}","textures": {"texture": "${altNamespace}:block/${baseBlock}"},"render_type": "cutout"}`
    },
    
    generateMushroomStemModel: function generateMushroomStemModel(block, namespace, baseBlock, model) {
        return `{"parent": "minecraft:block/${model}","textures": {"end": "${namespace}:block/${block}_top","side": "minecraft:block/mushroom_stem"}}`
    },
    
    generateDoorBlockModels: function generateDoorBlockModels(block, namespace, baseBlock, modelID) {
        return `{"parent":"minecraft:block/${modelID}","textures":{"bottom":"${namespace}:block/${block}_bottom","top":"${namespace}:block/${block}_top"},"render_type":"cutout"}`
    },

    generateFenceGateBlockModels: function generateFenceGateBlockModels(block, namespace, baseBlock, model, altNamespace) {
        return `{"parent": "${altNamespace}:block/${model}","textures": {"texture": "${namespace}:block/${baseBlock}"}}`
    },

    generateOrientableBlockModel: function generateOrientableBlockModel(block) {
        const namespace = helpers.getNamespace(block)
        const path = helpers.getPath(block)
        return {
            "parent": "minecraft:block/orientable",
            "textures": {
              "top": `${namespace}:block/${path}_top`,
              "front": `${namespace}:block/${path}`,
              "side": `${namespace}:block/${path}_side`
            }
          }
    }

   
}