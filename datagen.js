class Block {  // Create a class
    constructor(blockID, blockType, category) {  // Class constructor
        this.blockID = blockID;
        this.blockType = blockType;
        this.category = category;
    }
    generate() {
        console.log(this.category)
    }
  }

 const cobblestone_bricks = new Block("cobblestone_bricks", "block", "stone_bricks");  // Create an object of Car class

 function writeBlock(block, dye, namespace, special, baseBlock, render_type) {
    // writeBlockstate(block, generateBlockState(), namespace)
    // writeBlockModels(block, namespace, baseBlock, undefined, render_type)
    // writeBlockItemModel(block, namespace)
    // createTags(block, namespace)
    // writeLootTables(block, namespace)
    // writeRecipes(block, special, dye)
  
  }

  cobblestone_bricks.generate()