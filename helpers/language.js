module.exports = {
	catify: function catify(value) {
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
}
