const version = "1.21.4"
const { create } = require('domain');
var fs = require('fs');
const { basename } = require('path');

class Block {  // Create a class
    constructor(blockID, blockType, baseBlock, category) {  // Class constructor
        this.blockID = blockID;
        this.blockType = blockType;
        this.baseBlock = baseBlock;
        this.category = category
        this.namespace = "pyrite"
    }
    generate() {
        this.blockState = generateBlockState(this.blockID, this.namespace, this.category, "block")
        if (version == "1.21.4") {
            this.itemState = generateItemState(this.blockID, this.namespace, this.category, "blockItem")
        }
        writeBlockstate(this.blockID, this.blockState)
        writeBlockModel(this.blockID, this.blockState)

    }
  }

  basePath = `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.21)/common/src/main/resources/`

  function writeBlockstate(blockID, data) {
    writeFile(basePath + "assets/pyrite/blockstates/" + blockID + ".json", data)
  }

  function writeFile(path, data) {
    const demoMode = false
    if (data instanceof Object) {
        data = JSON.stringify(data)
    }
    if (demoMode == false) {
      fs.writeFile(path, data, function (err) { if (err) throw err; })
    }
  }

 const cobblestone_bricks = new Block("cobblestone_bricks", "brick", "cobblestone", "cobblestone_bricks");  // Create an object of Car class
 const framed_glass = new Block("framed_glass", "block", "glass");  // Create an object of Car class


 function createPyriteBlock(block, dye, namespace, special, baseBlock, render_type) {
    // writeBlockstate(block, generateBlockState(), namespace)
    // writeBlockModels(block, namespace, baseBlock, undefined, render_type)
    // writeBlockItemModel(block, namespace)
    // createTags(block, namespace)
    // writeLootTables(block, namespace)
    // writeRecipes(block, special, dye)
  
  }

  function generateBlockState(model, namespace, category, blockType) {
    const finalModel = `${namespace}:block/${category}/${model}`
    base = 
    {
        "variants": {
          "": {
            "model": finalModel
          }
        }
      }
      return base;
      
  }

  function generateBlockModel(model, namespace, category, blockType) {
    let parent;
    if (blockType == "bricks") {
        parent = "minecraft:block/cube_all"
    }
    const finalModel = `${namespace}:block/${category}/${model}`
    base = 
    {
        "parent": "minecraft:block/cube_all",
        "textures": {
        "all": finalModel
        }
    }
      return base;
      
  }


  function generateItemState(model, namespace, category, itemType) {
    const finalModel = `${namespace}:block/${category}/${model}`
    base = 
    {
        "model": {
          "type": "minecraft:model",
          "model": finalModel
        }
      }
      return base;
  }

  cobblestone_bricks.generate()