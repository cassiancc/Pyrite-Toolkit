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
            return helpers.readFile(`./overrides/models/grass_turf.json`)
        }
        let parent;
        if (model.includes("TOOLKIT_NO_PARENT")) {
            parent = ""
        }
        else {
            parent = `"parent": "${model}",`
        }
    
        return `{${parent}"textures": {"${texture_type}": "${namespace}:block/${block}"}${render_type}}`
    
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

    generateSlabBlockModel: function generateSlabBlockModel(block, namespace, baseBlock, model) {
        if (baseBlock === "grass_block_top") {
            return helpers.readFile(`./overrides/models/grass_${model}.json`)
        }
        return `{"parent": "minecraft:block/${model}","textures": {"bottom": "${namespace}:block/${baseBlock}","top": "${namespace}:block/${baseBlock}","side": "${namespace}:block/${baseBlock}"}}`
    
    },
    
    generateStairBlockModel: function generateStairBlockModel(block, namespace, baseBlock, model) {
        if (baseBlock === "grass_block_top") {
            if (model === "stairs") {
                return helpers.readFile("./overrides/models/grass_stairs.json")
            }
            else if (model === "inner_stairs") {
                return helpers.readFile("./overrides/models/grass_stairs_inner.json")
            }
            else if (model === "outer_stairs") {
                return helpers.readFile("./overrides/models/grass_stairs_outer.json")
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
        let modelSubdirectory = "", textureSubdirectory = ""
        if ((altNamespace != "pyrite") && (altNamespace != "minecraft")) {
            modelSubdirectory = altNamespace + "/"
            if (altNamespace == "aether") {
                textureSubdirectory = "construction/"
            }
        }
        return `{
            "parent": "minecraft:block/cube",
            "textures": {
                "particle": "${namespace}:block/${modelSubdirectory}${block}_front",
                "north": "${namespace}:block/${modelSubdirectory}${block}_front",
                "south": "${namespace}:block/${modelSubdirectory}${block}_side",
                "east": "${namespace}:block/${modelSubdirectory}${block}_side",
                "west": "${namespace}:block/${modelSubdirectory}${block}_front",
                "up": "${namespace}:block/${modelSubdirectory}${block}_top",
                "down": "${altNamespace}:block/${textureSubdirectory}${baseBlock}"
            }
        }`
    },
    
    generateCubeColumnBlockModel: function generateCubeColumnBlockModel(block, namespace, baseBlock, model) {
        return `{"parent":"minecraft:block/${model}","textures":{"end":"${namespace}:block/${block}_top","side":"${namespace}:block/${block}"}}`
    },
    
    genLevers: function generateLeverBlockModel(block, namespace, baseBlock, altNamespace, addon) {
        if (addon === undefined) {
            addon = ""
        }
        else {
            addon = `_${addon}`
            if (addon === "_wall") {
                let wallName = baseBlock + "_wall"
                if (altNamespace !== helpers.mc) {
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
    
    generateDoorBlockModels: function generateDoorBlockModels(block, namespace, modelID) {
        return `{"parent":"minecraft:block/${modelID}","textures":{"bottom":"${namespace}:block/${block}_bottom","top":"${namespace}:block/${block}_top"},"render_type":"cutout"}`
    },

    generateFenceGateBlockModels: function generateFenceGateBlockModels(block, namespace, baseBlock, model, altNamespace) {
        let textureSubdirectory = "";
        if (altNamespace == "aether") {
            if (baseBlock == "holystone" || baseBlock == "mossy_holystone" || baseBlock == "icestone" ) {
                textureSubdirectory = "natural/"
            }
            else if (baseBlock == "hellfire_stone" || baseBlock == "angelic_stone" || baseBlock == "carved_stone" ) {
                textureSubdirectory = "dungeon/"
            }
            else {
                textureSubdirectory = "construction/"
            }
        }
        return `{"parent": "${model}","textures": {"texture": "${namespace}:block/${textureSubdirectory}${baseBlock}"}}`
    },

    generateFenceBlockModels: function generateFenceBlockModels(block, baseBlock, namespace, model) {
        return `{"parent": "minecraft:block/${model}","textures": {"texture": "${namespace}:block/${baseBlock}"}}`
    },

    genOrientable: function generateOrientableBlockModel(block) {
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
    },

    generateBarBlockModel: function generateBarBlockModel(block, namespace, model) {
        if (model == "side") {
            return generateBarSideBlockModel(block, namespace)
        }
        else if (model == "side_alt") {
            return generateBarSideAltBlockModel(block, namespace)
        }
        else if (model == "post_ends") {
            return generateBarPostEndsBlockModel(block, namespace)
        }
        else if (model == "cap_alt") {
            return generateBarCapAltBlockModel(block, namespace)
        }
        else if (model == "post") {
            return generateBarPostBlockModel(block, namespace)
        }
        else if (model == "cap") {
            return generateBarCapBlockModel(block, namespace)
        }
    }

   
}

function generateBarSideBlockModel(block, namespace) {
    return {
        "ambientocclusion": false,
        "textures": {
            "particle": `${namespace}:block/${block}`,
            "bars": `${namespace}:block/${block}`,
            "edge": `${namespace}:block/${block}`
        },
        "elements": [
            {   "from": [ 8, 0, 0 ],
                "to": [ 8, 16, 8 ],
                "faces": {
                    "west": { "uv": [ 16, 0,  8, 16 ], "texture": "#bars" },
                    "east": { "uv": [  8, 0, 16, 16 ], "texture": "#bars" }
                }
            },
            {   "from": [ 7, 0, 0 ],
                "to": [ 9, 16, 7 ],
                "faces": {
                    "north": { "uv": [ 7, 0, 9, 16 ], "texture": "#edge", "cullface": "north" }
                }
            },
            {   "from": [ 7, 0.001, 0 ],
                "to": [ 9, 0.001, 7 ],
                "faces": {
                    "down":  { "uv": [ 9, 0, 7, 7 ], "texture": "#edge" },
                    "up":    { "uv": [ 7, 0, 9, 7 ], "texture": "#edge" }
                }
            },
            {   "from": [ 7, 15.999, 0 ],
                "to": [ 9, 15.999, 7 ],
                "faces": {
                    "down":  { "uv": [ 9, 0, 7, 7 ], "texture": "#edge" },
                    "up":    { "uv": [ 7, 0, 9, 7 ], "texture": "#edge" }
                }
            }
        ]
    }
}

function generateBarSideAltBlockModel(block, namespace) { 
    return {
        "ambientocclusion": false,
        "textures": {
            "particle": `${namespace}:block/${block}`,
            "bars": `${namespace}:block/${block}`,
            "edge": `${namespace}:block/${block}`
        },
        "elements": [
            {   "from": [ 8, 0, 8 ],
                "to": [ 8, 16, 16 ],
                "faces": {
                    "west": { "uv": [ 8, 0, 0, 16 ], "texture": "#bars" },
                    "east": { "uv": [ 0, 0, 8, 16 ], "texture": "#bars" }
                }
            },
            {   "from": [ 7, 0, 9 ],
                "to": [ 9, 16, 16 ],
                "faces": {
                    "south": { "uv": [ 7, 0, 9, 16 ], "texture": "#edge", "cullface": "south" },
                    "down":  { "uv": [ 9, 9, 7, 16 ], "texture": "#edge" },
                    "up":    { "uv": [ 7, 9, 9, 16 ], "texture": "#edge" }
                }
            },
            {   "from": [ 7, 0.001, 9 ],
                "to": [ 9, 0.001, 16 ],
                "faces": {
                    "down":  { "uv": [ 9, 9, 7, 16 ], "texture": "#edge" },
                    "up":    { "uv": [ 7, 9, 9, 16 ], "texture": "#edge" }
                }
            },
            {   "from": [ 7, 15.999, 9 ],
                "to": [ 9, 15.999, 16 ],
                "faces": {
                    "down":  { "uv": [ 9, 9, 7, 16 ], "texture": "#edge" },
                    "up":    { "uv": [ 7, 9, 9, 16 ], "texture": "#edge" }
                }
            }
        ]
    }
    
}

function generateBarPostEndsBlockModel(block, namespace) {
   return {
    "ambientocclusion": false,
    "textures": {
        "particle": `${namespace}:block/${block}`,
        "edge": `${namespace}:block/${block}`
    },
    "elements": [
        {   "from": [ 7, 0.001, 7 ],
            "to": [ 9, 0.001, 9 ],
            "faces": {
                "down":  { "uv": [  7, 7,  9,  9 ], "texture": "#edge" },
                "up":    { "uv": [  7, 7,  9,  9 ], "texture": "#edge" }
            }
        },
        {   "from": [ 7, 15.999, 7 ],
            "to": [ 9, 15.999, 9 ],
            "faces": {
                "down":  { "uv": [  7, 7,  9,  9 ], "texture": "#edge" },
                "up":    { "uv": [  7, 7,  9,  9 ], "texture": "#edge" }
            }
        }
    ]
}

}

function generateBarCapAltBlockModel(block, namespace) {
    return { "ambientocclusion": false, "textures": { "particle": `${namespace}:block/${block}`, "bars": `${namespace}:block/${block}`, "edge": `${namespace}:block/${block}`, }, "elements": [{ "from": [8, 0, 7], "to": [8, 16, 8], "faces": { "west": { "uv": [8, 0, 9, 16], "texture": "#bars" }, "east": { "uv": [9, 0, 8, 16], "texture": "#bars" } } }, { "from": [7, 0, 7], "to": [9, 16, 7], "faces": { "north": { "uv": [7, 0, 9, 16], "texture": "#bars" }, "south": { "uv": [9, 0, 7, 16], "texture": "#bars" } } }] }
}

function generateBarPostBlockModel(block, namespace) {
    return { "ambientocclusion": false, "textures": { "particle": `${namespace}:block/${block}`, "bars": `${namespace}:block/${block}` }, "elements": [{ "from": [8, 0, 7], "to": [8, 16, 9], "faces": { "west": { "uv": [7, 0, 9, 16], "texture": "#bars" }, "east": { "uv": [9, 0, 7, 16], "texture": "#bars" } } }, { "from": [7, 0, 8], "to": [9, 16, 8], "faces": { "north": { "uv": [7, 0, 9, 16], "texture": "#bars" }, "south": { "uv": [9, 0, 7, 16], "texture": "#bars" } } }] }
}

function generateBarCapBlockModel(block, namespace) {
    return { "ambientocclusion": false, "textures": { "particle": `${namespace}:block/${block}`, "bars": `${namespace}:block/${block}`, "edge": `${namespace}:block/${block}` }, "elements": [{ "from": [8, 0, 8], "to": [8, 16, 9], "faces": { "west": { "uv": [8, 0, 7, 16], "texture": "#bars" }, "east": { "uv": [7, 0, 8, 16], "texture": "#bars" } } }, { "from": [7, 0, 9], "to": [9, 16, 9], "faces": { "north": { "uv": [9, 0, 7, 16], "texture": "#bars" }, "south": { "uv": [7, 0, 9, 16], "texture": "#bars" } } }] }
}