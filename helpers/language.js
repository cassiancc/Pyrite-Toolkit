const helpers = require("../helpers/helpers");
const { readFileAsJson } = require("../helpers/helpers");

let blockTranslations = readFileAsJson("./overrides/lang/en_us.json")
let catTranslations = readFileAsJson("./overrides/lang/lol_us.json")
let upsideDownTranslations = flipTranslationFile("./overrides/lang/en_us.json")
const modID = helpers.modID

function writeLang() {
	helpers.writeFile(`${helpers.paths.assets}lang/en_us.json`, JSON.stringify(blockTranslations, undefined, " "), false)
	helpers.writeFile(`${helpers.paths.assets}lang/lol_us.json`, JSON.stringify(catTranslations, undefined, " "), false)
	helpers.writeFile(`${helpers.paths.assets}lang/en_ud.json`, JSON.stringify(upsideDownTranslations, undefined, " "), false)
}

function generateLang(block, type, namespace) {
	if (type === undefined) {
		type = "block";
	}
	block = helpers.getPath(block)
	let langBlock = block;
	langBlock = langBlock.replaceAll("_", " ");
	langBlock = langBlock.replaceAll("/", " ");
	langBlock = langBlock.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(); });
	const key = `${type}.${namespace}.${block.replace("/", ".")}`;
	const value = langBlock;
	if (!blockTranslations.hasOwnProperty(key)) {
		blockTranslations = Object.assign(blockTranslations, JSON.parse(`{"${key}": "${value}"}`));
	}
	if (!catTranslations.hasOwnProperty(key)) {
		catTranslations = Object.assign(catTranslations, JSON.parse(`{"${key}": "${catify(value)}"}`));
	}
	if (!upsideDownTranslations.hasOwnProperty(key)) {
		upsideDownTranslations = Object.assign(upsideDownTranslations, JSON.parse(`{"${key}": "${upsideDownify(value)}"}`));
	}
	return value;
}


function generateBlockLang(block) {
	return generateLang(block, "block", modID)
}

function flipTranslationFile(path) {
    let upsideDownTranslations = {};
    const file = readFileAsJson(path)
    for (const [key, value] of Object.entries(file)) {
        if (!upsideDownTranslations.hasOwnProperty(key)) {
            upsideDownTranslations = Object.assign(upsideDownTranslations, JSON.parse(`{"${key}": "${upsideDownify(value)}"}`));
        }
      }
    return upsideDownTranslations
}

function upsideDownify(value) {
	value = value.replace("A", "Ɐ")
	value = value.replace("B", "ᗺ")
	value = value.replace("C", "Ɔ")
	value = value.replace("D", "ᗡ")
	value = value.replace("E", "Ǝ")
	value = value.replace("F", "Ⅎ")
	value = value.replace("G", "⅁")
	value = value.replace("H", "H")
	// value = value.replace("I", "I")
	value = value.replace("J", "Ր")
	value = value.replace("K", "Ʞ")
	value = value.replace("L", "Ꞁ")
	value = value.replace("M", "W")
	// value = value.replace("N", "N")
	// value = value.replace("O", "O")
	value = value.replace("P", "Ԁ")
	value = value.replace("Q", "Ꝺ")
	value = value.replace("R", "ᴚ")
	value = value.replace("S", "S")
	value = value.replace("T", "⟘")
	value = value.replace("U", "∩")
	value = value.replace("V", "Ʌ")
	value = value.replace("W", "M")
	// value = value.replace("X", "X")
	value = value.replace("Y", "⅄")
	// value = value.replace("Z", "Z")
	value = value.replace("a", "ɐ")
	value = value.replace("b", "q")
	value = value.replace("c", "ɔ")
	value = value.replace("d", "p")
	value = value.replace("e", "ǝ")
	value = value.replace("f", "ɟ")
	value = value.replace("g", "ᵷ")
	value = value.replace("h", "ɥ")
	value = value.replace("i", "ᴉ")
	value = value.replace("j", "ɾ")
	value = value.replace("k", "ʞ")
	value = value.replace("l", "ן")
	value = value.replace("m", "ɯ")
	value = value.replace("n", "u")
	// value = value.replace("o", "o")
	value = value.replace("p", "d")
	value = value.replace("q", "b")
	value = value.replace("r", "ɹ")
	// value = value.replace("s", "s")
	value = value.replace("t", "ʇ")
	value = value.replace("u", "n")
	value = value.replace("v", "ʌ")
	value = value.replace("w", "ʍ")
	// value.replace("x", "x")
	value = value.replace("y", "ʎ")
	// value = value.replace("z", "z")
	value = value.replace("1", "⥝")
	value = value.replace("2", "↊")
	value = value.replace("3", "↋")
	value = value.replace("4", "ߤ")
	// value = value.replace("5", "")
	value = value.replace("6", "9")
	value = value.replace("7", "𝘓")
	// value = value.replace("8", "8")
	value = value.replace("9", "6")

	value = value.replace(".", "˙")
	let newValue = "";
	value.split("").forEach(char => {
		newValue = char + newValue
	});
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



	if (Math.floor(Math.random() * 2) == 0) {
		value = value.replace("Stained", "Staned")
	}
	else {
		value = value.replace("Stained", "Stainedly")
	}


	if (Math.floor(Math.random() * 2) == 0) {
		value = value.replace("Copper", "cuprr")
	}
	else {
		value = value.replace("Copper", "copurr")
	}

	if (Math.floor(Math.random() * 2) == 0) {
		value = value.replace("Block", "Blak")
	}
	else {
		value = value.replace("Block", "bluk")
	}

	if (Math.floor(Math.random() * 2) == 0) {
		value = value.replace("Slab", "Sleb")
	}
	else {
		value = value.replace("Slab", "half blok")
	}
	return value;


}

module.exports = {
	catify: catify,

	upsideDownify: upsideDownify,

	flipTranslationFile: flipTranslationFile,

	generateBlockLang: generateBlockLang,

	writeLang: writeLang,

	generateLang: generateLang
}