var fs = require('fs');
const { basename } = require('path');

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
"spruce","birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "bamboo", "crimson", "warped"
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
  trailstales: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.20)/common/src/main/resources/`,
  trailstales5: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.20.5)/src/main/resources/`,
  infinite: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (20w14infinite)/src/main/resources/`,





  //legacy
  base: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.20)/common/src/main/resources/`,
  infinitemodels: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (20w14infinite)/src/main/resources/assets/pyrite/models/block/`,
  infiniteblockstates: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (20w14infinite)/src/main/resources/assets/pyrite/blockstates/`,
  potatorecipes: `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.20.5)/src/main/resources/data/pyrite/recipes/`,


}



//Assets path
paths = Object.assign(paths, { assets: `${paths.base}/assets/${"pyrite"}/` })
//Blockstates and models
paths = Object.assign(paths, { blockstates: `${paths.assets}/blockstates/`, models: `${paths.assets}/models/block/`, itemModels: `${paths.assets}/models/item/` })
//Namespace data and Minecraft data folders
paths = Object.assign(paths, { data: `${paths.base}/data/${"pyrite"}/`, mcdata: `${paths.base}/data/minecraft/` })
//Tags
paths = Object.assign(paths, {
  tags: `${paths.data}/tags/`,
  mctags: `${paths.mcdata}/tags/`,
  loot: `${paths.data}/loot_tables/blocks/`,
  recipes: `${paths.data}/recipes/`
})


let tags = "";
function generateResources() {
  // writeLeverBlock("torch_lever", "pyrite", "torch", "minecraft")
  // writeLeverBlock("redstone_torch_lever", "pyrite", "redstone_torch")
  // writeLeverBlock("soul_torch_lever", "pyrite", "soul_torch")


  dyes.forEach(function (dye) {
    let stainedBlockTemplate = dye + "_stained"
    plankBase = stainedBlockTemplate + "_planks"
    namespace = "pyrite"

    writeButtons(stainedBlockTemplate, namespace, plankBase)
    writeStairs(stainedBlockTemplate, namespace, plankBase)
    writeSlabs(stainedBlockTemplate, namespace, plankBase)
    writePlates(stainedBlockTemplate, namespace, plankBase)
    writeFences(stainedBlockTemplate, namespace, plankBase)
    writeFenceGates(stainedBlockTemplate, namespace, plankBase)
    writePlanks(stainedBlockTemplate, dye, namespace, plankBase)
    writeCraftingTableBlock(stainedBlockTemplate, dye, namespace, plankBase)
    writeDoors(stainedBlockTemplate, dye, namespace, plankBase)
    writeTrapdoors(stainedBlockTemplate, dye, namespace, plankBase)

    // Bricks
    let blockTemplate = dye
    baseBlock = blockTemplate + "_bricks"
    // writeBricks(dye, dye, namespace)
    writeBrickSlab(blockTemplate, namespace)
    writeBrickStairs(blockTemplate, namespace)
    writeBrickWall(blockTemplate, namespace)
    writeWallGates(blockTemplate + "_brick", namespace, blockTemplate+"_bricks")

    baseBlock = dye + "_terracotta"
    writeTerracottaBricks(dye + "_terracotta", dye, namespace)
    writeBrickSlab(dye + "_terracotta", namespace)
    writeBrickStairs(dye + "_terracotta", namespace)
    writeBrickWall(dye + "_terracotta", namespace)
    writeWallGates(dye + "_terracotta_brick", namespace, dye+"_terracotta_bricks")

    // Lamps
    writeLamps(dye, dye, namespace)
    writeTorchBlock(dye+"_torch", "pyrite", dye, "pyrite")
    writeBlock(dye+"_framed_glass", dye, "pyrite", "dyed_framed_glass", "framed_glass")
    printLang(dye + "_framed_glass")

    // writePaneBlock(dye+"_framed_glass", "pyrite", dye+"_framed_glass", dye)




  })


  // vanillaWood.forEach(function (dye) {
  //   let stainedBlockTemplate = dye
  //   plankBase = stainedBlockTemplate + "_planks"
  //   namespace = "pyrite"
  //   writeCraftingTableBlock(stainedBlockTemplate, dye, namespace, plankBase, "minecraft")

  // })


  let shroomBlockTemplate = "_mushroom"
  plankBase = shroomBlockTemplate + "_planks"
  namespace = "pyrite"
  const redShroom = "red"+shroomBlockTemplate
  const redBase = "red"+ plankBase
  const brownShroom = "brown"+shroomBlockTemplate
  const brownBase = "brown"+ plankBase
//Red Mushrooms
  writeButtons(redShroom, namespace, redBase)
  writeStairs(redShroom, namespace, redBase)
  writeSlabs(redShroom, namespace, redBase)
  writePlates(redShroom, namespace, redBase)
  writeFences(redShroom, namespace, redBase)
  writeFenceGates(redShroom, namespace, redBase)
  writeBlock(redShroom + "_planks", "red", namespace, "mushroom_planks", plankBase)
  // writeDoors(redShroom, "mushroom", namespace, redBase)
  // writeTrapdoors(redShroom, "mushroom", namespace, redBase)
  writeCraftingTableBlock(redShroom, "mushroom", namespace, redBase)

  // writeLogs(redShroom, namespace, redBase)

//Brown Mushrooms
  writeButtons(brownShroom, namespace, brownBase)
  writeStairs(brownShroom, namespace, brownBase)
  writeSlabs(brownShroom, namespace, brownBase)
  writePlates(brownShroom, namespace, brownBase)
  writeFences(brownShroom, namespace, brownBase)
  writeFenceGates(brownShroom, namespace, brownBase)
  writeBlock(`brown${shroomBlockTemplate}_planks`, "brown", namespace, "mushroom_planks", plankBase)
  // writeDoors(brownShroom, "mushroom", namespace, brownBase)
  // writeTrapdoors(brownShroom, "mushroom", namespace, brownBase)
  writeCraftingTableBlock(brownShroom, "mushroom", namespace, brownBase)

  // writeLogs(brownShroom, namespace, brownBase)
  writeBricks("charred_nether", "charred_nether", namespace)
  writeBricks("blue_nether", "blue_nether", namespace)

  writeSlabs("cobblestone_brick", "pyrite", "cobblestone_bricks")
  writeStairs("cobblestone_brick", "pyrite", "cobblestone_bricks")
  writeWalls("cobblestone_brick", "pyrite", "cobblestone_bricks")
  writeStairs("mossy_cobblestone_brick", "pyrite", "mossy_cobblestone_bricks")
  writeSlabs("mossy_cobblestone_brick", "pyrite", "mossy_cobblestone_bricks")

  writeWalls("mossy_cobblestone_brick", "pyrite", "mossy_cobblestone_bricks")
  // writeBlock("mossy_cobblestone_bricks", "mossy_cobblestone_bricks", "pyrite", "mossy_cobblestone_bricks")

  writeBlock("cobblestone_bricks", "cobblestone_bricks", "pyrite", "cobblestone_bricks")
  writeBlock("smooth_stone_bricks", "smooth_stone_bricks", "pyrite", "smooth_stone_bricks")
  writeBrickSlab("smooth_stone", namespace)
  writeBrickStairs("smooth_stone", namespace)
  writeBrickWall("smooth_stone", namespace)
  // writeWallGates("smooth_stone_brick", namespace, "smooth_stone_bricks")


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




  modDyes.forEach(function (dye) {
    writeDye(dye, dye, namespace)
    writeWool(dye, dye, namespace)

    writeCarpet(dye + "_carpet", namespace, dye + "_wool")
    writeTerracotta(dye, dye, namespace)


  })


  // writeLamps("glowstone", "glowstone", namespace)
  // writeLamps("lit_redstone", "lit_redstone", namespace, "minecraft")

  // writeWallGates("cobblestone_brick", namespace, "cobblestone_bricks")
  // writeWallGates("mossy_cobblestone_brick", namespace, "mossy_cobblestone_bricks")


  // writeBrickSlab("charred_nether", namespace)
  // writeBrickStairs("charred_nether", namespace)
  // writeBrickWall("charred_nether", namespace)
  // writeWallGates("charred_nether_brick", namespace, "charred_nether_bricks")


  writeBrickSlab("blue_nether", namespace)
  writeBrickStairs("blue_nether", namespace)
  writeBrickWall("blue_nether", namespace)
  // writeWallGates("blue_nether_brick", namespace, "blue_nether_bricks")

  walls.forEach(function(wall) {
    let blockTemplate = wall
    baseBlock = blockTemplate
    baseBlock = `${baseBlock.replace("brick", "bricks")}`
    baseBlock = `${baseBlock.replace("tile", "tiles")}`
    // writeWallGates(blockTemplate, namespace, baseBlock, "minecraft")

  })

  // // cut.forEach(function(block) {
  // //   const ogBaseBlock = block;
  // //   let baseBlock = block
  // //   if (block == "copper") {}
  // //   else if (block == "exposed_copper") {}
  // //   else if (block == "oxidized_copper") {}
  // //   else if (block == "weathered_copper") {}
  // //   else {
  // //     baseBlock = baseBlock + "_block"
  // //   }
  // //   const baseIngot = block + "_ingot"
  // //   // writeBlock(`cut_${block}`, "cut_iron", "pyrite", `cut_${block}`)
  // //   // writeSlabs(`cut_${block}`, "pyrite", `cut_${block}`)
  // //   // writeStairs(`cut_${block}`, "pyrite", `cut_${block}`)
  // //   // writeWalls(`cut_${block}`, "pyrite")
  // //   // writeWallGates(`cut_${block}`, namespace, `cut_${block}`, namespace)

  // //   //  writeSlabs(`smooth_${block}`, "pyrite", `smooth_${block}`)
  // //   // writeStairs(`smooth_${block}`, "pyrite", `smooth_${block}`)
  // //   // writeWalls(`smooth_${block}`, "pyrite")
  // //   // writeWallGates(`smooth_${block}`, namespace, `smooth_${block}`, namespace)

  // //   // writeBlock(`${block}_bricks`, "cut_"+baseBlock, "pyrite",  "resource_bricks")
  // //   // writeChiseledBlock(`chiseled_${block}_block`, baseBlock, "pyrite",  "chiseled_resource")
  // //   // writeChiseledBlock(`${block}_pillar`, baseBlock, "pyrite",  "resource_pillar")
  // //   // writeBlock(`smooth_${block}`, baseBlock, "pyrite",  "smooth_resource")
  // //   // writeBarBlock(block, "pyrite", baseBlock)
  // //   // writeDoors(block, "dye", "pyrite", baseBlock)
  // //   // writeTrapdoors(block, "dye", "pyrite", baseBlock)
  // //   // writeBlock(`nostalgia_${block}_block`, baseBlock, "pyrite",  "nostalgia")
  // //   //   console.log(`"pyrite:nostalgia_${block}",`)


  // //   // writeStonecutterRecipes(`${block}_button`, "block", baseBlock, "pyrite", "minecraft")
  // //   writeStonecutterRecipes(`smooth_${block}_wall_gate`, "wall", "smooth_"+ogBaseBlock, "pyrite", "pyrite")

  //   // writeButtons(block, "pyrite", baseBlock, "minecraft")
  //   // writePlates(block, "pyrite", baseBlock, "minecraft")
  //   // writeRecipes(block+"_pressure_plate", "plates", baseIngot, "pyrite", "minecraft")
  //   // printLang(`${block}_button`)
  //   // if (baseBlock == "quartz_block") {
  //   //   console.log(`"pyrite:smooth_${block}_slab",`)
  //   //   console.log(`"pyrite:smooth_${block}_stairs",`)
  //   //   console.log(`"pyrite:smooth_${block}_wall_gate",`)
  //   //   console.log(`"pyrite:smooth_${block}_wall",`)
  //   // }

  // })


  // writeCarpet("grass_carpet", namespace, "grass_block_top", "minecraft")
  // writeCarpet("mycelium_carpet", namespace, "mycelium_top", "minecraft")
  // writeCarpet("path_carpet", namespace, "dirt_path_top", "minecraft")
  // writeCarpet("podzol_carpet", namespace, "podzol_top", "minecraft")
  // writeCarpet("nostalgia_grass_carpet", namespace, "nostalgia_grass_top", namespace)

  // writeFenceGates("nether_brick", namespace, "nether_bricks", "minecraft")
  // writeFlower("rose", namespace, "pyrite")
  // writeFlower("blue_rose", namespace, "pyrite")
  // writeFlower("orange_rose", namespace, "pyrite")
  // writeFlower("white_rose", namespace, "pyrite")
  // writeFlower("pink_rose", namespace, "pyrite")
  // writeFlower("paeonia", namespace, "pyrite")
  // writeFlower("pink_daisy", namespace, "pyrite")
  // writeFlower("buttercup", namespace, "pyrite")


}



generateResources()


function writeBlockstate(block, blockState, namespace) {
  fs.writeFile(`${paths.blockstates}${block}.json`, blockState, function (err) {if (err) throw err;});
}

function writeOldBlockstate(block, blockState, namespace) {
  fs.writeFile(`${paths.infiniteblockstates}${block}.json`, blockState, function (err) { if (err) throw err; });
}

function writePlankBlockModels(block, namespace, baseBlock) {
  blockModel = generateBlockModel(block, namespace, baseBlock)
  fs.writeFile(`${paths.models}${block}.json`, blockModel, function (err) {
    if (err) throw err;

  });
}

function writeMirroredBricksBlockModels(block, namespace, baseBlock) {
  fs.writeFile(`${paths.models}${block}.json`, generateBlockModel(block, namespace, baseBlock), function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_north_west_mirrored.json`, generateBlockModel(block, namespace, baseBlock, "cube_north_west_mirrored_all"), function (err) {if (err) throw err;});

}

function writeCraftingTableBlockModels(block, namespace, baseBlock) {
  blockModel = generateCraftingTableBlockModel(block, namespace, baseBlock)
  fs.writeFile(`${paths.models}${block}.json`, blockModel, function (err) {
    if (err) throw err;

  });
}

function writeLeverBlockModels(block, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  fs.writeFile(`${paths.models}${block}.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace), function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_on.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "on"), function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_upright.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "upright"), function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_wall.json`, generateLeverBlockModel(block, namespace, baseBlock, altNamespace, "wall"), function (err) {if (err) throw err;});


}

function writeTorchBlockModels(block, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  fs.writeFile(`${paths.models}${block}_upright.json`, generateTorchBlockModel(block, namespace, baseBlock, altNamespace, "template_torch"), function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_wall.json`, generateTorchBlockModel(block, namespace, baseBlock, altNamespace, "template_torch_wall"), function (err) {if (err) throw err;});


}


function writeCubeColumnBlockModels(block, namespace, baseBlock) {
  fs.writeFile(`${paths.models}${block}.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column"), function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_horizontal.json`, generateCubeColumnBlockModel(block, namespace, baseBlock, "cube_column_horizontal"), function (err) {if (err) throw err;});

}

function writeFlowerBlockModels(block, namespace, baseBlock) {
  fs.writeFile(`${paths.models}${block}.json`, generateFlowerBlockModel(block, namespace, baseBlock), function (err) {if (err) throw err;});

}



function writeLogBlockModels(block, namespace, baseBlock) {
  fs.writeFile(`${paths.models}${block}.json`, generateLogModel(block, namespace, baseBlock, "cube_column"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_horizontal.json`, generateLogModel(block, namespace, baseBlock, "cube_column_horizontal"), function (err) { if (err) throw err; });

}

function printLang(block, type) {
  if (type == undefined) {
    type = "block"
  }
  let langBlock = block
  langBlock = langBlock.replaceAll("_", " ")
  langBlock = langBlock.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  console.log(`"${type}.${namespace}.${block}": "${langBlock}",`)

}

function printBlock(block) {
  console.log(`"${namespace}:${block}",`)

}

function writeWallBlockModels(block, namespace, baseBlock) {
  postModel = `{
    "parent": "minecraft:block/template_wall_post",
    "textures": {
      "wall": "${namespace}:block/${baseBlock}"
    }
  }`
  postModel = `{
    "parent": "minecraft:block/template_wall_post",
    "textures": {
      "wall": "${namespace}:block/${baseBlock}"
    }
  }`
  sideModel = `{
    "parent": "minecraft:block/template_wall_side",
    "textures": {
      "wall": "${namespace}:block/${baseBlock}"
    }
  }`
  invModel = `{
    "parent": "minecraft:block/wall_inventory",
    "textures": {
      "wall": "${namespace}:block/${baseBlock}"
    }
  }`
  tallModel = `{
    "parent": "minecraft:block/template_wall_side_tall",
    "textures": {
      "wall": "${namespace}:block/${baseBlock}"
    }
  }`
  fs.writeFile(`${paths.models}${block}_post.json`, postModel, function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_side.json`, sideModel, function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_inventory.json`, invModel, function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_side_tall.json`, tallModel, function (err) {
    if (err) throw err;

  });
}


function writePaneBlockModels(block, namespace, baseBlock) {
  capModel = `{
    "ambientocclusion": false,
    "textures": {
        "particle": "pyrite:block/${block}",
        "bars": "pyrite:block/${block}",
        "edge": "pyrite:block/${block}"
    },
    "elements": [
        {   "from": [ 8, 0, 8 ],
            "to": [ 8, 16, 9 ],
            "faces": {
                "west": { "uv": [ 8, 0, 7, 16 ], "texture": "#bars" },
                "east": { "uv": [ 7, 0, 8, 16 ], "texture": "#bars" }
            }
        },
        {   "from": [ 7, 0, 9 ],
            "to": [ 9, 16, 9 ],
            "faces": {
                "north": { "uv": [ 9, 0, 7, 16 ], "texture": "#bars" },
                "south": { "uv": [ 7, 0, 9, 16 ], "texture": "#bars" }
            }
        }
    ]
}
`
capModelAlt = `{
  "ambientocclusion": false,
  "textures": {
    "particle": "${namespace}:block/${block}",
    "bars": "${namespace}:block/${block}",
    "edge": "${namespace}:block/${block}"
  },
  "elements": [
      {   "from": [ 8, 0, 7 ],
          "to": [ 8, 16, 8 ],
          "faces": {
              "west": { "uv": [ 8, 0, 9, 16 ], "texture": "#bars" },
              "east": { "uv": [ 9, 0, 8, 16 ], "texture": "#bars" }
          }
      },
      {   "from": [ 7, 0, 7 ],
          "to": [ 9, 16, 7 ],
          "faces": {
              "north": { "uv": [ 7, 0, 9, 16 ], "texture": "#bars" },
              "south": { "uv": [ 9, 0, 7, 16 ], "texture": "#bars" }
          }
      }
  ]
}`
sideModelAlt = `
{
  "ambientocclusion": false,
  "textures": {
    "particle": "${namespace}:block/${block}",
    "bars": "${namespace}:block/${block}",
    "edge": "${namespace}:block/${block}"
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
`
postModelEnds = `
{
  "ambientocclusion": false,
  "textures": {
    "particle": "${namespace}:block/${block}",
    "edge": "${namespace}:block/${block}"
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
`
  postModel = `{
    "ambientocclusion": false,
    "textures": {
      "particle": "${namespace}:block/${block}",
      "bars": "${namespace}:block/${block}"
    },
    "elements": [
        {   "from": [ 8, 0, 7 ],
            "to": [ 8, 16, 9 ],
            "faces": {
                "west": { "uv": [ 7, 0, 9, 16 ], "texture": "#bars" },
                "east": { "uv": [ 9, 0, 7, 16 ], "texture": "#bars" }
            }
        },
        {   "from": [ 7, 0, 8 ],
            "to": [ 9, 16, 8 ],
            "faces": {
                "north": { "uv": [ 7, 0, 9, 16 ], "texture": "#bars" },
                "south": { "uv": [ 9, 0, 7, 16 ], "texture": "#bars" }
            }
        }
    ]
}
`
  sideModel = `{
    "ambientocclusion": false,
    "textures": {
        "particle": "${namespace}:block/${block}",
        "bars": "${namespace}:block/${block}",
        "edge": "${namespace}:block/${block}"
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
`
  fs.writeFile(`${paths.models}${block}_cap.json`, capModel, function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_cap_alt.json`, capModelAlt, function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_post.json`, postModel, function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_side.json`, sideModel, function (err) {    if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_side_alt.json`, sideModelAlt, function (err) {if (err) throw err;});
  fs.writeFile(`${paths.models}${block}_post_ends.json`, postModelEnds, function (err) {if (err) throw err;});
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

function writeFenceBlockModels(block, baseBlock) {
  fs.writeFile(`${paths.models}${block}_post.json`, generateFenceBlockModels(block, baseBlock, namespace, "fence_post"), function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_side.json`, generateFenceBlockModels(block, baseBlock, namespace, "fence_side"), function (err) {
    if (err) throw err;

  });
  fs.writeFile(`${paths.models}${block}_inventory.json`, generateFenceBlockModels(block, baseBlock, namespace, "fence_inventory"), function (err) {
    if (err) throw err;

  });
}

function generateFenceGateBlockModels(block, namespace, baseBlock, model) {
  return `{
    "parent": "minecraft:block/${model}",
    "textures": {
      "texture": "${namespace}:block/${baseBlock}"
    }
  }`
}

function writeFenceGateBlockModels(block, namespace, baseBlock) {
  fs.writeFile(`${paths.models}${block}.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_open"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_wall.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_wall"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_wall_open.json`, generateFenceGateBlockModels(block, namespace, baseBlock, "template_fence_gate_wall_open"), function (err) { if (err) throw err; });
}

function writeDoorBlockModels(block, namespace, baseBlock) {

  fs.writeFile(`${paths.models}${block}_top_left.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_left"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_top_right.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_right"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_bottom_left.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_left"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_bottom_right.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_right"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_top_left_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_left_open"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_top_right_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_right_open"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_bottom_left_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_left_open"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.models}${block}_bottom_right_open.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_right_open"), function (err) { if (err) throw err; });

  //INFINITE MODELS
  fs.writeFile(`${paths.infinitemodels}${block}_top.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.infinitemodels}${block}_top_hinge.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_top_rh"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.infinitemodels}${block}_bottom.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom"), function (err) { if (err) throw err; });
  fs.writeFile(`${paths.infinitemodels}${block}_bottom_hinge.json`, generateDoorBlockModels(block, namespace, baseBlock, "door_bottom_rh"), function (err) { if (err) throw err; });


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
    altNamespace = namespace
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
  fs.writeFile(`${paths.itemModels}${block}.json`, modelItem, function (err) {if (err) throw err;});
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

function writeBricks(block, dye, namespace) {
  block = block + "_bricks"
  writeBlock(block, dye, namespace, "bricks")
  
}

function writeTerracottaBricks(block, dye, namespace) {
  block = block + "_bricks"
  
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
  writeLootTables(block, namespace)
  writeRecipes(block, "terracotta_bricks", dye)

  
}

function writeDye(item, dye, namespace) {
  item = item + "_dye"
  writeItem(item, dye, namespace, "dye")

}

function writeItem(item, dye, namespace, special) {
  writeUniqueItemModel(item, namespace)

}


function writeDoors(block, dye, namespace, baseBlock) {
  block = block + "_door"
  doorBlockState = generateDoorBlockState(block, namespace, baseBlock)
  writeBlockstate(block, doorBlockState, namespace)
  writeOldBlockstate(block, generateOldDoorBlockState(block, namespace, baseBlock), namespace)
  writeDoorBlockModels(block, namespace)
  writeUniqueItemModel(block, namespace)
  createTags(block, namespace)
  writeDoorLootTables(block, namespace)
  writeRecipes(block, "door", baseBlock)


}

function writeTrapdoors(block, dye, namespace, baseBlock) {
  block = block + "_trapdoor"
  doorBlockState = generateTrapdoorBlockState(block, namespace, baseBlock)
  writeBlockstate(block, doorBlockState, namespace)
  writeTrapdoorBlockModels(block, namespace, baseBlock)
  writeTrapdoorItemModel(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, "trapdoor", baseBlock)

}


function writeBlock(block, dye, namespace, special, baseBlock) {
  blockState = `{
    "variants": {
      "": {
        "model": "${namespace}:block/${block}"
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writePlankBlockModels(block, namespace, baseBlock)
  writeBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, special, dye)
  



}

function writeLeverBlock(block, namespace, baseBlock, altNamespace) {
  blockState = `{
    "variants": {
      "face=ceiling,facing=east,powered=false": {
        "model": "${namespace}:block/${block}_upright",
        "x": 180,
        "y": 270
      },
      "face=ceiling,facing=east,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 180,
        "y": 270
      },
      "face=ceiling,facing=north,powered=false": {
        "model": "${namespace}:block/${block}_upright",
        "x": 180,
        "y": 180
      },
      "face=ceiling,facing=north,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 180,
        "y": 180
      },
      "face=ceiling,facing=south,powered=false": {
        "model": "${namespace}:block/${block}_upright",
        "x": 180
      },
      "face=ceiling,facing=south,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 180
      },
      "face=ceiling,facing=west,powered=false": {
        "model": "${namespace}:block/${block}_upright",
        "x": 180,
        "y": 90
      },
      "face=ceiling,facing=west,powered=true": {
        "model": "${namespace}:block/${block}",
        "x": 180,
        "y": 90
      },
      "face=floor,facing=east,powered=false": {
        "model": "${namespace}:block/${block}_upright",
        "y": 90
      },
      "face=floor,facing=east,powered=true": {
        "model": "${namespace}:block/${block}",
        "y": 90
      },
      "face=floor,facing=north,powered=false": {
        "model": "${namespace}:block/${block}_upright"
      },
      "face=floor,facing=north,powered=true": {
        "model": "${namespace}:block/${block}"
      },
      "face=floor,facing=south,powered=false": {
        "model": "${namespace}:block/${block}_upright",
        "y": 180
      },
      "face=floor,facing=south,powered=true": {
        "model": "${namespace}:block/${block}",
        "y": 180
      },
      "face=floor,facing=west,powered=false": {
        "model": "${namespace}:block/${block}_upright",
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
  writeLeverBlockModels(block, namespace, baseBlock)
  writeUniqueBlockItemModel(block, namespace, "minecraft", baseBlock)
  writeLootTables(block, namespace)
  writeRecipes(block, "torch_lever", baseBlock, "pyrite", "minecraft")



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
  writeUniqueBlockItemModel(block, namespace, "pyrite", block)
  writeLootTables(block, namespace)
  writeRecipes(block, "torch", baseBlock, "pyrite", "pyrite")



}



function writeCraftingTableBlock(block, dye, namespace, baseBlock, altNamespace) {
  if (altNamespace == undefined ){
    altNamespace = namespace
  }
  block += "_crafting_table" 
  blockState = `{
    "variants": {
      "": {
        "model": "${namespace}:block/${block}"
      }
    }
  }`
  writeBlockstate(block, blockState, namespace)
  writeCraftingTableBlockModels(block, namespace, baseBlock)
  writeBlockItemModel(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, "crafting_table", baseBlock, namespace, altNamespace)
  // printBlock(block)
  



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

function writePaneBlock(block, namespace, baseBlock, dye) {
  baseBlock = block
  block = block + "_pane"
  writeBlockstate(block, generatePaneBlockState(block, namespace, baseBlock), namespace)
  writePaneBlockModels(block, namespace, baseBlock)
  writeBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, "glass_pane", dye)


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
  block = block + "_stem"
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
  writeLootTables(block, namespace)
  writeRecipes(block, special)


}
writeBlock("glowing_obsidian", "glowing_obsidian", "pyrite", "glowing_obsidian")
// writeBlock("nostalgia_glowing_obsidian", "glowing_obsidian", "pyrite", "glowing_obsidian")


function writeBrickSlab(block, namespace) {
  baseBlock = block + "_bricks"

  block = block + "_brick"
  writeSlabs(block, namespace, baseBlock)
}

function writeBrickStairs(block, namespace) {
  baseBlock = block + "_bricks"

  block = block + "_brick"
  writeStairs(block, namespace, baseBlock)
}
function writeBrickWall(block, namespace) {
  baseBlock = "block + _bricks"
  block = block + "_brick"

  namespace = "pyrite"
  writeWalls(block, namespace, baseBlock)
}

function writeWalls(block, namespace) {
  const baseBlock = block.replace("brick", "bricks")

  block = block + "_wall"
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
  writeLootTables(block, namespace)
  writeRecipes(block, "wall", baseBlock, namespace)

  // writeStonecutterRecipes(block, "wall", baseBlock, namespace, namespace)

}



function writeStairs(block, namespace, baseBlock) {
  block = block + "_stairs"
  namespace = "pyrite"
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
  writeBlockstate(block, stairBlockState, "pyrite")
  writeStairBlockModels(block, "pyrite", baseBlock)
  writeBlockItemModel(block, "pyrite")
  createTags(block, "pyrite")
  writeLootTables(block, "pyrite")
  writeRecipes(block, "stairs", baseBlock, "pyrite")

  // writeStonecutterRecipes(block, "wall", baseBlock, namespace, namespace)




}





function writeSlabs(block, namespace, baseBlock) {
  block = block + "_slab"
  namespace = "pyrite"
  slabBlockState = generateSlabBlockState(block, namespace, baseBlock)
  writeBlockstate(block, slabBlockState, namespace)
  writeSlabBlockModels(block, namespace, baseBlock)
  writeBlockItemModel(block, namespace)
  createTags(block, namespace)
  writeLootTables(block, namespace)
  writeRecipes(block, "slabs", baseBlock, namespace)

  // writeStonecutterRecipes(block, "slab", baseBlock, namespace, namespace)



}

function writePlates(block, namespace, baseBlock, altNamespace) {
  if( altNamespace == undefined ){
    altNamespace = namespace
  }
  block = block + "_pressure_plate"
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
  writeLootTables(block)
  writeRecipes(block, "plates", baseBlock)

}


function writeButtons(block, namespace, baseBlock, altNamespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  block = block + "_button"
  buttonBlockState = generateButtonBlockState(block, namespace, baseBlock)
  writeBlockstate(block, buttonBlockState)
  writeButtonBlockModels(block, altNamespace, baseBlock)
  writeInventoryModel(block)
  createTags(block)
  writeLootTables(block)
  writeRecipes(block, "buttons", baseBlock)


}
function writeFences(block, namespace, baseBlock) {
  block = block + "_fence"
  fenceBlockState = generateFenceBlockState(block, namespace, baseBlock)
  writeBlockstate(block, fenceBlockState)
  writeFenceBlockModels(block, baseBlock)
  writeInventoryModel(block)
  createTags(block)
  writeLootTables(block)
  writeRecipes(block, "fences", baseBlock, namespace)



}

function writeFenceGates(block, namespace, baseBlock, altNamespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  block = block + "_fence_gate"
  fenceGateBlockState = generateFenceGateBlockState(block, namespace)
  writeBlockstate(block, fenceGateBlockState, namespace, baseBlock)
  writeFenceGateBlockModels(block, altNamespace, baseBlock)
  writeBlockItemModel(block, namespace, baseBlock)
  createTags(block, namespace, baseBlock)
  writeLootTables(block, namespace, baseBlock)
  writeRecipes(block, "fence_gates", baseBlock, namespace)



}

function writeWallGates(block, namespace, baseBlock, altNamespace) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if (altNamespace == undefined) {
    altNamespace = namespace
  }
  block = block + "_wall_gate"
  fenceGateBlockState = generateFenceGateBlockState(block, namespace)
  writeBlockstate(block, fenceGateBlockState, "pyrite", baseBlock)
  writeFenceGateBlockModels(block, altNamespace, baseBlock)
  writeBlockItemModel(block, "pyrite", baseBlock)
  createTags(block, namespace, baseBlock)
  writeLootTables(block, "pyrite", baseBlock)
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
  writeLootTables(block, namespace)
  writeBlockItemModel(block, namespace)
  if (baseBlock.search("_top") != -1) {
    baseBlock = baseBlock.split("_top")[0]

  }
  writeRecipes(block, "carpet", baseBlock, namespace, altNamespace)


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

function generateRecipes(block, type, other, namespace, altNamespace, itemORid) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if (altNamespace == undefined) {
    altNamespace = "pyrite"
  }
  recipe = ""

  if (type == "planks") {
    other = `${other}_dye`
    altNamespace = changeDyeNamespace(other)
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "CCC",
      "CDC",
      "CCC"
    ],
    "key": {
      "C": {
        "tag": "minecraft:planks"
      },
      "D": {
        "item": "${altNamespace}:${other}"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 8
    }
}`
  }
  if (type == "terracotta") {
    other = `${other}_dye`
    altNamespace = changeDyeNamespace(other)
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "CCC",
      "CDC",
      "CCC"
    ],
    "key": {
      "C": {
        "item": "minecraft:terracotta"
      },
      "D": {
        "item": "${altNamespace}:${other}"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 8
    }
}`
  }
  if (type == "terracotta_bricks") {
    altNamespace = changeDyeNamespace(other + "_dye")
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "CC",
      "CC"
    ],
    "key": {
      "C": {
        "item": "${altNamespace}:${other}_terracotta"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 4
    }
}`
  }
  else if (type == "torch") {
    other = `${other}_dye`
    altNamespace = changeDyeNamespace(other)
    recipe = `{
      "type": "minecraft:crafting_shapeless",
      "ingredients": [
        {
          "item": "${altNamespace}:${other}"
        },
        {
          "item": "minecraft:torch"
        }
      ],
      "result": {
        "item": "${namespace}:${block}",
        "id": "${namespace}:${block}",
        "count": 1
      }
    }`
  }
  else if (type == "wool") {
    recipe = `{
      "type": "minecraft:crafting_shapeless",
      "category": "misc",
      "ingredients": [
        {
          "item": "${namespace}:${other}_dye"
        },
        {
          "item": "minecraft:white_wool"
        }
      ],
      "result": {
        "count": 1,
        "item": "${namespace}:${block}",
        "id": "${namespace}:${block}"
      }
    }`
  }
  else if (type == "torch_lever") {
    recipe = `{
      "type": "minecraft:crafting_shapeless",
      "ingredients": [
        {
          "item": "${altNamespace}:${other}"
        },
        {
          "item": "minecraft:lever"
        }
      ],
      "result": {
        "item": "${namespace}:${block}",
        "id": "${namespace}:${block}",
        "count": 1
      }
    }`
  }
  else if (type == "mushroom_planks") {
    recipe = `{
      "type": "minecraft:crafting_shapeless",
      "ingredients": [
        {
          "item": "pyrite:${other}_mushroom_stem"
        }
      ],
      "result": {
        "item": "pyrite:${block}",
        "id": "pyrite:${block}",
        "count": 4
      }
    }`
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
  else if (type == "dyed_framed_glass") {
    const dye = `${other}_dye`
    altNamespace = changeDyeNamespace(dye)
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "CCC",
      "CDC",
      "CCC"
    ],
    "key": {
      "C": {
        "item": "${namespace}:framed_glass"
      },
      "D": {
        "item": "${altNamespace}:${dye}"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 8
    }
}`
  }
  else if (type == "lamps") {
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
      recipe = `        {
      "type": "minecraft:crafting_shaped",
      "pattern": [
        "CCC",
        "CDC",
        "CCC"
      ],
      "key": {
        "C": {
          "item": "pyrite:glowstone_lamp"
        },
        "D": {
          "item": "${altNamespace}:${other}"
        }
      },
      "result": {
        "item": "${namespace}:${block}",
        "id": "${namespace}:${block}",
        "count": 8
      }
  }`
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
    recipe = `        {
    "type": "minecraft:crafting_shaped",
    "pattern": [
      "CCC",
      "CDC",
      "CCC"
    ],
    "key": {
      "C": {
        "item": "minecraft:bricks"
      },
      "D": {
        "item": "${altNamespace}:${other}"
      }
    },
    "result": {
      "item": "${namespace}:${block}",
      "id": "${namespace}:${block}",
      "count": 8
    }  
}`}
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
    recipe = `{
      "type": "minecraft:crafting_shapeless",
      "category": "misc",
      "ingredients": [
        {
          "item": "pyrite:nostalgia_dye"
        },
        {
          "item": "minecraft:${other}"
        }
      ],
      "result": {
        "count": 1,
        "item": "pyrite:${block}",
        "id": "pyrite:${block}"
      }
    }`
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
    recipe = `{
      "type": "minecraft:crafting_shapeless",
      "category": "misc",
      "ingredients": [
        {
          "item": "${altNamespace}:${other}"
        },
        {
          "tag": "${altNamespace}:buttons"
        }
      ],
      "result": {
        "count": 1,
        "item": "${namespace}:${block}",
        "id": "${namespace}:${block}"
      }
    }`
  }

  return recipe

}

function writeRecipes(block, type, other, namespace, altNamespace) {
  recipe = generateRecipes(block, type, other, namespace, altNamespace)
  fs.writeFile(`${paths.recipes}${block}.json`, recipe, function (err) {
    if (err) throw err;

  });
}

function writeStonecutterRecipes(block, type, other, namespace, altNamespace, addon) {
  if (namespace == undefined) {
    namespace = "pyrite"
  }
  if( addon == undefined ){
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


function generateBlockModel(block, namespace, baseBlock, model) {
  if (model == undefined) {
    model = "cube_all"
  }
  return `{
    "parent": "minecraft:block/${model}",
    "textures": {
      "all": "${namespace}:block/${block}"
    }
  }`
}

function generateCraftingTableBlockModel(block, namespace, baseBlock) {
  return `{
    "parent": "minecraft:block/cube",
    "textures": {
      "particle": "${namespace}:block/${block}_front",
      "north": "${namespace}:block/${block}_front",
      "south": "${namespace}:block/${block}_side",
      "east": "${namespace}:block/${block}_side",
      "west": "${namespace}:block/${block}_front",
      "up": "${namespace}:block/${block}_top",
      "down": "${namespace}:block/${baseBlock}"
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
      return `{
        "parent": "${altNamespace}:block/wall_${baseBlock}",
        "render_type": "cutout"
    }`
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
  if ((other == "glow_dye") || (other == "dragon_dye") || (other == "star_dye") ||(other == "honey_dye") || (other == "rose_dye") || (other == "nostalgia_dye") || (other == "poisonous_dye")) {
    return  "pyrite"
  }
  else {
    return "minecraft"
  }
}