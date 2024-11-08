const { create } = require('domain');
var fs = require('fs');
const { basename } = require('path');

globalNamespace = "pyrite"
globalBaseNamespace = "minecraft"


vanillaDyes = [
  "white",
  "orange",
  "magenta",
  "light_blue",
  "yellow",
  "lime",
  "pink",
  "gray",
  "light_gray",
  "cyan",
  "purple",
  "blue",
  "brown",
  "green",
  "red",
  "black"
]

modDyes = [
  "glow",
  "dragon",
  "star",
  "honey",
  "nostalgia",
  "rose",
  "poisonous",
]

dyes = vanillaDyes.concat(modDyes)

vanillaWood = [
  "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "bamboo", "crimson", "warped"
]

const walls = [
  "cobblestone",
  "mossy_cobblestone",
  "stone_brick",
  "mossy_stone_brick",
  "granite",
  "diorite",
  "andesite",
  "cobbled_deepslate",
  "polished_deepslate",
  "deepslate_brick",
  "deepslate_tile",
  "brick",
  "mud_brick",
  "sandstone",
  "red_sandstone",
  "prismarine",
  "nether_brick",
  "red_nether_brick",
  "blackstone",
  "polished_blackstone",
  "polished_blackstone_brick",
  "end_stone_brick",

];

const trialsWalls = [
  "polished_tuff_wall",
  "tuff_brick_wall",
  "tuff_wall"

];

const cut = [
  "iron",
  "gold",
  "emerald",
  "diamond",
  "netherite",
  "quartz",
  "amethyst",
  "lapis",
  "redstone",
  "copper",
  "exposed_copper",
  "weathered_copper",
  "oxidized_copper"
]

namespace = "pyrite"

//Base path
paths = {
  //new
  origin: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/`,
  cavesp2: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.18)/src/main/resources/`,
  wild: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.19)/src/main/resources/`,
  trailstales: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.21)/common/src/main/resources`,
  trailstales5: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.20.5)/src/main/resources/`,
  infinite: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (20w14infinite)/src/main/resources/`,





  //legacy
  base: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.21)/common/src/main/resources/`,
  infinitemodels: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (20w14infinite)/src/main/resources/assets/pyrite/models/block/`,
  infiniteblockstates: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (20w14infinite)/src/main/resources/assets/pyrite/blockstates/`,
  potatorecipes: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.20.5)/src/main/resources/data/pyrite/recipes/`,


}



//Assets and legacy path
paths = Object.assign(paths, {
  //Legacy
  base: paths.trailstales,
  infinitemodels: `${paths.infinite}assets/pyrite/models/block/`,
  infiniteblockstates: `${paths.infinite}assets/pyrite/blockstates/`,
  //Assets
  assets: `${paths.trailstales}/assets/${"pyrite"}/`,
  data: `${paths.trailstales}/data/${"pyrite"}/`,
  mcdata: `${paths.trailstales}/data/minecraft/`
})
//Blockstates and models
paths = Object.assign(paths, { blockstates: `${paths.assets}/blockstates/`, models: `${paths.assets}/models/block/`, itemModels: `${paths.assets}/models/item/` })
//Namespace data and Minecraft data folders
paths = Object.assign(paths, { data: `${paths.base}/data/${"pyrite"}/`, mcdata: `${paths.base}/data/minecraft/` })
//Tags
paths = Object.assign(paths, {
  blockstates: `${paths.assets}/blockstates/`,
  models: `${paths.assets}/models/block/`,
  itemModels: `${paths.assets}/models/item/`,
  tags: `${paths.data}/tags/`,
  mctags: `${paths.mcdata}/tags/`,

})

const version = "1.21.4"

if (version == "1.20.1") {
  paths = Object.assign(paths, {

    loot: `${paths.data}loot_tables/blocks/`,
    recipes: `${paths.data}/recipes/`
  
  })
}



if (version == "1.21.1" || version == "1.21.4") {
  paths = Object.assign(paths, {

    loot: `${paths.data}loot_table/blocks/`,
    recipes: `${paths.data}/recipe/`
  
  })
}

let blockIDs = []
let blockTranslations = {
  "itemGroup.pyrite.group": "Pyrite",
  "tag.item.pyrite.crafting_tables": "Crafting Tables",
  "tag.item.pyrite.mushroom_stem": "Mushroom Stems",
  "lore.pyrite.rose": "This red flower makes you think of the past.",
  "lore.pyrite.orange_rose": "This blue flower makes you think of the past.",
  "lore.pyrite.white_rose": "This blue flower makes you think of the past.",
  "lore.pyrite.pink_rose": "This blue flower makes you think of the past.",
  "lore.pyrite.blue_rose": "This blue flower makes you think of the past.",
  "lore.pyrite.charred_nether_bricks": "A decorative block adding a shadowy accent to your Nether Bricks.",
  "lore.pyrite.blue_nether_bricks": "A decorative block adding a pop of blue to your Nether Bricks.",
  "lore.pyrite.glowing_obsidian": "This block might have once had a purpose, but now just serves as a light source.",
  "lore.pyrite.nostalgia_glowing_obsidian": "This block might have once had a purpose, but now just serves as a light source.",
  "lore.pyrite.locked_chest": "This block might have once had a purpose, but now just serves as a light source.",
  "lore.pyrite.nostalgia_cobblestone": "Just looking at this block's dramatic cracks brings back memories.",
  "lore.pyrite.nostalgia_mossy_cobblestone": "Just looking at this block's dramatic cracks brings back memories.",
  "lore.pyrite.nostalgia_netherrack": "Just looking at this block's strange texture brings back memories.",
  "lore.pyrite.nostalgia_gravel": "Just looking at this block's messy texture brings back memories.",
  "lore.pyrite.nostalgia_iron_block": "Just looking at this block's shiny texture brings back memories.",
  "lore.pyrite.nostalgia_gold_block": "Just looking at this block's shiny texture brings back memories.",
  "lore.pyrite.nostalgia_diamond_block": "Just looking at this block's shiny texture brings back memories.",
  "lore.pyrite.nostalgia_emerald_block": "Just looking at this block's chiseled texture brings back memories.",
  "lore.pyrite.nostalgia_redstone_block": "Just looking at this block's darker texture brings back memories.",
  "lore.pyrite.nostalgia_netherite_block": "Just looking at this block's shiny texture makes you wonder what might have been.",
  "lore.pyrite.nostalgia_copper_block": "Just looking at this block's shiny texture makes you wonder what might have been.",
  "lore.pyrite.nostalgia_exposed_copper_block": "Just looking at this block's shiny texture makes you wonder what might have been.",
  "lore.pyrite.nostalgia_weathered_copper_block": "Just looking at this block's shiny texture makes you wonder what might have been.",
  "lore.pyrite.nostalgia_oxidized_copper_block": "Just looking at this block's shiny texture makes you wonder what might have been.",
  "lore.pyrite.nostalgia_amethyst_block": "Just looking at this block's shiny texture makes you wonder what might have been.",
  "lore.pyrite.nostalgia_lapis_block": "Just looking at this block's smooth texture brings back memories.",
  "lore.pyrite.nostalgia_bricks": "Just looking at this block's bright texture brings back memories.",
  "lore.pyrite.lit_redstone_lamp": "This block resembles a Redstone Lamp, but is permanently powered thanks to the Redstone Torch inside.",
  "lore.pyrite.cobblestone_bricks": "This brick block is great for both early and late game builds.",
  "lore.pyrite.smooth_stone_bricks": "A variant of Smooth Stone that has been carved into bricks. ",
}


class Block {  // Create a class
  constructor(blockID, namespace, baseNamespace, blockType, baseBlock, material) {
    // Intialize with basic variables
    this.blockID = blockID;
    this.namespace = namespace
    this.baseNamespace = baseNamespace
    if (baseNamespace == undefined) {
      this.baseNamespace = namespace
    }
    this.blockType = blockType;
    this.baseBlock = baseBlock;
    this.material = material;

    //Add to global list of blocks.
    blockIDs.push(blockID)

    //Add to global list of block translations.
    this.addTranslation()

    //Generate block state
    if (blockType == "block") {
      writeBlock(this.blockID, this.namespace, special, this.baseBlock, undefined)
    }
    else if (blockType == "slab") {
      writeSlabs(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "stairs") {
      writeStairs(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "wall") {
      writeWalls(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "wall_gate") {
      writeWallGates(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "fence") {
      writeFences(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "fence_gate") {
      writeFenceGates(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "ladder") {
      writeLadders(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "door") {
      writeDoors(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "trapdoor") {
      writeTrapdoors(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "crafting_table") {
      writeCraftingTableBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "button") {
      writeButtons(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "torch") {
      writeTorchBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "torch_lever") {
      writeLeverBlock(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else if (blockType == "mushroom_stem") {
      writeLogs(this.blockID, this.namespace, this.baseBlock)
    }
    else if (blockType == "cobblestone_bricks") {
      writeTerracottaBricks(this.blockID, this.namespace, "cobblestone_bricks", this.baseBlock)
    }
    else if (blockType == "mossy_cobblestone_bricks") {
      writeTerracottaBricks(this.blockID, this.namespace, "mossy_cobblestone_bricks", this.baseBlock)
    }
    else if (blockType == "terracotta_bricks") {
      writeTerracottaBricks(this.blockID, this.namespace, "terracotta_bricks", this.baseBlock)
    }
    else if ((blockType == "framed_glass_pane") || (blockType == "stained_framed_glass_pane")) {
      writePaneBlock(this.blockID, this.namespace, this.baseBlock)
    }
    else if (blockType == "pressure_plate") {
      writePlates(this.blockID, this.namespace, this.baseBlock, this.baseNamespace)
    }
    else {
      console.log(blockType)
      writeBlock(this.blockID, this.namespace, this.blockType, this.baseBlock)
    }


    //Generate block loot table
    if (blockType == "door") {
      writeDoorLootTables(this.blockID, this.namespace)

    }
    else {
      writeLootTables(this.blockID, this.namespace)

    }

    //Generate recipes
    // writeRecipes(this.blockID, this.blockType, this.baseBlock, this.namespace, this.baseNamespace)



  }
  generateFullID() {
    console.log(`${this.namespace}:${this.blockID}`)
  }
  addTranslation() {
    return generateLangObject(this.blockID, "block", this.namespace)
  }
}


let tags = "";
function generateResources() {
  // writeLeverBlock("torch_lever", "pyrite", "torch", "minecraft")
  // writeLeverBlock("redstone_torch_lever", "pyrite", "redstone_torch")
  // writeLeverBlock("soul_torch_lever", "pyrite", "soul_torch")

  torch_lever = new Block("torch_lever", globalNamespace, globalBaseNamespace, "torch_lever", "torch", "torch")
  // redstone_torch_lever = new Block("redstone_torch_lever", globalNamespace, globalBaseNamespace, "torch_lever", "redstone_torch", "torch")
  // soul_torch_lever = new Block("soul_torch_lever", globalNamespace, globalBaseNamespace, "torch_lever", "soul_torch", "torch")



  function generateWoodSet(template) {
    const stainedPlankBase = template + "_planks"

    button = new Block(template + "_button", globalNamespace, globalNamespace, "button", stainedPlankBase, "wood")
    stairs = new Block(template + "_stairs", globalNamespace, globalNamespace, "stairs", stainedPlankBase, "wood")
    slabs = new Block(template + "_slab", globalNamespace, globalNamespace, "slab", stainedPlankBase, "wood")
    pressure_plate = new Block(template + "_pressure_plate", globalNamespace, undefined, "pressure_plate", stainedPlankBase, "wood")
    fence = new Block(template + "_fence", globalNamespace, globalNamespace, "fence", stainedPlankBase, "wood")
    fence_gate = new Block(template + "_fence_gate", globalNamespace, globalNamespace, "fence_gate", stainedPlankBase, "wood")
    planks = new Block(template + "_planks", globalNamespace, globalNamespace, "planks", template, "wood")
    crafting_table = new Block(template + "_crafting_table", globalNamespace, undefined, "crafting_table", stainedPlankBase, "wood")
    ladder = new Block(template + "_ladder", globalNamespace, globalNamespace, "ladder", stainedPlankBase, "wood")
    // chest = new Block(template + "_chest", globalNamespace, globalNamespace, "chest", stainedPlankBase, "wood")
    door = new Block(template + "_door", globalNamespace, globalNamespace, "door", stainedPlankBase, "wood")
    trapdoor = new Block(template + "_trapdoor", globalNamespace, globalNamespace, "trapdoor", stainedPlankBase, "wood")
  }

  function generateBrickSet(template, type) {
    let brickBase;
    if (type == undefined) {
      type = "bricks"
    }
    if (template.search("bricks") == -1) {
      brickBase = template + "_brick"
    }
    else {
      brickBase = template.slice(0, -1)
    }

    const bricksBase = brickBase + "s"

    // const brickBase = template + "_brick"
    bricks = new Block(bricksBase, globalNamespace, undefined, type, template, type)
    slabs = new Block(brickBase + "_slab", globalNamespace, undefined, "slab", bricksBase, type)
    stairs = new Block(brickBase + "_stairs", globalNamespace, undefined, "stairs", bricksBase, type)
    wall = new Block(brickBase + "_wall", globalNamespace, undefined, "wall", bricksBase, type)
    wall_gate = new Block(brickBase + "_wall_gate", globalNamespace, undefined, "wall_gate", bricksBase, type)

  }

  function writeVanillaWalls(array) {
    array.forEach(function (wall) {
      let blockTemplate = wall.replace("_wall", "")
      baseBlock = blockTemplate
      baseBlock = `${baseBlock.replace("brick", "bricks")}`
      baseBlock = `${baseBlock.replace("tile", "tiles")}`
      wall_gate = new Block(blockTemplate + "_wall_gate", globalNamespace, globalBaseNamespace, "wall_gate", baseBlock, "stone")


    })
  }

  // dyes.forEach(function (dye) {
  //   let stainedBlockTemplate = dye + "_stained"
  //   plankBase = stainedBlockTemplate + "_planks"
  //   namespace = "pyrite"

  //   writeButtons(stainedBlockTemplate, namespace, plankBase)
  //   writeStairs(stainedBlockTemplate, namespace, plankBase)
  //   writeSlabs(stainedBlockTemplate, namespace, plankBase)
  //   writePlates(stainedBlockTemplate, namespace, plankBase)
  //   writeFences(stainedBlockTemplate, namespace, plankBase)
  //   writeFenceGates(stainedBlockTemplate, namespace, plankBase)
  //   writePlanks(stainedBlockTemplate, dye, namespace, plankBase)
  //   writeCraftingTableBlock(stainedBlockTemplate, dye, namespace, plankBase)
  //   writeLadders(stainedBlockTemplate, dye, namespace, plankBase)
  //   // writeChests(stainedBlockTemplate, dye, namespace, plankBase)
  //   writeDoors(stainedBlockTemplate, dye, namespace, plankBase)
  //   writeTrapdoors(stainedBlockTemplate, dye, namespace, plankBase)

  //   // Bricks
  //   let blockTemplate = dye
  //   baseBlock = blockTemplate + "_bricks"
  //   // writeBricks(dye, dye, namespace)
  //   // writeBrickSlab(blockTemplate, namespace)
  //   // writeBrickStairs(blockTemplate, namespace)
  //   // writeBrickWall(blockTemplate, namespace)
  //   // writeWallGates(blockTemplate + "_brick", namespace, blockTemplate+"_bricks")

  //   baseBlock = dye + "_terracotta"
  //   writeTerracottaBricks(dye + "_terracotta", dye, namespace)
  //   // writeBrickSlab(dye + "_terracotta", namespace)
  //   // writeBrickStairs(dye + "_terracotta", namespace)
  //   // writeBrickWall(dye + "_terracotta", namespace)
  //   // writeWallGates(dye + "_terracotta_brick", namespace, dye+"_terracotta_bricks")

  //   // Lamps
  //   lamp = new Block(dye + "_lamp", globalNamespace, undefined, "lamp", dye, "lamp")
  //   //Torches
  //   torch = new Block(dye + "_torch", globalNamespace, undefined, "torch", dye, "torch")
  //   //Torch Levers
  //   torch_lever = new Block(dye + "_torch_lever", globalNamespace, globalNamespace, "torch_lever", dye, "torch")
  //   //Framed Glass
  //   framed_glass = new Block(dye + "_framed_glass", globalNamespace, undefined, "stained_framed_glass", dye, "stained_framed_glass")
  //   //Framed Glass Panes
  //   framed_glass = new Block(dye + "_framed_glass_pane", globalNamespace, undefined, "stained_framed_glass_pane", dye, "stained_framed_glass_pane")
  // })


  // vanillaWood.forEach(function (dye) {
  //   let stainedBlockTemplate = dye
  //   plankBase = stainedBlockTemplate + "_planks"
  //   namespace = "pyrite"
  //   writeCraftingTableBlock(stainedBlockTemplate, dye, namespace, plankBase, "minecraft")

  // })


  // const shroomBlockTemplate = "_mushroom"
  // const redShroom = "red" + shroomBlockTemplate
  // const brownShroom = "brown" + shroomBlockTemplate
  // generateWoodSet(redShroom)
  // red_stem = new Block(redShroom + "_stem", globalNamespace, undefined, "mushroom_stem", redShroom + "_planks", "wood")
  // generateWoodSet(brownShroom)
  // brown_stem = new Block(brownShroom + "_stem", globalNamespace, undefined, "mushroom_stem", redShroom + "_planks", "wood")

  // writeSlabs("cobblestone_brick", "pyrite", "cobblestone_bricks")
  // writeStairs("cobblestone_brick", "pyrite", "cobblestone_bricks")
  // writeWalls("cobblestone_brick", "pyrite", "cobblestone_bricks")
  // writeStairs("mossy_cobblestone_brick", "pyrite", "mossy_cobblestone_bricks")
  // writeSlabs("mossy_cobblestone_brick", "pyrite", "mossy_cobblestone_bricks")

  // writeWalls("mossy_cobblestone_brick", "pyrite", "mossy_cobblestone_bricks")
  // // writeBlock("mossy_cobblestone_bricks", "mossy_cobblestone_bricks", "pyrite", "mossy_cobblestone_bricks")

  // writeBlock("cobblestone_bricks", "cobblestone_bricks", "pyrite", "cobblestone_bricks")
  // writeBlock("smooth_stone_bricks", "smooth_stone_bricks", "pyrite", "smooth_stone_bricks")
  // writeBrickSlab("smooth_stone", namespace)
  // writeBrickStairs("smooth_stone", namespace)
  // writeBrickWall("smooth_stone", namespace)
  // writeWallGates("smooth_stone_brick", namespace, "smooth_stone_bricks")


  // writeBlock("nostalgia_cobblestone", "nostalgia_cobblestone", "pyrite", "nostalgia_cobblestone")
  // writeBlock("nostalgia_mossy_cobblestone", "nostalgia_mossy_cobblestone", "pyrite", "nostalgia_mossy_cobblestone")
  // writeBlock("nostalgia_netherrack", "nostalgia_netherrack", "pyrite", "nostalgia_netherrack")
  // writeBlock("nostalgia_gravel", "nostalgia_gravel", "pyrite", "nostalgia_gravel")
  // writeBlock("nostalgia_gravel", "nostalgia_gravel", "pyrite", "nostalgia_gravel")
  // writeBlock("nostalgia_grass_block", "nostalgia_grass_block", "pyrite", "nostalgia_grass_block")

  // writeBlock("framed_glass", "framed_glass", "pyrite", "framed_glass", "framed_glass")
  // writePaneBlock("framed_glass", "pyrite", "framed_glass")


  // writeBlock("nostalgia_cobblestone", "nostalgia_cobblestone", "pyrite", "nostalgia_cobblestone")
  // writeBlock("nostalgia_mossy_cobblestone", "nostalgia_mossy_cobblestone", "pyrite", "nostalgia_mossy_cobblestone")
  // writeBlock("nostalgia_netherrack", "nostalgia_netherrack", "pyrite", "nostalgia_netherrack")
  // writeBlock("nostalgia_gravel", "nostalgia_gravel", "pyrite", "nostalgia_gravel")
  // writeBlock("nostalgia_gravel", "nostalgia_gravel", "pyrite", "nostalgia_gravel")
  // writeBlock("nostalgia_grass_block", "nostalgia_grass_block", "pyrite", "nostalgia_grass_block")

  // writeBlock("framed_glass", "framed_glass", "pyrite", "framed_glass", "framed_glass")
  // writePaneBlock("framed_glass", "pyrite", "framed_glass")

  // writeBlock("grass_turf", "grass_turf", "pyrite", "grass_block_top")
  // writeSlabs("grass_turf", "pyrite", "grass_block_top")
  // writeStairs("grass_turf", "pyrite", "grass_turf_block_top")
  // writeBlock("nostalgia_grass_turf", "nostalgia_grass_turf", "pyrite", "nostalgia_grass_top")
  // writeSlabs("nostalgia_grass", "pyrite", "nostalgia_grass_top")
  // writeStairs("nostalgia_grass", "pyrite", "nostalgia_grass_top")




  // modDyes.forEach(function (dye) {
  //   namespace = "pyrite"
  //   // writeDye(dye, dye, namespace)
  //   // writeWool(dye, dye, namespace)

  //   // writeCarpet(dye + "_carpet", namespace, dye + "_wool")
  //   // writeTerracotta(dye, dye, namespace)


  // })
  // namespace = "pyrite"

  // writeLamps("glowstone", "glowstone", namespace)
  // writeLamps("lit_redstone", "lit_redstone", namespace, "minecraft")

  // writeWallGates("cobblestone_brick", namespace, "cobblestone_bricks")
  // writeWallGates("mossy_cobblestone_brick", namespace, "mossy_cobblestone_bricks")


  // writeBrickSlab("charred_nether", namespace)
  // writeBrickStairs("charred_nether", namespace)
  // writeBrickWall("charred_nether", namespace)
  // writeWallGates("charred_nether_brick", namespace, "charred_nether_bricks")


  // writeBrickSlab("blue_nether", namespace)
  // writeBrickStairs("blue_nether", namespace)
  // writeBrickWall("blue_nether", namespace)
  // writeWallGates("blue_nether_brick", namespace, "blue_nether_bricks")

  // writeVanillaWalls(walls)
  // writeVanillaWalls(trialsWalls)




  // cut.forEach(function (block) {
  //   const ogBaseBlock = block;
  //   let baseBlock = block
  //   if (block == "copper") { }
  //   else if (block == "exposed_copper") { }
  //   else if (block == "oxidized_copper") { }
  //   else if (block == "weathered_copper") { }
  //   else {
  //     baseBlock = baseBlock + "_block"
  //   }
  //   const baseIngot = block + "_ingot"
  //   // writeBlock(`cut_${block}`, "cut_iron", "pyrite", `cut_${block}`)
  //   // writeSlabs(`cut_${block}`, "pyrite", `cut_${block}`)
  //   // writeStairs(`cut_${block}`, "pyrite", `cut_${block}`)
  //   // writeWalls(`cut_${block}`, "pyrite")
  //   // writeWallGates(`cut_${block}`, namespace, `cut_${block}`, namespace)

  //   //  writeSlabs(`smooth_${block}`, "pyrite", `smooth_${block}`)
  //   // writeStairs(`smooth_${block}`, "pyrite", `smooth_${block}`)
  //   // writeWalls(`smooth_${block}`, "pyrite")
  //   // writeWallGates(`smooth_${block}`, namespace, `smooth_${block}`, namespace)

  //   // writeBlock(`${block}_bricks`, "cut_"+baseBlock, "pyrite",  "resource_bricks")
  //   // writeChiseledBlock(`chiseled_${block}_block`, baseBlock, "pyrite",  "chiseled_resource")
  //   // writeChiseledBlock(`${block}_pillar`, baseBlock, "pyrite",  "resource_pillar")
  //   // writeBlock(`smooth_${block}`, baseBlock, "pyrite",  "smooth_resource")
  //   // writeBarBlock(block, "pyrite", baseBlock)
  //   // writeDoors(block, "dye", "pyrite", baseBlock)
  //   // writeTrapdoors(block, "dye", "pyrite", baseBlock)
  //   // writeBlock(`nostalgia_${block}_block`, baseBlock, "pyrite",  "nostalgia")

  //   // writeButtons(block, "pyrite", baseBlock, "minecraft")
  //   // writePlates(block, "pyrite", baseBlock, "minecraft")


  // })

//   trialsWalls.forEach(function(wall) {
//     let blockTemplate = wall
//     baseBlock = blockTemplate
//     baseBlock = `${baseBlock.replace("brick", "bricks")}`
//     baseBlock = `${baseBlock.replace("tile", "tiles")}`
//     // writeWallGates(blockTemplate, namespace, baseBlock, "minecraft")

//   // writeCarpet("grass_carpet", namespace, "grass_block_top", "minecraft")
//   // writeCarpet("mycelium_carpet", namespace, "mycelium_top", "minecraft")
//   // writeCarpet("path_carpet", namespace, "dirt_path_top", "minecraft")
//   // writeCarpet("podzol_carpet", namespace, "podzol_top", "minecraft")
//   // writeCarpet("nostalgia_grass_carpet", namespace, "nostalgia_grass_top", namespace)

//   // writeFenceGates("nether_brick", namespace, "nether_bricks", "minecraft")
//   // writeFlower("rose", namespace, "pyrite")
//   // writeFlower("blue_rose", namespace, "pyrite")
//   // writeFlower("orange_rose", namespace, "pyrite")
//   // writeFlower("white_rose", namespace, "pyrite")
//   // writeFlower("pink_rose", namespace, "pyrite")
//   // writeFlower("paeonia", namespace, "pyrite")
//   // writeFlower("pink_daisy", namespace, "pyrite")
//   // writeFlower("buttercup", namespace, "pyrite")


//   // //   // writeStonecutterRecipes(`${block}_button`, "block", baseBlock, "pyrite", "minecraft")
//   // //   writeStonecutterRecipes(`smooth_${block}_wall_gate`, "wall", "smooth_"+ogBaseBlock, "pyrite", "pyrite")

//   //   // writeButtons(block, "pyrite", baseBlock, "minecraft")
//   //   // writePlates(block, "pyrite", baseBlock, "minecraft")
//   //   // writeRecipes(block+"_pressure_plate", "plates", baseIngot, "pyrite", "minecraft")
//   //   // printLang(`${block}_button`)
//   //   // if (baseBlock == "quartz_block") {
//   //   //   console.log(`"pyrite:smooth_${block}_slab",`)
//   //   //   console.log(`"pyrite:smooth_${block}_stairs",`)
//   //   //   console.log(`"pyrite:smooth_${block}_wall_gate",`)
//   //   //   console.log(`"pyrite:smooth_${block}_wall",`)
//   //   // }

//   // })


//   // writeCarpet("grass_carpet", namespace, "grass_block_top", "minecraft")
//   // writeCarpet("mycelium_carpet", namespace, "mycelium_top", "minecraft")
//   // writeCarpet("path_carpet", namespace, "dirt_path_top", "minecraft")
//   // writeCarpet("podzol_carpet", namespace, "podzol_top", "minecraft")
//   // writeCarpet("nostalgia_grass_carpet", namespace, "nostalgia_grass_top", namespace)

//   // writeFenceGates("nether_brick", namespace, "nether_bricks", "minecraft")
//   // writeFlower("rose", namespace, "pyrite")
//   // writeFlower("blue_rose", namespace, "pyrite")
//   // writeFlower("orange_rose", namespace, "pyrite")
//   // writeFlower("white_rose", namespace, "pyrite")
//   // writeFlower("pink_rose", namespace, "pyrite")
//   // writeFlower("paeonia", namespace, "pyrite")
//   // writeFlower("pink_daisy", namespace, "pyrite")
//   // writeFlower("buttercup", namespace, "pyrite")


}



generateResources()


function writeLang() {
  writeFile(`${paths.assets}lang/en_us.json`, JSON.stringify(blockTranslations, undefined, " "))

}

function writeFile(path, data) {
  const demoMode = false
  if (data instanceof Object) {
    data = JSON.stringify(data)
  }
  else {
    data = JSON.parse(data)
    data = JSON.stringify(data)
  }
  if (demoMode == false) {
    fs.writeFile(path, data, function (err) { if (err) throw err; })
  }
}

function writeBlockstate(block, blockState, namespace) {
  writeFile(`${paths.blockstates}${block}.json`, blockState)
}

function writeOldBlockstate(block, blockState, namespace) {
  writeFile(`${paths.infiniteblockstates}${block}.json`, blockState)
}

function writePlankBlockModels(block, namespace, baseBlock, model, render_type) {
  blockModel = generateBlockModel(block, namespace, baseBlock, model, render_type)
  writeFile(`${paths.models}${block}.json`, blockModel)
}

function writeMirroredBricksBlockModels(block, namespace, baseBlock) {
  writeFile(`${paths.models}${block}.json`, generateBlockModel(block, namespace, baseBlock))
  writeFile(`${paths.models}${block}_north_west_mirrored.json`, generateBlockModel(block, namespace, baseBlock, "minecraft:block/cube_north_west_mirrored_all"))

}

function writeCraftingTableBlockModels(block, namespace, baseBlock, altNamespace) {
  blockModel = generateCraftingTableBlockModel(block, namespace, baseBlock, altNamespace)
  writeFile(`${paths.models}${block}.json`, blockModel, function (err) {
    if (err) throw err;

  });
}

function writeLeverBlockModels(block, namespace, baseBlock, altNamespace) {
  if (altNamespace == "minecraft") {
    writeFile(`${paths.models}${block}_upright.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "upright"))

  }
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  writeFile(`${paths.models}${block}.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace))
  writeFile(`${paths.models}${block}_on.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "on"))
  writeFile(`${paths.models}${block}_wall.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "wall"))


}

function writeTorchBlockModels(block, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  writeFile(`${paths.models}${baseBlock}_upright.json`, generateTorchBlockModel(block, namespace, baseBlock, altNamespace, "template_torch"))
  writeFile(`${paths.models}${block}_wall.json`, generateTorchBlockModel(block, namespace, baseBlock, altNamespace, "template_torch_wall"))


}


function writeCubeColumnBlockModels(block, namespace, baseBlock) {
  writeFile(`${paths.models}${block}.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column"))
  writeFile(`${paths.models}${block}_horizontal.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column_horizontal"))

}

function writeFlowerBlockModels(block, namespace, baseBlock) {
  writeFile(`${paths.models}${block}.json`, generateFlowerBlockModel(block, namespace, baseBlock))

}



function writeLogBlockModels(block, namespace, baseBlock) {
  writeFile(`${paths.models}${block}.json`, generateLogModel(block, namespace, baseBlock, "cube_column"))
  writeFile(`${paths.models}${block}_horizontal.json`, generateLogModel(block, namespace, baseBlock, "cube_column_horizontal"))

}

function generateLang(block, type, namespace) {
  if (type == undefined) {
    type = "block"
  }
  let langBlock = block
  langBlock = langBlock.replaceAll("_", " ")
  langBlock = langBlock.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  return `"${type}.${namespace}.${block}": "${langBlock}",`

}

function generateLangObject(block, type, namespace) {
  if (type == undefined) {
    type = "block"
  }
  let langBlock = block
  langBlock = langBlock.replaceAll("_", " ")
  langBlock = langBlock.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

  blockTranslations = Object.assign(blockTranslations, JSON.parse(`{"${type}.${namespace}.${block}": "${langBlock}"}`))


}

function printLang(block, type) {
  console.log(generateLang(block, type))

}

function printBlock(block) {
  console.log(`"${namespace}:${block}",`)

}

function generateWallBlockModel(block, namespace, baseBlock, parent) {
  return `{
      "parent": "minecraft:block/${parent}",
      "textures": {
        "wall": "${namespace}:block/${baseBlock}"
      }
    }`
}

function writeWallBlockModels(block, namespace, baseBlock) {
  postModel = generateWallBlockModel(block, namespace, baseBlock, "template_wall_post")
  sideModel = generateWallBlockModel(block, namespace, baseBlock, "template_wall_side")
  invModel = generateWallBlockModel(block, namespace, baseBlock, "wall_inventory")
  tallModel = generateWallBlockModel(block, namespace, baseBlock, "template_wall_side_tall")

  writeFile(`${paths.models}${block}_post.json`, postModel)
  writeFile(`${paths.models}${block}_side.json`, sideModel)
  writeFile(`${paths.models}${block}_inventory.json`, invModel)
  writeFile(`${paths.models}${block}_side_tall.json`, tallModel)


}


function writePaneBlockModels(block, namespace, baseBlock) {

  writeFile(`${paths.models}${block}_post.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_post"))
  writeFile(`${paths.models}${block}_side.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_side"))
  writeFile(`${paths.models}${block}_noside.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_noside"))
  writeFile(`${paths.models}${block}_side_alt.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_side_alt"))
  writeFile(`${paths.models}${block}_noside_alt.json`, generatePaneBlockModels(block, namespace, baseBlock, "template_glass_pane_noside_alt"))
}

function generatePaneBlockModels(block, namespace, baseBlock, model) {
  return `{
    "parent": "minecraft:block/${model}",
    "textures": {
      "pane": "pyrite:block/${baseBlock}",
      "edge": "pyrite:block/framed_glass_pane_top"
    },
    "render_type": "translucent"
  }`
}

function writeStairBlockModels(block, namespace, baseBlock) {
  stairModel = `{
    "parent": "minecraft:block/stairs",
    "textures": {
      "bottom": "${namespace}:block/${baseBlock}",
      "top": "${namespace}:block/${baseBlock}",
      "side": "${namespace}:block/${baseBlock}"
    }
  }`
  stairModelInner = `{
      "parent": "minecraft:block/inner_stairs",
      "textures": {
        "bottom": "${namespace}:block/${baseBlock}",
        "top": "${namespace}:block/${baseBlock}",
        "side": "${namespace}:block/${baseBlock}"
      }
  }`
  stairModelOuter = `{
    "parent": "minecraft:block/outer_stairs",
    "textures": {
      "bottom": "${namespace}:block/${baseBlock}",
      "top": "${namespace}:block/${baseBlock}",
      "side": "${namespace}:block/${baseBlock}"
    }
  }`
  fs.writeFile(`${paths.models}${block}.json`, stairModel, function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_inner.json`, stairModelInner, function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_outer.json`, stairModelOuter, function (err) {
    if (err) throw err;

  });
}

function writeButtonBlockModels(block, namespace, baseBlock) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  buttonModel = `{
        "parent": "minecraft:block/button",
        "textures": {
          "texture": "${namespace}:block/${baseBlock}"
        }
      }`
  buttonModelInventory = `{
        "parent": "minecraft:block/button_inventory",
        "textures": {
            "texture": "${namespace}:block/${baseBlock}"
        }
      }`
  buttonModelPressed = `{
        "parent": "minecraft:block/button_pressed",
        "textures": {
            "texture": "${namespace}:block/${baseBlock}"
        }
      }`
  fs.writeFile(`${paths.models}${block}.json`, buttonModel, function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_inventory.json`, buttonModelInventory, function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_pressed.json`, buttonModelPressed, function (err) {
    if (err) throw err;

  });
}

function writeSlabBlockModels(block, namespace, baseBlock) {

  slabModel = `{
        "parent": "minecraft:block/slab",
        "textures": {
        "bottom": "${namespace}:block/${baseBlock}",
        "top": "${namespace}:block/${baseBlock}",
        "side": "${namespace}:block/${baseBlock}"
        }
    }`
  slabModelTop = `{
        "parent": "minecraft:block/slab_top",
        "textures": {
        "bottom": "${namespace}:block/${baseBlock}",
        "top": "${namespace}:block/${baseBlock}",
        "side": "${namespace}:block/${baseBlock}"
        }
    }`

  fs.writeFile(`${paths.models}${block}.json`, slabModel, function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_top.json`, slabModelTop, function (err) {
    if (err) throw err;

  });
}

function writePlateBlockModels(block, namespace, baseBlock) {

  plateModel = `{
        "parent": "minecraft:block/pressure_plate_up",
        "textures": {
          "texture": "${namespace}:block/${baseBlock}"
        }
      }`
  plateModelDown = `{
        "parent": "minecraft:block/pressure_plate_down",
        "textures": {
          "texture": "${namespace}:block/${baseBlock}"
        }
      }`

  fs.writeFile(`${paths.models}${block}.json`, plateModel, function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_down.json`, plateModelDown, function (err) {
    if (err) throw err;

  });
}

function generateFenceBlockModels(block, baseBlock, namespace, model) {
  return `{
  "parent": "minecraft:block/${model}",
  "textures": {
    "texture": "${namespace}:block/${baseBlock}"
  }
}`
}

function writeFenceBlockModels(block, baseBlock, namespace) {
  writeFile(`${paths.models}${block}_post.json`, generateFenceBlockModels(block, baseBlock, namespace, "fence_post"), function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_side.json`, generateFenceBlockModels(block, baseBlock, namespace, "fence_side"), function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_inventory.json`, generateFenceBlockModels(block, baseBlock, namespace, "fence_inventory"), function (err) {
    if (err) throw err;

  });
}

function generateFenceGateBlockModels(block, namespace, baseBlock, model, altNamespace) {
  return `{
    "parent": "${altNamespace}:block/${model}",
    "textures": {
      "texture": "${namespace}:block/${baseBlock}"
    }
  }`
}

function writeFenceGateBlockModels(block, namespace, baseBlock) {
  writeFile(`${paths.models}${block}.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate", "minecraft"))
  writeFile(`${paths.models}${block}_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_open", "minecraft"))
  writeFile(`${paths.models}${block}_wall.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_wall", "minecraft"))
  writeFile(`${paths.models}${block}_wall_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_wall_open", "minecraft"))
}

function writeWallGateBlockModels(block, namespace, baseBlock) {
  writeFile(`${paths.models}${block}.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate", "minecraft"))
  writeFile(`${paths.models}${block}_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_open", "minecraft"))
  writeFile(`${paths.models}${block}_wall.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_wall_gate_wall", "pyrite"))
  writeFile(`${paths.models}${block}_wall_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_wall_gate_wall_open", "pyrite"))
}

function writeDoorBlockModels(block, namespace, baseBlock) {

  writeFile(`${paths.models}${block}_top_left.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_left"))
  writeFile(`${paths.models}${block}_top_right.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_right"))
  writeFile(`${paths.models}${block}_bottom_left.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_left"))
  writeFile(`${paths.models}${block}_bottom_right.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_right"))
  writeFile(`${paths.models}${block}_top_left_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_left_open"))
  writeFile(`${paths.models}${block}_top_right_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_right_open"))
  writeFile(`${paths.models}${block}_bottom_left_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_left_open"))
  writeFile(`${paths.models}${block}_bottom_right_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_right_open"))

  //INFINITE MODELS
  writeFile(`${paths.infinitemodels}${block}_top.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top"))
  writeFile(`${paths.infinitemodels}${block}_top_hinge.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_rh"))
  writeFile(`${paths.infinitemodels}${block}_bottom.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom"))
  writeFile(`${paths.infinitemodels}${block}_bottom_hinge.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_rh"))


}


function writeTrapdoorBlockModels(block, namespace, baseBlock) {

  fs.writeFile(`${paths.models}${block}_top.json`, generateTrapdoorBlockModels(block, namespace, baseBlock, "template_orientable_trapdoor_top"), function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_bottom.json`, generateTrapdoorBlockModels(block, namespace, baseBlock, "template_orientable_trapdoor_bottom"), function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_open.json`, generateTrapdoorBlockModels(block, namespace, baseBlock, "template_orientable_trapdoor_open"), function (err) {
    if (err) throw err;

  });
}

function writeCarpetBlockModels(block, namespace, baseBlock) {
  carpetModel = `{
    "parent": "minecraft:block/carpet",
    "textures": {
      "wool": "${namespace}:block/${baseBlock}"
    }
  }`
  if (block == "grass_carpet") {
    carpetModel = `{
      "parent": "minecraft:block/carpet",
      "textures": {
        "wool": "minecraft:block/grass_block_top"
      },
      "elements": [
        {   "from": [ 0, 0, 0 ],
            "to": [ 16, 1, 16 ],
            "faces": {
              "down":  { "uv": [ 0, 0, 16, 16 ], "texture": "#wool", "cullface": "down", "tintindex": 0  },
              "up":    { "uv": [ 0, 0, 16, 16 ], "texture": "#wool",    "cullface": "up", "tintindex": 0 },
              "north": { "uv": [ 0, 0, 16, 16 ], "texture": "#wool",   "cullface": "north", "tintindex": 0  },
              "south": { "uv": [ 0, 0, 16, 16 ], "texture": "#wool",   "cullface": "south", "tintindex": 0  },
              "west":  { "uv": [ 0, 0, 16, 16 ], "texture": "#wool",   "cullface": "west", "tintindex": 0  },
              "east":  { "uv": [ 0, 0, 16, 16 ], "texture": "#wool",   "cullface": "east", "tintindex": 0  }
    
            }
        }
    ]
    }`
  }

  fs.writeFile(`${paths.models}${block}.json`, carpetModel, function (err) {
    if (err) throw err;
  });
}



function writeBlockItemModel(block, namespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  modelItem = `{
        "parent": "${namespace}:block/${block}"
      }`
  fs.writeFile(`${paths.itemModels}${block}.json`, modelItem, function (err) {
    if (err) throw err;
  });
}

function writeTrapdoorItemModel(block, namespace) {
  modelItem = `{
        "parent": "${namespace}:block/${block}_bottom"
      }`
  fs.writeFile(`${paths.itemModels}${block}.json`, modelItem, function (err) {
    if (err) throw err;
  });
}


function writeUniqueItemModel(block, namespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  modelItem = `{
    "parent": "minecraft:item/generated",
    "textures": {
      "layer0": "${namespace}:item/${block}"
    }
  }`
  fs.writeFile(`${paths.itemModels}${block}.json`, modelItem, function (err) {
    if (err) throw err;
  });
}

function writeUniqueBlockItemModel(block, namespace, altNamespace, baseBlock) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if (altNamespace == undefined) {
    altNamespace = "namespace"
  }
  if (baseBlock == undefined) {
    baseBlock = block
  }
  modelItem = `{
    "parent": "minecraft:item/generated",
    "textures": {
      "layer0": "${altNamespace}:block/${baseBlock}"
    }
  }`
  writeFile(`${paths.itemModels}${block}.json`, modelItem)
}


function writeInventoryModel(block, namespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  modelItem = `{
        "parent": "${namespace}:block/${block}_inventory"
      }`

  fs.writeFile(`${paths.itemModels}${block}.json`, modelItem, function (err) {
    if (err) throw err;
  });
}

function writePlanks(block, dye, namespace, baseBlock) {
  block = block + "_planks"
  writeBlock(block, dye, namespace, "planks", baseBlock)
}
function writeTerracotta(block, dye, namespace, baseBlock) {
  block = block + "_terracotta"
  writeBlock(block, dye, namespace, "terracotta", baseBlock)
}

function writeLamps(block, dye, namespace) {
  block = block + "_lamp"
  writeBlock(block, dye, namespace, "lamps")

}

function writeWool(block, dye, namespace) {
  block = block + "_wool"
  writeBlock(block, dye, namespace, "wool")

}

function writeTerracottaBricks(block, namespace, special, baseBlock) {
  blockState = `{
    "variants": {
      "": {
        "model": "${namespace}:block/${block}_north_west_mirrored"
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writeMirroredBricksBlockModels(block, namespace, baseBlock)
  writeBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeRecipes(block, special, baseBlock)


}

function writeDye(item, dye, namespace) {
  item = item + "_dye"
  writeItem(item, dye, namespace, "dye")

}

function writeItem(item, namespace) {
  writeUniqueItemModel(item, namespace)

}


function writeDoors(block, namespace, baseBlock) {
  doorBlockState = generateDoorBlockState(block, namespace, baseBlock)
  writeBlockstate(block, doorBlockState, namespace)
  writeOldBlockstate(block, generateOldDoorBlockState(block, namespace, baseBlock), namespace)
  writeDoorBlockModels(block, namespace)
  writeUniqueItemModel(block, namespace)
  createTags(block, namespace)
  writeRecipes(block, "door", baseBlock)


}

function writeTrapdoors(block, namespace, baseBlock) {
  doorBlockState = generateTrapdoorBlockState(block, namespace, baseBlock)
  writeBlockstate(block, doorBlockState, namespace)
  writeTrapdoorBlockModels(block, namespace, baseBlock)
  writeTrapdoorItemModel(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, "trapdoor", baseBlock)

}


function writeBlock(block, namespace, blockType, baseBlock, render_type) {
  blockState = `{
    "variants": {
      "": {
        "model": "${namespace}:block/${block}"
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writePlankBlockModels(block, namespace, baseBlock, undefined, render_type)
  writeBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeLootTables(block, namespace)

  writeRecipes(block, blockType, baseBlock, namespace)




}


function writeAnyBlock(block, blockType, namespace, special, baseBlock, render_type) {

  writeBlockstate(block, generateAnyBlockState(), namespace)
  writeAnyBlockModels(block, namespace, baseBlock, undefined, render_type)
  writeAnyItemModel(block, namespace)
  createTags(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, special, dye)




}

function writeLeverBlock(block, namespace, baseBlock, altNamespace) {
  let uprightBlock;
  if (altNamespace == "minecraft") {
    uprightBlock = block

  }
  else {
    uprightBlock = baseBlock
    uprightBlock += "_torch"
    baseBlock += "_torch"


  }

  blockState = `{
    "variants": {
      "face=ceiling,facing=east,powered=false": {
        "model": "${namespace}:block/${uprightBlock}_upright",
        "x": 180,
        "y": 270
      },
      "face=ceiling,facing=east,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 180,
        "y": 270
      },
      "face=ceiling,facing=north,powered=false": {
        "model": "${namespace}:block/${uprightBlock}_upright",
        "x": 180,
        "y": 180
      },
      "face=ceiling,facing=north,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 180,
        "y": 180
      },
      "face=ceiling,facing=south,powered=false": {
        "model": "${namespace}:block/${uprightBlock}_upright",
        "x": 180
      },
      "face=ceiling,facing=south,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 180
      },
      "face=ceiling,facing=west,powered=false": {
        "model": "${namespace}:block/${uprightBlock}_upright",
        "x": 180,
        "y": 90
      },
      "face=ceiling,facing=west,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 180,
        "y": 90
      },
      "face=floor,facing=east,powered=false": {
        "model": "${namespace}:block/${uprightBlock}_upright",
        "y": 90
      },
      "face=floor,facing=east,powered=true": {
        "model": "${namespace}:block/${block}",
        "y": 90
      },
      "face=floor,facing=north,powered=false": {
        "model": "${namespace}:block/${uprightBlock}_upright"
      },
      "face=floor,facing=north,powered=true": {
        "model": "${namespace}:block/${block}"
      },
      "face=floor,facing=south,powered=false": {
        "model": "${namespace}:block/${uprightBlock}_upright",
        "y": 180
      },
      "face=floor,facing=south,powered=true": {
        "model": "${namespace}:block/${block}",
        "y": 180
      },
      "face=floor,facing=west,powered=false": {
        "model": "${namespace}:block/${uprightBlock}_upright",
        "y": 270
      },
      "face=floor,facing=west,powered=true": {
        "model": "${namespace}:block/${block}",
        "y": 270
      },
      "face=wall,facing=east,powered=false": {
        "model": "${namespace}:block/${block}_wall"
      },
      "face=wall,facing=east,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 90,
        "y": 90
      },
      "face=wall,facing=north,powered=false": {
        "model": "${namespace}:block/${block}_wall",
        "y": 270
      },
      "face=wall,facing=north,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 90
      },
      "face=wall,facing=south,powered=false": {
        "model": "${namespace}:block/${block}_wall",
        "y": 90
      },
      "face=wall,facing=south,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 90,
        "y": 180
      },
      "face=wall,facing=west,powered=false": {
        "model": "${namespace}:block/${block}_wall",
        "y": 180
      },
      "face=wall,facing=west,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 90,
        "y": 270
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writeLeverBlockModels(block, namespace, baseBlock, altNamespace)
  writeUniqueBlockItemModel(block, namespace, altNamespace, baseBlock)
  writeLootTables(block, namespace)
  writeRecipes(block, "torch_lever", baseBlock, namespace, altNamespace)



}

function writeTorchBlock(block, namespace, baseBlock, altNamespace) {
  blockState = `{
    "variants": {
      "face=ceiling,facing=east": {
        "model": "${namespace}:block/${block}_upright",
        "x": 180,
        "y": 270
      },
      "face=ceiling,facing=north": {
        "model": "${namespace}:block/${block}_upright",
        "x": 180,
        "y": 180
      },
      
      "face=ceiling,facing=south": {
        "model": "${namespace}:block/${block}_upright",
        "x": 180
      },
      
      "face=ceiling,facing=west": {
        "model": "${namespace}:block/${block}_upright",
        "x": 180,
        "y": 90
      },
      
      "face=floor,facing=east": {
        "model": "${namespace}:block/${block}_upright",
        "y": 90
      },
      
      "face=floor,facing=north": {
        "model": "${namespace}:block/${block}_upright"
      },
      
      "face=floor,facing=south": {
        "model": "${namespace}:block/${block}_upright",
        "y": 180
      },
      
      "face=floor,facing=west": {
        "model": "${namespace}:block/${block}_upright",
        "y": 270
      },
      
      "face=wall,facing=east": {
        "model": "${namespace}:block/${block}_wall"
      },
      
      "face=wall,facing=north": {
        "model": "${namespace}:block/${block}_wall",
        "y": 270
      },  
      "face=wall,facing=south": {
        "model": "${namespace}:block/${block}_wall",
        "y": 90
      },
    
      "face=wall,facing=west": {
        "model": "${namespace}:block/${block}_wall",
        "y": 180
      }
      
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writeTorchBlockModels(block, namespace, block, altNamespace)
  writeUniqueBlockItemModel(block, namespace, namespace, block)
  writeLootTables(block, namespace)
  writeRecipes(block, "torch", baseBlock, namespace, altNamespace)



}



function writeCraftingTableBlock(block, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  blockState = `{
    "variants": {
      "": {
        "model": "${namespace}:block/${block}"
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writeCraftingTableBlockModels(block, namespace, baseBlock, altNamespace)
  writeBlockItemModel(block, namespace)
  writeRecipes(block, "crafting_table", baseBlock, namespace, altNamespace)

}

function writeLadders(block, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  blockState = `{
    "variants": {
      "facing=east": {
        "model": "${namespace}:block/${block}",
        "y": 90
      },
      "facing=north": {
        "model": "${namespace}:block/${block}"
      },
      "facing=south": {
        "model": "${namespace}:block/${block}",
        "y": 180
      },
      "facing=west": {
        "model": "${namespace}:block/${block}",
        "y": 270
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writePlankBlockModels(block, namespace, baseBlock, "pyrite:block/template_ladder")
  writeUniqueBlockItemModel(block, namespace, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, "ladder", baseBlock, namespace, altNamespace)




}


function writeChests(block, dye, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  block += "_chest"
  blockState = `{
    "variants": {
      "": {
        "model": "${namespace}:block/${block}"
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writePlankBlockModels(block, namespace, baseBlock)
  writeUniqueBlockItemModel(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, "chest", baseBlock, namespace, altNamespace)



}


function writeFlower(block, dye, namespace, special, baseBlock) {
  blockState = `{
    "variants": {
      "": {
        "model": "${namespace}:block/${block}"
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writeFlowerBlockModels(block, namespace, baseBlock)
  writeUniqueBlockItemModel(block, namespace)
  // createTags(block, namespace)
  writeLootTables(block, namespace)
  // writeRecipes(block, special, dye)




}

function writeChiseledBlock(block, dye, namespace, special, baseBlock) {
  blockState = `{
    "variants": {
      "axis=x": {
        "model": "${namespace}:block/${block}_horizontal",
        "x": 90,
        "y": 90
      },
      "axis=y": {
        "model": "${namespace}:block/${block}"
      },
      "axis=z": {
        "model": "${namespace}:block/${block}_horizontal",
        "x": 90
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writeCubeColumnBlockModels(block, namespace, baseBlock)
  writeBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, special, dye)




}

function writePaneBlock(block, namespace, baseBlock) {
  baseBlock = block
  writeBlockstate(block, generatePaneBlockState(block, namespace, baseBlock), namespace)
  writePaneBlockModels(block, namespace, baseBlock)
  writeUniqueBlockItemModel(block, namespace, namespace, baseBlock)
  createTags(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, "glass_pane", baseBlock)


}

function writeBarBlock(block, namespace, baseBlock) {
  baseBlock = block
  block = block + "_bars"
  writeBlockstate(block, generateBarBlockState(block, namespace, baseBlock), namespace)
  writePaneBlockModels(block, namespace, baseBlock)
  writeUniqueBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeLootTables(block, namespace)
  // writeRecipes(block, "bars", baseBlock)


}

function generatePaneBlockState(block, namespace, baseBlock) {
  return `{
    "multipart": [
      {
        "apply": {
          "model": "${namespace}:block/${block}_post"
        }
      },
      {
        "when": {
          "north": "true"
        },
        "apply": {
          "model": "${namespace}:block/${block}_side"
        }
      },
      {
        "when": {
          "east": "true"
        },
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "y": 90
        }
      },
      {
        "when": {
          "south": "true"
        },
        "apply": {
          "model": "${namespace}:block/${block}_side_alt"
        }
      },
      {
        "when": {
          "west": "true"
        },
        "apply": {
          "model": "${namespace}:block/${block}_side_alt",
          "y": 90
        }
      },
      {
        "when": {
          "north": "false"
        },
        "apply": {
          "model": "${namespace}:block/${block}_noside"
        }
      },
      {
        "when": {
          "east": "false"
        },
        "apply": {
          "model": "${namespace}:block/${block}_noside_alt"
        }
      },
      {
        "when": {
          "south": "false"
        },
        "apply": {
          "model": "${namespace}:block/${block}_noside_alt",
          "y": 90
        }
      },
      {
        "when": {
          "west": "false"
        },
        "apply": {
          "model": "${namespace}:block/${block}_noside",
          "y": 270
        }
      }
    ]
  }`
}

function generateBarBlockState(block, namespace, baseBlock) {
  return `{
    "multipart": [
      {
        "apply": {
          "model": "${namespace}:block/${block}_post_ends"
        }
      },
      {
        "when": {
          "north": "false",
          "west": "false",
          "south": "false",
          "east": "false"
        },
        "apply": {
          "model": "${namespace}:block/${block}_post"
        }
      },
      {
        "when": {
          "north": "true",
          "west": "false",
          "south": "false",
          "east": "false"
        },
        "apply": {
          "model": "${namespace}:block/${block}_cap"
        }
      },
      {
        "when": {
          "north": "false",
          "west": "false",
          "south": "false",
          "east": "true"
        },
        "apply": {
          "model": "${namespace}:block/${block}_cap",
          "y": 90
        }
      },
      {
        "when": {
          "north": "false",
          "west": "false",
          "south": "true",
          "east": "false"
        },
        "apply": {
          "model": "${namespace}:block/${block}_cap_alt"
        }
      },
      {
        "when": {
          "north": "false",
          "west": "true",
          "south": "false",
          "east": "false"
        },
        "apply": {
          "model": "${namespace}:block/${block}_cap_alt",
          "y": 90
        }
      },
      {
        "when": {
          "north": "true"
        },
        "apply": {
          "model": "${namespace}:block/${block}_side"
        }
      },
      {
        "when": {
          "east": "true"
        },
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "y": 90
        }
      },
      {
        "when": {
          "south": "true"
        },
        "apply": {
          "model": "${namespace}:block/${block}_side_alt"
        }
      },
      {
        "when": {
          "west": "true"
        },
        "apply": {
          "model": "${namespace}:block/${block}_side_alt",
          "y": 90
        }
      }
    ]
  }`
}

function writeLogs(block, namespace, special) {
  blockState = `{
    "variants": {
      "axis=x": {
        "model": "${namespace}:block/${block}_horizontal",
        "x": 90,
        "y": 90
      },
      "axis=y": {
        "model": "${namespace}:block/${block}"
      },
      "axis=z": {
        "model": "${namespace}:block/${block}_horizontal",
        "x": 90
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writeLogBlockModels(block, namespace)
  writeBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeRecipes(block, special)


}
// writeBlock("glowing_obsidian", "glowing_obsidian", "pyrite", "glowing_obsidian")
// writeBlock("nostalgia_glowing_obsidian", "glowing_obsidian", "pyrite", "glowing_obsidian")

function writeWalls(block, namespace, baseBlock) {

  wallBlockState = `{
    "multipart": [
      {
        "apply": {
          "model": "${namespace}:block/${block}_post"
        },
        "when": {
          "up": "true"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "uvlock": true
        },
        "when": {
          "north": "low"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "uvlock": true,
          "y": 90
        },
        "when": {
          "east": "low"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "uvlock": true,
          "y": 180
        },
        "when": {
          "south": "low"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "uvlock": true,
          "y": 270
        },
        "when": {
          "west": "low"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side_tall",
          "uvlock": true
        },
        "when": {
          "north": "tall"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side_tall",
          "uvlock": true,
          "y": 90
        },
        "when": {
          "east": "tall"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side_tall",
          "uvlock": true,
          "y": 180
        },
        "when": {
          "south": "tall"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side_tall",
          "uvlock": true,
          "y": 270
        },
        "when": {
          "west": "tall"
        }
      }
    ]
  }`
  writeBlockstate(block, wallBlockState, namespace)
  writeWallBlockModels(block, namespace, baseBlock)
  writeInventoryModel(block, namespace)
  createTags(block, namespace)
  writeRecipes(block, "wall", baseBlock, namespace)

  // writeStonecutterRecipes(block, "wall", baseBlock, namespace, namespace)

}



function writeStairs(block, namespace, baseBlock) {
  stairBlockState = `{
        "variants": {
          "facing=east,half=bottom,shape=inner_left": {
            "model": "${namespace}:block/${block}_inner",
            "y": 270,
            "uvlock": true
          },
          "facing=east,half=bottom,shape=inner_right": {
            "model": "${namespace}:block/${block}_inner"
          },
          "facing=east,half=bottom,shape=outer_left": {
            "model": "${namespace}:block/${block}_outer",
            "y": 270,
            "uvlock": true
          },
          "facing=east,half=bottom,shape=outer_right": {
            "model": "${namespace}:block/${block}_outer"
          },
          "facing=east,half=bottom,shape=straight": {
            "model": "${namespace}:block/${block}"
          },
          "facing=east,half=top,shape=inner_left": {
            "model": "${namespace}:block/${block}_inner",
            "x": 180,
            "uvlock": true
          },
          "facing=east,half=top,shape=inner_right": {
            "model": "${namespace}:block/${block}_inner",
            "x": 180,
            "y": 90,
            "uvlock": true
          },
          "facing=east,half=top,shape=outer_left": {
            "model": "${namespace}:block/${block}_outer",
            "x": 180,
            "uvlock": true
          },
          "facing=east,half=top,shape=outer_right": {
            "model": "${namespace}:block/${block}_outer",
            "x": 180,
            "y": 90,
            "uvlock": true
          },
          "facing=east,half=top,shape=straight": {
            "model": "${namespace}:block/${block}",
            "x": 180,
            "uvlock": true
          },
          "facing=north,half=bottom,shape=inner_left": {
            "model": "${namespace}:block/${block}_inner",
            "y": 180,
            "uvlock": true
          },
          "facing=north,half=bottom,shape=inner_right": {
            "model": "${namespace}:block/${block}_inner",
            "y": 270,
            "uvlock": true
          },
          "facing=north,half=bottom,shape=outer_left": {
            "model": "${namespace}:block/${block}_outer",
            "y": 180,
            "uvlock": true
          },
          "facing=north,half=bottom,shape=outer_right": {
            "model": "${namespace}:block/${block}_outer",
            "y": 270,
            "uvlock": true
          },
          "facing=north,half=bottom,shape=straight": {
            "model": "${namespace}:block/${block}",
            "y": 270,
            "uvlock": true
          },
          "facing=north,half=top,shape=inner_left": {
            "model": "${namespace}:block/${block}_inner",
            "x": 180,
            "y": 270,
            "uvlock": true
          },
          "facing=north,half=top,shape=inner_right": {
            "model": "${namespace}:block/${block}_inner",
            "x": 180,
            "uvlock": true
          },
          "facing=north,half=top,shape=outer_left": {
            "model": "${namespace}:block/${block}_outer",
            "x": 180,
            "y": 270,
            "uvlock": true
          },
          "facing=north,half=top,shape=outer_right": {
            "model": "${namespace}:block/${block}_outer",
            "x": 180,
            "uvlock": true
          },
          "facing=north,half=top,shape=straight": {
            "model": "${namespace}:block/${block}",
            "x": 180,
            "y": 270,
            "uvlock": true
          },
          "facing=south,half=bottom,shape=inner_left": {
            "model": "${namespace}:block/${block}_inner"
          },
          "facing=south,half=bottom,shape=inner_right": {
            "model": "${namespace}:block/${block}_inner",
            "y": 90,
            "uvlock": true
          },
          "facing=south,half=bottom,shape=outer_left": {
            "model": "${namespace}:block/${block}_outer"
          },
          "facing=south,half=bottom,shape=outer_right": {
            "model": "${namespace}:block/${block}_outer",
            "y": 90,
            "uvlock": true
          },
          "facing=south,half=bottom,shape=straight": {
            "model": "${namespace}:block/${block}",
            "y": 90,
            "uvlock": true
          },
          "facing=south,half=top,shape=inner_left": {
            "model": "${namespace}:block/${block}_inner",
            "x": 180,
            "y": 90,
            "uvlock": true
          },
          "facing=south,half=top,shape=inner_right": {
            "model": "${namespace}:block/${block}_inner",
            "x": 180,
            "y": 180,
            "uvlock": true
          },
          "facing=south,half=top,shape=outer_left": {
            "model": "${namespace}:block/${block}_outer",
            "x": 180,
            "y": 90,
            "uvlock": true
          },
          "facing=south,half=top,shape=outer_right": {
            "model": "${namespace}:block/${block}_outer",
            "x": 180,
            "y": 180,
            "uvlock": true
          },
          "facing=south,half=top,shape=straight": {
            "model": "${namespace}:block/${block}",
            "x": 180,
            "y": 90,
            "uvlock": true
          },
          "facing=west,half=bottom,shape=inner_left": {
            "model": "${namespace}:block/${block}_inner",
            "y": 90,
            "uvlock": true
          },
          "facing=west,half=bottom,shape=inner_right": {
            "model": "${namespace}:block/${block}_inner",
            "y": 180,
            "uvlock": true
          },
          "facing=west,half=bottom,shape=outer_left": {
            "model": "${namespace}:block/${block}_outer",
            "y": 90,
            "uvlock": true
          },
          "facing=west,half=bottom,shape=outer_right": {
            "model": "${namespace}:block/${block}_outer",
            "y": 180,
            "uvlock": true
          },
          "facing=west,half=bottom,shape=straight": {
            "model": "${namespace}:block/${block}",
            "y": 180,
            "uvlock": true
          },
          "facing=west,half=top,shape=inner_left": {
            "model": "${namespace}:block/${block}_inner",
            "x": 180,
            "y": 180,
            "uvlock": true
          },
          "facing=west,half=top,shape=inner_right": {
            "model": "${namespace}:block/${block}_inner",
            "x": 180,
            "y": 270,
            "uvlock": true
          },
          "facing=west,half=top,shape=outer_left": {
            "model": "${namespace}:block/${block}_outer",
            "x": 180,
            "y": 180,
            "uvlock": true
          },
          "facing=west,half=top,shape=outer_right": {
            "model": "${namespace}:block/${block}_outer",
            "x": 180,
            "y": 270,
            "uvlock": true
          },
          "facing=west,half=top,shape=straight": {
            "model": "${namespace}:block/${block}",
            "x": 180,
            "y": 180,
            "uvlock": true
          }
        }
      }`
  writeBlockstate(block, stairBlockState, namespace)
  writeStairBlockModels(block, namespace, baseBlock)
  writeBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeRecipes(block, "stairs", baseBlock, namespace)

  // writeStonecutterRecipes(block, "wall", baseBlock, namespace, namespace)




}

function writeBrickSlab(block, namespace, baseBlock) {
  writeSlabs(block, namespace, baseBlock)



}

function writeBrickStairs(block, namespace, baseBlock) {
  writeStairs(block, namespace, baseBlock)



}


function writeBrickWall(block, namespace, baseBlock) {
  writeWalls(block, namespace, baseBlock)



}



function writeSlabs(block, namespace, baseBlock) {
  slabBlockState = generateSlabBlockState(block, namespace, baseBlock)
  writeBlockstate(block, slabBlockState, namespace)
  writeSlabBlockModels(block, namespace, baseBlock)
  writeBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeRecipes(block, "slabs", baseBlock, namespace)

  // writeStonecutterRecipes(block, "slab", baseBlock, namespace, namespace)



}

function writePlates(block, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  plateBlockState = `{
        "variants": {
          "powered=false": {
            "model": "${namespace}:block/${block}"
          },
          "powered=true": {
            "model": "${namespace}:block/${block}_down"
          }
        }
      }`
  writeBlockstate(block, plateBlockState)
  writePlateBlockModels(block, altNamespace, baseBlock)
  writeBlockItemModel(block, namespace, namespace)
  createTags(block, namespace, baseBlock)
  writeRecipes(block, "plates", baseBlock)

}


function writeButtons(block, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  buttonBlockState = generateButtonBlockState(block, namespace, baseBlock)
  writeBlockstate(block, buttonBlockState)
  writeButtonBlockModels(block, altNamespace, baseBlock)
  writeInventoryModel(block)
  createTags(block)
  writeRecipes(block, "buttons", baseBlock)


}
function writeFences(block, namespace, baseBlock) {
  fenceBlockState = generateFenceBlockState(block, namespace, baseBlock)
  writeBlockstate(block, fenceBlockState)
  writeFenceBlockModels(block, baseBlock, namespace)
  writeInventoryModel(block)
  createTags(block)
  writeRecipes(block, "fences", baseBlock, namespace)



}

function writeFenceGates(block, namespace, baseBlock, altNamespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  fenceGateBlockState = generateFenceGateBlockState(block, namespace)
  writeBlockstate(block, fenceGateBlockState, namespace, baseBlock)
  writeFenceGateBlockModels(block, altNamespace, baseBlock)
  writeBlockItemModel(block, namespace, baseBlock)
  createTags(block, namespace, baseBlock)
  writeRecipes(block, "fence_gates", baseBlock, namespace)



}

function writeWallGates(block, namespace, baseBlock, altNamespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  fenceGateBlockState = generateFenceGateBlockState(block, namespace)
  writeBlockstate(block, fenceGateBlockState, "pyrite", baseBlock)
  writeWallGateBlockModels(block, altNamespace, baseBlock)
  writeBlockItemModel(block, "pyrite", baseBlock)
  createTags(block, namespace, baseBlock)
  writeRecipes(block, "wall_gates", baseBlock, namespace, altNamespace)

}

function generateCarpetBlockState(block, namespace, baseBlock) {
  return `{
    "variants": {
      "": {
        "model": "${namespace}:block/${block}"
      }
    }
  }`
}

function writeCarpet(block, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  writeBlockstate(block, generateCarpetBlockState(block, namespace, baseBlock), "pyrite")
  writeCarpetBlockModels(block, altNamespace, baseBlock)
  writeBlockItemModel(block, namespace)
  if (baseBlock.search("_top") != -1) {
    baseBlock = baseBlock.split("_top")[0]

  }
  writeRecipes(block, "carpet", baseBlock, namespace, altNamespace)


}


function enableNewRecipes() {
  if (version == "1.21.2" || version == "1.21.3" || version == "1.21.4") {
    return true;
  }
  else return false;
}

function itemOrId() {
  if (version == "1.21.2" || version == "1.21.3" || version == "1.21.4") {
    return "id";
  }
  else return "item";
}

function addIngredients(ingredients, ingredient) {
  if (enableNewRecipes() == true) {
    ingredients.push(ingredient)
  }
  else  {
    if (ingredient[0] == "#") {
      ingredients.push({"tag": ingredient.slice(1)}) 
    }
    else {
      ingredients.push({"item": ingredient})  
    }
  }
}

function generateShapelessRecipe(ingredients, result, quantity) {
  recipe = {
      "type": "minecraft:crafting_shapeless",
      "ingredients": []
    }
    if (ingredients instanceof Array) {
      ingredients.forEach(function(ingredient) {
        addIngredients(recipe.ingredients, ingredient)
      })
    }
    else {
      addIngredients(recipe.ingredients, ingredient)
    }
    
    recipe.result =  JSON.parse(`{"${itemOrId()}": "${result}","count": ${quantity}}`)

    return recipe

  }

function createTags(block) {
  tags += `    "pyrite:${block}",\n`

}

function writeTags(file) {
  tags = tags.slice(0, -2)

  tags = `{
    "replace": false,
    "values": [
${tags}
    ]
  }`

  fs.writeFile(`${paths.mctags}${file}`, tags, function (err) {
    if (err) throw err;
  });

}

function writeLootTables(block, namespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  lootTable = `    {
    "type": "minecraft:block",
    "pools": [
      {
        "rolls": 1,
        "entries": [
          {
            "type": "minecraft:item",
            "name": "${namespace}:${block}"
          }
        ],
        "conditions": [
          {
            "condition": "minecraft:survives_explosion"
          }
        ]
      }
    ]
  }

`
  fs.writeFile(`${paths.loot}${block}.json`, lootTable, function (err) {
    if (err) throw err;

  });
}


function writeDoorLootTables(block, namespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  lootTable = `    {
    "type": "minecraft:block",
    "pools": [
      {
        "bonus_rolls": 0.0,
        "conditions": [
          {
            "condition": "minecraft:survives_explosion"
          }
        ],
        "entries": [
          {
            "type": "minecraft:item",
            "conditions": [
              {
                "block": "${namespace}:${block}",
                "condition": "minecraft:block_state_property",
                "properties": {
                  "half": "lower"
                }
              }
            ],
            "name": "${namespace}:${block}"
          }
        ],
        "rolls": 1.0
      }
    ]
}

`
  fs.writeFile(`${paths.loot}${block}.json`, lootTable, function (err) {
    if (err) throw err;

  });
}

function createDyeRecipe(namespace, block, altNamespace, altBlock, other, itemOrTag, baseNamespace) {
  let itemOrID;
  if (version == "1.21.1" || version == "1.21.4") {
    itemOrID = "id"
  }
  else itemOrID = "item"

if (baseNamespace == undefined) {
  baseNamespace = altNamespace
}
  return `{
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "CCC",
      "CDC",
      "CCC"
    ],
    "key": {
      "C": {
        "${itemOrTag}": "${baseNamespace}:${altBlock}"
      },
      "D": {
        "item": "${altNamespace}:${other}"
      }
    },
    "result": {
      "${itemOrID}": "${namespace}:${block}",
      "count": 8
    }
}`
}

function generateRecipes(block, type, other, namespace, altNamespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if (altNamespace == undefined) {
    altNamespace = "pyrite"
  }
  recipe = ""

  if (type == "planks") {
    if ((other == "red_mushroom") || (other == "brown_mushroom")) {
      recipe =  generateShapelessRecipe(`pyrite:${other}_stem`, `${namespace}:${block}`, 4)
    }
    else {
      other = other.replace("stained", "dye")
      altNamespace = changeDyeNamespace(other)
      recipe = createDyeRecipe(namespace, block, altNamespace, "planks", other, "tag")
    }
  }
  else if (type == "ladder") {
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "C C",
      "CDC",
      "C C"
    ],
    "key": {
      "C": {
        "item": "minecraft:stick"
      },
      "D": {
        "item": "${altNamespace}:${other}"
      }
    },
    "result": {
      "${itemOrID}": "${namespace}:${block}",
      "count": 3
    }
}`
  }
  else if (type == "terracotta") {
    other = `${other}_dye`
    altNamespace = changeDyeNamespace(other)
    recipe = createDyeRecipe(namespace, block, altNamespace, "terracotta", other, "item")
  }
  if (type == "terracotta_bricks") {
    altNamespace = changeDyeNamespace(other)
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "CC",
      "CC"
    ],
    "key": {
      "C": {
        "item": "${altNamespace}:${other}"
      }
    },
    "result": {
      "${itemOrID}": "${namespace}:${block}",
      "count": 4
    }
}`
  }
  else if (type == "torch") {
    other = `${other}_dye`
    altNamespace = changeDyeNamespace(other)
    ingredients = [`${altNamespace}:${other}`, "minecraft:torch"]
    result = `"${namespace}:${block}"`
    
    recipe = generateShapelessRecipe(ingredients, result, 1)
  }
  else if (type == "wool") {
    recipe = generateShapelessRecipe([`pyrite:${other}_dye`, "minecraft:white_wool"], `${namespace}:${block}`, 1)
  }
  else if (type == "torch_lever") {
    recipe = generateShapelessRecipe([`${altNamespace}:other`, "minecraft:lever"], `${namespace}:${block}`, 1)
  }
  else if (type == "cobblestone_bricks") {
    recipe = `    {
      "type": "minecraft:crafting_shaped",
      "pattern": [
        "CC",
        "CC"
      ],
      "key": {
        "C": {
          "item": "minecraft:cobblestone"
        }
      },
      "result": {
        "item": "pyrite:cobblestone_bricks",
        "count": 4
      }
    }
`
  }
  else if (type == "smooth_stone_bricks") {
    recipe = `    {
      "type": "minecraft:crafting_shaped",
      "pattern": [
        "CC",
        "CC"
      ],
      "key": {
        "C": {
          "item": "minecraft:smooth_stone"
        }
      },
      "result": {
        "item": "pyrite:smooth_stone_bricks",
        "count": 4
      }
    }
`
  }
  else if (type == "mossy_cobblestone_bricks") {
    recipe = ``
  }
  else if (type == "glowing_obsidian") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "pattern": [
        "X#",
        "#X"
      ],
      "key": {
        "#": {
          "item": "minecraft:crying_obsidian"
        },
        "X": {
          "item": "minecraft:magma_block"
        }
      },
      "result": {
        "item": "pyrite:glowing_obsidian",
        "count": 4
      }
    }
`
  }
  else if (type == "cut_iron") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:iron_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_iron"
      }
    }
`
  }
  else if (type == "cut_gold") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:gold_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_gold"
      }
    }
`
  }
  else if (type == "cut_amethyst") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:iron_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_amethyst"
      }
    }
`
  }
  else if (type == "cut_emerald") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:emerald_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_emerald"
      }
    }
`
  }
  else if (type == "cut_diamond") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:diamond_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_diamond"
      }
    }
`
  }
  else if (type == "cut_lapis") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:lapis_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_lapis"
      }
    }
`
  }
  else if (type == "cut_amethyst") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:amethyst_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_amethyst"
      }
    }
`
  }
  else if (type == "cut_emerald") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:emerald_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_emerald"
      }
    }
`
  }
  else if (type == "cut_quartz") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:iron_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_quartz"
      }
    }
`
  }
  else if (type == "cut_netherite") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "category": "building",
      "key": {
        "#": {
          "item": "minecraft:netherite_block"
        }
      },
      "pattern": [
        "##",
        "##"
      ],
      "result": {
        "count": 4,
        "item": "pyrite:cut_netherite"
      }
    }
`
  }
  else if (type == "framed_glass") {
    recipe = `{
      "type": "minecraft:crafting_shaped",
      "pattern": [
        "X#X",
        "#X#",
        "X#X"
      ],
      "key": {
        "#": {
          "item": "minecraft:glass"
        },
        "X": {
          "item": "minecraft:iron_nugget"
        }
      },
      "result": {
        "item": "pyrite:framed_glass",
      "count": 4
      }
    }
`
  }
  else if ((type == "dyed_framed_glass") || (type == "stained_framed_glass")) {
    const dye = `${other}_dye`
    altNamespace = changeDyeNamespace(dye)
    recipe = createDyeRecipe(namespace, block, altNamespace, "framed_glass", dye, "item", namespace)
  }
  else if (type == "glass_pane") {
    const dye = `${other}_dye`
    altNamespace = changeDyeNamespace(dye)
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "CCC",
      "CCC"
    ],
    "key": {
      "C": {
        "item": "${namespace}:${block.replace("_pane", "")}"
      }
    },
    "result": {
      "item": "${namespace}:${other}",
      "id": "${namespace}:${other}",
      "count": 8
  }
}
`
  }
  else if (type == "lamp") {
    if (block == "glowstone_lamp") {
      recipe = `{
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "X#X",
          "#X#",
          "X#X"
        ],
        "key": {
          "#": {
            "item": "minecraft:glowstone"
          },
          "X": {
            "item": "minecraft:iron_nugget"
          }
        },
        "result": {
          "item": "pyrite:glowstone_lamp",
        "count": 4
        }
      }`
    } else {
      other = `${other}_dye`
      altNamespace = changeDyeNamespace(other)
      recipe = createDyeRecipe(namespace, block, altNamespace, "glowstone_lamp", other, "item", namespace)
    }

  }
  else if (type == "bricks") {

    if (block == "charred_nether_bricks") {
      recipe = `{
        "type": "minecraft:smelting",
        "category": "blocks",
        "cookingtime": 200,
        "experience": 0.1,
        "ingredient": {
          "item": "minecraft:nether_bricks"
        },
        "result": "pyrite:charred_nether_bricks"
      }`
    }
    else if (block == "blue_nether_bricks") {
      recipe = `{
        "type": "minecraft:crafting_shaped",
        "category": "building",
        "key": {
          "N": {
            "item": "minecraft:nether_brick"
          },
          "W": {
            "item": "minecraft:warped_fungus"
          }
        },
        "pattern": [
          "NW",
          "WN"
        ],
        "result": {
          "item": "pyrite:blue_nether_bricks"
        }
      }`
    }
    else {
      other = `${other}_dye`
      altNamespace = changeDyeNamespace(other)
      recipe = createDyeRecipe(namespace, block, altNamespace, "bricks", other, "item")
    }
  }
  else if (type == "resource_bricks") {
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "DD",
      "DD"
    ],
    "key": {
      "D": {
        "item": "minecraft:${other}"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 4
    }
    }`
  }
  else if (type == "nostalgia") {
    recipe = generateShapelessRecipe([`pyrite:nostalgia_dye`, `minecraft:${other}`], `pyrite:${block}`, 1)
  }
  else if (type == "chiseled_resource") {
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "D",
      "D"
    ],
    "key": {
      "D": {
        "item": "minecraft:${other}"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 4
    }
    }`
  }
  else if (type == "chiseled_pillar") {
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "D",
      "D"
    ],
    "key": {
      "D": {
        "item": "minecraft:${other}"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 4
    }
    }`
  }
  else if (type == "bars") {
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "DDD",
      "DDD"
    ],
    "key": {
      "D": {
        "item": "${namespace}:cut_${other}"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 4
    }
    }`
  }
  else if (type == "stairs") {
    recipe = `        {
      "type": "minecraft:crafting_shaped",
      "pattern": [
        "C  ",
        "CC ",
        "CCC"
      ],
      "key": {
        "C": {
          "item": "${namespace}:${other}"
        }
      },
      "result": {
        "item": "${namespace}:${block}",
        "id": "${namespace}:${block}",
        "count": 4
      }
  }`}
  else if (type == "wall") {
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "CCC",
      "CCC"
    ],
    "key": {
      "C": {
        "item": "${namespace}:${other}"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 6
    }
}`}
  else if (type == "slabs") {
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "CCC"
        ],
        "key": {
          "C": {
            "item": "${namespace}:${other}"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 6
        }
      }`
  }
  else if (type == "plates") {
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "CC"
        ],
        "key": {
          "C": {
            "item": "${altNamespace}:${other}"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 1
        }
      }`
  }
  else if (type == "door") {
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "CC",
          "CC",
          "CC"
        ],
        "key": {
          "C": {
            "item": "${altNamespace}:${other}"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 3
        }
      }`
  }
  else if (type == "crafting_table") {
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "CC",
          "CC"
        ],
        "key": {
          "C": {
            "item": "${altNamespace}:${other}"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 1
        }
      }`
  }
  else if (type == "trapdoor") {
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "CCC",
          "CCC"
        ],
        "key": {
          "C": {
            "item": "${altNamespace}:${other}"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 2
        }
      }`
  }
  else if (type == "carpet") {
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "CC"
        ],
        "key": {
          "C": {
            "item": "${altNamespace}:${other}"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 3
        }
      }`
  }
  else if (type == "fences") {
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "CSC",
          "CSC"
        ],
        "key": {
          "C": {
            "item": "${namespace}:${other}"
          },
          "S": {
            "item": "minecraft:stick"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 1
        }
      }`
  }
  else if (type == "fence_gates") {
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "SCS",
          "SCS"
        ],
        "key": {
          "C": {
            "item": "${namespace}:${other}"
          },
          "S": {
            "item": "minecraft:stick"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 1
        }
      }`
  }
  else if (type == "wall_gates") {
    baseWall = other
    baseWall = `${baseWall.replace("bricks", "brick")}`
    baseWall = `${baseWall.replace("tiles", "tile")}`
    baseWall = baseWall + "_wall"
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "SCS",
          "SCS"
        ],
        "key": {
          "C": {
            "item": "${altNamespace}:${other}"
          },
          "S": {
            "item": "${altNamespace}:${baseWall}"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 6
        }
      }`
  }
  else if (type == "buttons") {
    recipe = `        
      {
        "type": "minecraft:crafting_shaped",
        "pattern": [
          "C"
        ],
        "key": {
          "C": {
            "item": "${altNamespace}:${other}"
          }
        },
        "result": {
          "item": "${namespace}:${block}",
          "id": "${namespace}:${block}",
          "count": 1
        }
      }`
  }
  else if (type == "metal_buttons") {
    recipe = generateShapelessRecipe([`${altNamespace}:${other}`, `#${altNamespace}:buttons`], `${namespace}:${block}`, 1)
  }

  return recipe

}

function writeRecipes(block, type, other, namespace, altNamespace) {
  recipe = generateRecipes(block, type, other, namespace, altNamespace)
  writeFile(`${paths.recipes}${block}.json`, recipe)
}

function writeStonecutterRecipes(block, type, other, namespace, altNamespace, addon) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if (addon == undefined) {
    addon = ""
  }
  else {
    addon = addon + "_"
  }
  if (type == "stairs") {
    quantity = 1
  }
  else if (type == "wall") {
    quantity = 1
  }
  else if (type == "slab") {
    quantity = 2
  }
  else if (type == "wall_gates") {
    quantity = 1
  }
  else if (type == "cut_block") {
    quantity = 4
  }
  else {
    quantity = 1
  }
  recipe = `{
    "type": "minecraft:stonecutting",
    "ingredient": {
      "item": "${altNamespace}:${other}"
    },
    "result": "${namespace}:${block}",
    "count": ${quantity}
  }`
  fs.writeFile(`${paths.recipes}${addon}${block}_stonecutting.json`, recipe, function (err) {
    if (err) throw err;

  });

}



function generateSlabBlockState(block, namespace, baseBlock) {
  return `{
    "variants": {
      "type=bottom": {
        "model": "${namespace}:block/${block}"
      },
      "type=double": {
        "model": "${namespace}:block/${baseBlock}"
      },
      "type=top": {
        "model": "${namespace}:block/${block}_top"
      }
    }
  }`
}

function generateDoorBlockState(block, namespace, baseBlock) {
  return `{
    "variants": {
      "facing=east,half=lower,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_bottom_left"
      },
      "facing=east,half=lower,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_bottom_left_open",
        "y": 90
      },
      "facing=east,half=lower,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_bottom_right"
      },
      "facing=east,half=lower,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_bottom_right_open",
        "y": 270
      },
      "facing=east,half=upper,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_top_left"
      },
      "facing=east,half=upper,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_top_left_open",
        "y": 90
      },
      "facing=east,half=upper,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_top_right"
      },
      "facing=east,half=upper,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_top_right_open",
        "y": 270
      },
      "facing=north,half=lower,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_bottom_left",
        "y": 270
      },
      "facing=north,half=lower,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_bottom_left_open"
      },
      "facing=north,half=lower,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_bottom_right",
        "y": 270
      },
      "facing=north,half=lower,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_bottom_right_open",
        "y": 180
      },
      "facing=north,half=upper,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_top_left",
        "y": 270
      },
      "facing=north,half=upper,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_top_left_open"
      },
      "facing=north,half=upper,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_top_right",
        "y": 270
      },
      "facing=north,half=upper,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_top_right_open",
        "y": 180
      },
      "facing=south,half=lower,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_bottom_left",
        "y": 90
      },
      "facing=south,half=lower,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_bottom_left_open",
        "y": 180
      },
      "facing=south,half=lower,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_bottom_right",
        "y": 90
      },
      "facing=south,half=lower,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_bottom_right_open"
      },
      "facing=south,half=upper,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_top_left",
        "y": 90
      },
      "facing=south,half=upper,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_top_left_open",
        "y": 180
      },
      "facing=south,half=upper,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_top_right",
        "y": 90
      },
      "facing=south,half=upper,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_top_right_open"
      },
      "facing=west,half=lower,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_bottom_left",
        "y": 180
      },
      "facing=west,half=lower,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_bottom_left_open",
        "y": 270
      },
      "facing=west,half=lower,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_bottom_right",
        "y": 180
      },
      "facing=west,half=lower,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_bottom_right_open",
        "y": 90
      },
      "facing=west,half=upper,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_top_left",
        "y": 180
      },
      "facing=west,half=upper,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_top_left_open",
        "y": 270
      },
      "facing=west,half=upper,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_top_right",
        "y": 180
      },
      "facing=west,half=upper,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_top_right_open",
        "y": 90
      }
    }
  }`
}

function generateOldDoorBlockState(block, namespace, baseBlock) {
  return `{
    "variants": {
      "facing=east,half=lower,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_bottom"
      },
      "facing=east,half=lower,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_bottom_hinge",
        "y": 90
      },
      "facing=east,half=lower,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_bottom_hinge"
      },
      "facing=east,half=lower,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_bottom",
        "y": 270
      },
      "facing=east,half=upper,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_top"
      },
      "facing=east,half=upper,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_top_hinge",
        "y": 90
      },
      "facing=east,half=upper,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_top_hinge"
      },
      "facing=east,half=upper,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_top",
        "y": 270
      },
      "facing=north,half=lower,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_bottom",
        "y": 270
      },
      "facing=north,half=lower,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_bottom_hinge"
      },
      "facing=north,half=lower,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_bottom_hinge",
        "y": 270
      },
      "facing=north,half=lower,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_bottom",
        "y": 180
      },
      "facing=north,half=upper,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_top",
        "y": 270
      },
      "facing=north,half=upper,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_top_hinge"
      },
      "facing=north,half=upper,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_top_hinge",
        "y": 270
      },
      "facing=north,half=upper,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_top",
        "y": 180
      },
      "facing=south,half=lower,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_bottom",
        "y": 90
      },
      "facing=south,half=lower,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_bottom_hinge",
        "y": 180
      },
      "facing=south,half=lower,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_bottom_hinge",
        "y": 90
      },
      "facing=south,half=lower,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_bottom"
      },
      "facing=south,half=upper,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_top",
        "y": 90
      },
      "facing=south,half=upper,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_top_hinge",
        "y": 180
      },
      "facing=south,half=upper,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_top_hinge",
        "y": 90
      },
      "facing=south,half=upper,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_top"
      },
      "facing=west,half=lower,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_bottom",
        "y": 180
      },
      "facing=west,half=lower,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_bottom_hinge",
        "y": 270
      },
      "facing=west,half=lower,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_bottom_hinge",
        "y": 180
      },
      "facing=west,half=lower,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_bottom",
        "y": 90
      },
      "facing=west,half=upper,hinge=left,open=false": {
        "model": "${namespace}:block/${block}_top",
        "y": 180
      },
      "facing=west,half=upper,hinge=left,open=true": {
        "model": "${namespace}:block/${block}_top_hinge",
        "y": 270
      },
      "facing=west,half=upper,hinge=right,open=false": {
        "model": "${namespace}:block/${block}_top_hinge",
        "y": 180
      },
      "facing=west,half=upper,hinge=right,open=true": {
        "model": "${namespace}:block/${block}_top",
        "y": 90
      }
    }
  }`
}

function generateTrapdoorBlockState(block, namespace, baseBlock) {
  return `{
    "variants": {
      "facing=east,half=bottom,open=false": {
        "model": "${namespace}:block/${block}_bottom",
        "y": 90
      },
      "facing=east,half=bottom,open=true": {
        "model": "${namespace}:block/${block}_open",
        "y": 90
      },
      "facing=east,half=top,open=false": {
        "model": "${namespace}:block/${block}_top",
        "y": 90
      },
      "facing=east,half=top,open=true": {
        "model": "${namespace}:block/${block}_open",
        "x": 180,
        "y": 270
      },
      "facing=north,half=bottom,open=false": {
        "model": "${namespace}:block/${block}_bottom"
      },
      "facing=north,half=bottom,open=true": {
        "model": "${namespace}:block/${block}_open"
      },
      "facing=north,half=top,open=false": {
        "model": "${namespace}:block/${block}_top"
      },
      "facing=north,half=top,open=true": {
        "model": "${namespace}:block/${block}_open",
        "x": 180,
        "y": 180
      },
      "facing=south,half=bottom,open=false": {
        "model": "${namespace}:block/${block}_bottom",
        "y": 180
      },
      "facing=south,half=bottom,open=true": {
        "model": "${namespace}:block/${block}_open",
        "y": 180
      },
      "facing=south,half=top,open=false": {
        "model": "${namespace}:block/${block}_top",
        "y": 180
      },
      "facing=south,half=top,open=true": {
        "model": "${namespace}:block/${block}_open",
        "x": 180,
        "y": 0
      },
      "facing=west,half=bottom,open=false": {
        "model": "${namespace}:block/${block}_bottom",
        "y": 270
      },
      "facing=west,half=bottom,open=true": {
        "model": "${namespace}:block/${block}_open",
        "y": 270
      },
      "facing=west,half=top,open=false": {
        "model": "${namespace}:block/${block}_top",
        "y": 270
      },
      "facing=west,half=top,open=true": {
        "model": "${namespace}:block/${block}_open",
        "x": 180,
        "y": 90
      }
    }
  }`
}


function generateBlockModel(block, namespace, baseBlock, model, render_type) {
  if (model == undefined) {
    model = "minecraft:block/cube_all"
  }
  if (render_type == undefined) {
    render_type = ""
  }
  else {
    render_type = "," + render_type
  }

  return `{
    "parent": "${model}",
    "textures": {
      "all": "${namespace}:block/${block}"
    }${render_type}
  }`

}

function generateCraftingTableBlockModel(block, namespace, baseBlock, altNamespace) {
  return `{
    "parent": "minecraft:block/cube",
    "textures": {
      "particle": "${namespace}:block/${block}_front",
      "north": "${namespace}:block/${block}_front",
      "south": "${namespace}:block/${block}_side",
      "east": "${namespace}:block/${block}_side",
      "west": "${namespace}:block/${block}_front",
      "up": "${namespace}:block/${block}_top",
      "down": "${altNamespace}:block/${baseBlock}"
    }
  }`
}

function generateCubeColumnBlockModel(block, namespace, baseBlock, model) {
  return `{
    "parent": "minecraft:block/${model}",
    "textures": {
      "end": "${namespace}:block/${block}_top",
      "side": "${namespace}:block/${block}"
    }
  }`
}

function generateLeverBlockModel(block, namespace, baseBlock, altNamespace, addon) {
  if (addon == undefined) {
    addon = ""
  }
  else {
    addon = `_${addon}`
    if (addon == "_wall") {
      let wallName = baseBlock + "_wall"
      if (altNamespace != "minecraft") {
        return `{
          "parent": "${altNamespace}:block/${baseBlock}_wall",
          "render_type": "cutout"
      }`
      }
      else {
        const torchBlock = baseBlock.replace("torch", "wall_torch")
        return `{
          "parent": "${altNamespace}:block/${torchBlock}",
          "render_type": "cutout"
      }`
      }
      
    }
    else if (addon == "_upright") {
      return `{
        "parent": "${altNamespace}:block/${baseBlock}",
        "render_type": "cutout"
    }`
    }
    else {
      return `{
        "parent": "pyrite:block/template_torch_lever${addon}",
        "textures": {
          "texture": "${altNamespace}:block/${baseBlock}"
        },
        "render_type": "cutout"
      }`
    }
  }
  return `{
    "parent": "pyrite:block/template_torch_lever${addon}",
    "textures": {
      "texture": "${altNamespace}:block/${baseBlock}"
    },
    "render_type": "cutout"
  }`


}


function generateTorchBlockModel(block, namespace, baseBlock, altNamespace, addon) {

  return `{
    "parent": "minecraft:block/${addon}",
    "textures": {
      "torch": "${altNamespace}:block/${baseBlock}"
    },
    "render_type": "cutout"
  }`


}

function generateFlowerBlockModel(block, namespace, baseBlock) {
  return `{
    "parent": "minecraft:block/cross",
    "textures": {
      "cross": "${namespace}:block/${block}"
    }
  }`
}



function generateLogModel(block, namespace, baseBlock, model) {
  return `{
    "parent": "minecraft:block/${model}",
    "textures": {
      "end": "${namespace}:block/${block}_top",
      "side": "minecraft:block/mushroom_stem"
    }
  }`
}

function generateFenceBlockState(block, namespace, baseBlock) {

  return `{
    "multipart": [
      {
        "apply": {
          "model": "${namespace}:block/${block}_post"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "uvlock": true
        },
        "when": {
          "north": "true"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "uvlock": true,
          "y": 90
        },
        "when": {
          "east": "true"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "uvlock": true,
          "y": 180
        },
        "when": {
          "south": "true"
        }
      },
      {
        "apply": {
          "model": "${namespace}:block/${block}_side",
          "uvlock": true,
          "y": 270
        },
        "when": {
          "west": "true"
        }
      }
    ]
  }`
}
function generateButtonBlockState(block, namespace, baseBlock) {
  return `{
  "variants": {
    "face=ceiling,facing=east,powered=false": {
      "model": "${namespace}:block/${block}",
      "x": 180,
      "y": 270
    },
    "face=ceiling,facing=east,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "x": 180,
      "y": 270
    },
    "face=ceiling,facing=north,powered=false": {
      "model": "${namespace}:block/${block}",
      "x": 180,
      "y": 180
    },
    "face=ceiling,facing=north,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "x": 180,
      "y": 180
    },
    "face=ceiling,facing=south,powered=false": {
      "model": "${namespace}:block/${block}",
      "x": 180
    },
    "face=ceiling,facing=south,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "x": 180
    },
    "face=ceiling,facing=west,powered=false": {
      "model": "${namespace}:block/${block}",
      "x": 180,
      "y": 90
    },
    "face=ceiling,facing=west,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "x": 180,
      "y": 90
    },
    "face=floor,facing=east,powered=false": {
      "model": "${namespace}:block/${block}",
      "y": 90
    },
    "face=floor,facing=east,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "y": 90
    },
    "face=floor,facing=north,powered=false": {
      "model": "${namespace}:block/${block}"
    },
    "face=floor,facing=north,powered=true": {
      "model": "${namespace}:block/${block}_pressed"
    },
    "face=floor,facing=south,powered=false": {
      "model": "${namespace}:block/${block}",
      "y": 180
    },
    "face=floor,facing=south,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "y": 180
    },
    "face=floor,facing=west,powered=false": {
      "model": "${namespace}:block/${block}",
      "y": 270
    },
    "face=floor,facing=west,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "y": 270
    },
    "face=wall,facing=east,powered=false": {
      "model": "${namespace}:block/${block}",
      "uvlock": true,
      "x": 90,
      "y": 90
    },
    "face=wall,facing=east,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "uvlock": true,
      "x": 90,
      "y": 90
    },
    "face=wall,facing=north,powered=false": {
      "model": "${namespace}:block/${block}",
      "uvlock": true,
      "x": 90
    },
    "face=wall,facing=north,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "uvlock": true,
      "x": 90
    },
    "face=wall,facing=south,powered=false": {
      "model": "${namespace}:block/${block}",
      "uvlock": true,
      "x": 90,
      "y": 180
    },
    "face=wall,facing=south,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "uvlock": true,
      "x": 90,
      "y": 180
    },
    "face=wall,facing=west,powered=false": {
      "model": "${namespace}:block/${block}",
      "uvlock": true,
      "x": 90,
      "y": 270
    },
    "face=wall,facing=west,powered=true": {
      "model": "${namespace}:block/${block}_pressed",
      "uvlock": true,
      "x": 90,
      "y": 270
    }
  }
}`}

function generateFenceGateBlockState(block, namespace) {
  return `{
    "variants": {
    "facing=east,in_wall=false,open=false": {
      "model": "${namespace}:block/${block}",
      "uvlock": true,
      "y": 270
    },
    "facing=east,in_wall=false,open=true": {
      "model": "${namespace}:block/${block}_open",
      "uvlock": true,
      "y": 270
    },
    "facing=east,in_wall=true,open=false": {
      "model": "${namespace}:block/${block}_wall",
      "uvlock": true,
      "y": 270
    },
    "facing=east,in_wall=true,open=true": {
      "model": "${namespace}:block/${block}_wall_open",
      "uvlock": true,
      "y": 270
    },
    "facing=north,in_wall=false,open=false": {
      "model": "${namespace}:block/${block}",
      "uvlock": true,
      "y": 180
    },
    "facing=north,in_wall=false,open=true": {
      "model": "${namespace}:block/${block}_open",
      "uvlock": true,
      "y": 180
    },
    "facing=north,in_wall=true,open=false": {
      "model": "${namespace}:block/${block}_wall",
      "uvlock": true,
      "y": 180
    },
    "facing=north,in_wall=true,open=true": {
      "model": "${namespace}:block/${block}_wall_open",
      "uvlock": true,
      "y": 180
    },
    "facing=south,in_wall=false,open=false": {
      "model": "${namespace}:block/${block}",
      "uvlock": true
    },
    "facing=south,in_wall=false,open=true": {
      "model": "${namespace}:block/${block}_open",
      "uvlock": true
    },
    "facing=south,in_wall=true,open=false": {
      "model": "${namespace}:block/${block}_wall",
      "uvlock": true
    },
    "facing=south,in_wall=true,open=true": {
      "model": "${namespace}:block/${block}_wall_open",
      "uvlock": true
    },
    "facing=west,in_wall=false,open=false": {
      "model": "${namespace}:block/${block}",
      "uvlock": true,
      "y": 90
    },
    "facing=west,in_wall=false,open=true": {
      "model": "${namespace}:block/${block}_open",
      "uvlock": true,
      "y": 90
    },
    "facing=west,in_wall=true,open=false": {
      "model": "${namespace}:block/${block}_wall",
      "uvlock": true,
      "y": 90
    },
    "facing=west,in_wall=true,open=true": {
      "model": "${namespace}:block/${block}_wall_open",
      "uvlock": true,
      "y": 90
    }
}}`}

function generateTrapdoorBlockModels(block, namespace, baseBlock, modelID) {
  return trim(`{
    "parent": "minecraft:block/${modelID}",
    "textures": {
      "texture": "${namespace}:block/${block}"
    },
    "render_type": "cutout"
  }`)

}

function generateDoorBlockModels(block, namespace, baseBlock, modelID) {
  return trim(`{
    "parent": "minecraft:block/${modelID}",
    "textures": {
      "bottom": "${namespace}:block/${block}_bottom",
      "top": "${namespace}:block/${block}_top"
    },
    "render_type": "cutout"
  }`)
}

function trim(json) {
  return JSON.stringify(JSON.parse(json))
}

function changeDyeNamespace(other) {
  other = other.replace("terracotta", "dye")

  if ((other == "glow_dye") || (other == "dragon_dye") || (other == "star_dye") || (other == "honey_dye") || (other == "rose_dye") || (other == "nostalgia_dye") || (other == "poisonous_dye")) {
    return "pyrite"
  }
  else {
    return "minecraft"
  }
}