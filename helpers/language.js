const { existsSync } = require("fs")
const helpers = require("../helpers/helpers")
const { readFileAsJson } = require("../helpers/helpers")

let blockTranslations = readFileAsJson(`./overrides/${helpers.modID}/lang/en_us.json`)
let catTranslations = readFileAsJson(`./overrides/${helpers.modID}/lang/lol_us.json`)
let upsideDownTranslations = flipTranslationFile(`./overrides/${helpers.modID}/lang/en_us.json`)
const modID = helpers.modID

function writeLang() {
  helpers.writeFile(
    `${helpers.paths.assets}lang/en_us.json`,
    JSON.stringify(blockTranslations, undefined, " "),
    false
  )
  helpers.writeFile(
    `${helpers.paths.assets}lang/lol_us.json`,
    JSON.stringify(catTranslations, undefined, " "),
    false
  )
  helpers.writeFile(
    `${helpers.paths.assets}lang/en_ud.json`,
    JSON.stringify(upsideDownTranslations, undefined, " "),
    false
  )
}

function countBlocksInLang() {
	let count = 0;
	Object.keys(blockTranslations).forEach(function(translation) {
		if (translation.includes("block." + modID))
			count++
	})
	return count
}

function generateLang(block, type, namespace) {
  if (type === undefined) {
    type = "block"
  }
  block = helpers.getPath(block)
  let langBlock = block
  langBlock = langBlock.replaceAll("_", " ")
  langBlock = langBlock.replaceAll("/", " ")
  langBlock = langBlock.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  })
  const key = `${type}.${namespace}.${block.replace("/", ".")}`
  const value = langBlock
  return addLang(key, value)
}

function addLang(key, value) {
  if (blockTranslations != null) {
    if (!blockTranslations.hasOwnProperty(key)) {
      blockTranslations = Object.assign(
        blockTranslations,
        JSON.parse(`{"${key}": "${value}"}`)
      )
    }
    if (catTranslations != null) {
      if (!catTranslations.hasOwnProperty(key)) {
        catTranslations = Object.assign(
          catTranslations,
          JSON.parse(`{"${key}": "${catify(value)}"}`)
        )
      }
      if (!upsideDownTranslations.hasOwnProperty(key)) {
        upsideDownTranslations = Object.assign(
          upsideDownTranslations,
          JSON.parse(`{"${key}": "${upsideDownify(value)}"}`)
        )
      }
    }
    
  }
  
  return value
}

function generateBlockLang(block) {
  return generateLang(block, "block", modID)
}

function flipTranslationFile(path) {
  let file
  let upsideDownTranslations = {}
  if (path == Object) {
    file = path
  } else if (existsSync(path)) file = readFileAsJson(path)
  else file = path

  for (const [key, value] of Object.entries(file)) {
    if (!upsideDownTranslations.hasOwnProperty(key)) {
      let values = new Map([[key, upsideDownify(value)]])
      upsideDownTranslations = Object.assign(
        upsideDownTranslations,
        Object.fromEntries(values)
      )
    }
  }
  return upsideDownTranslations
}

function upsideDownify(value) {
  value = value.replace("Gray", "Grey").replace("Shovel", "Spade")
  let newValue = ""
  value.split("").forEach((char) => {
    const upsideDownTable = {
      A: "Ɐ",
      B: "ᗺ",
      C: "Ɔ",
      D: "ᗡ",
      E: "Ǝ",
      F: "Ⅎ",
      G: "⅁",
      // H: "H",
      // I: "I",
      J: "Ր",
      K: "Ʞ",
      L: "Ꞁ",
      M: "W",
      // N: "N",
      // O: "O",
      P: "Ԁ",
      Q: "Ꝺ",
      R: "ᴚ",
      S: "S",
      T: "⟘",
      U: "∩",
      V: "Ʌ",
      W: "M",
      // X: "X",
      Y: "⅄",
      // Z: "Z",

      a: "ɐ",
      b: "q",
      c: "ɔ",
      d: "p",
      e: "ǝ",
      f: "ɟ",
      g: "ᵷ",
      h: "ɥ",
      i: "ᴉ",
      j: "ɾ",
      k: "ʞ",
      l: "ן",
      m: "ɯ",
      n: "u",
      // o: "o",
      p: "d",
      q: "b",
      r: "ɹ",
      // s: "s",
      t: "ʇ",
      u: "n",
      v: "ʌ",
      w: "ʍ",
      // x: "x",
      y: "ʎ",
      // z: "z",

      1: "⥝",
      2: "↊",
      3: "↋",
      4: "߈",
      // 5: "5",
      6: "9",
      7: "𝘓",
      // 8: "8",
      9: "6",
      // 0: "0",

      ".": "˙",
      ",": "‘",
      ";": "⸵",
      "!": "¡",
      "?": "¿",
      "&": "⅋",
      '"': "„",
      "'": ",",
      "(": ")",
      ")": "(",
      "[": "]",
      "]": "[",
      "{": "}",
      "}": "{",
      "<": ">",
      ">": "<",
      "→": "←",
      "↓": "↑",
      "←": "→",
      "↑": "↓",
    }

    newValue = (upsideDownTable[char] || char) + newValue
  })
  newValue = newValue.replaceAll(/(.)§/g, "§$1")

  const count = (newValue.match(/%s/g) || []).length
  if (count > 1) {
    let countRemaining = count
    console.log(count)

    for (let i = 0; i < count; i++) {
      newValue = newValue.replace("%s", `%${countRemaining}$s`)
      countRemaining--
    }
  }
  return newValue
}

function catify(value) {
  value = value.replace("Quartz", "Kwartz")
  value = value.replace("Pillar", "piler")
  value = value.replace("Grass", "Gras")
  value = value.replace("Block", "Blak")
  value = value.replace("Podzol", "Durtee durt")
  value = value.replace("Mycelium", "miceliwm")
  value = value.replace("Path", "Durt roud")
  value = value.replace("Path", "Durt roud")
  value = value.replace("Nether Bricks", "Brik from Nether")
  value = value.replace("Charred", "hot!!!")
  value = value.replace("Oak", "Oac")
  value = value.replace("Spruce", "Spruz")
  value = value.replace("Birch", "Berch")
  value = value.replace("Jungle", "Junglz")
  value = value.replace("Bamboo", "Gren")
  value = value.replace("Cherry", "Sakura")
  value = value.replace("Mangrove", "mengruv")
  value = value.replace("Nostalgia", "OLD")
  value = value.replace("Amethyst", "Purpur shinee")
  value = value.replace("Lapis ", "Glosy Blu ")
  value = value.replace("Emerald ", "Emmiez ")
  value = value.replace("Cut ", "1000° kniv vs ")
  value = value.replace("Chiseled ", "Chizald ")
  value = value.replace("Mossy Cobblestone ", "DURTY COBULSTOWN ")
  value = value.replace("Cobblestone", "Cooblestoneh")
  value = value.replace("Exposed", "Seen")
  value = value.replace("Weathered", "Yucky old")
  value = value.replace("Oxidized", "Old")
  value = value.replace("Tuff", "Tff")
  value = value.replace("Lamp", "lapm")
  value = value.replace("Deepslate", "dark ston")
  value = value.replace("Carpet", "Cat Rug")
  value = value.replace("Light ", "Lite ")
  value = value.replace("Blue ", "Bloo ")
  value = value.replace("Purple ", "Parpal ")
  value = value.replace("Brown ", "Brownish ")
  value = value.replace("Magenta ", "Majenta ")
  value = value.replace("Red ", "Redish ")
  value = value.replace("Orange ", "Ornge ")
  value = value.replace("Yellow ", "Yello ")
  value = value.replace("Green ", "Greenish ")
  value = value.replace("Cyan ", "Sighun ")
  value = value.replace("Pink ", "Pinky ")
  value = value.replace("Lime", "Limd")
  value = value.replace("Poisonous", "yucky")
  value = value.replace("Lit ", "Bright ")
  value = value.replace("Terracotta", "Teracottah")
  value = value.replace("Stairs", "Stairz")
  value = value.replace("Wool", "Fur Bluk")
  value = value.replace("Crafting Table", "Krafting Tabal")
  value = value.replace("Gate", "dor")
  value = value.replace("Wall", "Wal")
  value = value.replace("Pressure Plate", "prueusure platt")
  value = value.replace("Ladder", "Ladr")
  value = value.replace("Pane", "Payn")
  value = value.replace("Star", "Asterisk")
  value = value.replace("Glass", "Glazz")
  value = value.replace("Bars", "Jeil Bahz")
  value = value.replace("Iron", "Irony")
  value = value.replace("Door", "Dor")
  value = value.replace("Gold", "Shiny")
  value = value.replace("Crimson", "Crimzn")
  value = value.replace("Warped", "Warpt")
  value = value.replace("Torch Lever", "burny flipurr")
  value = value.replace("Torch", "burny thing")
  value = value.replace("Trapdoor", "Trap")
  value = value.replace("Hanging", "Danglin'")
  value = value.replace("White", "Wite")
  value = value.replace(" Dye", " powder")

  if (Math.floor(Math.random() * 2) == 0) {
    value = value.replace("Stained", "Staned")
  } else {
    value = value.replace("Stained", "Stainedly")
  }

  if (Math.floor(Math.random() * 2) == 0) {
    value = value.replace("Copper", "cuprr")
  } else {
    value = value.replace("Copper", "copurr")
  }

  if (Math.floor(Math.random() * 2) == 0) {
    value = value.replace("Block", "Blak")
  } else {
    value = value.replace("Block", "bluk")
  }

  if (Math.floor(Math.random() * 2) == 0) {
    value = value.replace("Slab", "Sleb")
  } else {
    value = value.replace("Slab", "half blok")
  }

  return value
}

module.exports = {
  catify: catify,

  upsideDownify: upsideDownify,

  flipTranslationFile: flipTranslationFile,

  generateBlockLang: generateBlockLang,
  addLang: addLang,

  writeLang: writeLang,

  generateLang: generateLang,
  countBlocks: countBlocksInLang,
}
