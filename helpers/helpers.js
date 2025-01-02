const fs = require('fs');

const config = readConfigFile()

function readConfigFile() {
    let arg = process.argv[2]
    let configPath = "./config.json"
    if (arg.includes(".json")) {
        configPath = arg
    }
    let returnedConfig;
    let localConfig = readFileAsJson(configPath)
    if (localConfig instanceof Array) {
        localConfig.forEach(function(configOption) {
            if (arg == configOption.modID) {
                returnedConfig = configOption
            }
        })
        if (returnedConfig == undefined)
            returnedConfig = localConfig[0];
    }
    else {
        returnedConfig = localConfig
    }
    return returnedConfig
}

const rootFolder = config.modPath
const resourcesPath = rootFolder+`${commonPath()}/src/main/resources/`

const modID = config.modID
const mc = "minecraft";
const mcVersion = getVersion();
const majorVersion = parseInt(mcVersion.split(".")[1]);
const minorVersion = parseInt(mcVersion.split(".")[2]);

const vanillaDyes = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"]

function commonPath() {
    const projectType = config.projectType
    if (projectType == "architectury") {
        return "common"
    }
    else {
        return ""
    }
}

function neoPath() {
    const projectType = config.projectType
    if (projectType == "architectury") {
        return "neoforge"
    }
    else {
        return ""
    }
}

function getVersion() {
    if (config.version == null) {
        try {
            let gradleProperties = readFile(rootFolder+"gradle.properties")
            gradleProperties = gradleProperties.split("minecraft_version")[1]
            gradleProperties = gradleProperties.split("\n")[0]
            gradleProperties = gradleProperties.replace("=", "").trim()
            return gradleProperties;
        }
        catch {
            return "1.21.1"
        }
    }
    else return config.version
    
}

const s = getTrialPlural()

function getTrialPlural() {
    if (majorVersion < 21) {
        return "s"
    } else {
        return ""
    }
}

const paths = {
    base: `${resourcesPath}`,
    assets: `${resourcesPath}assets/${modID}/`,
    data: `${resourcesPath}data/${modID}/`,
    recipes: `${resourcesPath}data/${modID}/recipe${s}/`,
    models: `${resourcesPath}assets/${modID}/models/block/`,
    itemModels: `${resourcesPath}assets/${modID}/models/item/`,
    blockstates: `${resourcesPath}assets/${modID}/blockstates/`,
    items: `${resourcesPath}assets/${modID}/items/`,
    loot: `${resourcesPath}data/${modID}/loot_table${s}/blocks/`,
    advancementRecipes: `${resourcesPath}data/${modID}/advancement${s}/recipes/`,
    datamaps: `${rootFolder}/${neoPath()}/src/main/resources/data/neoforge/data_maps/${modID}/`,


}

function readFile(path) {
    return fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })
}

function readFileAsJson(path) {
    let file;
    try {
        file = JSON.parse(readFile(path))

    } catch {
        file = undefined
    }
    return file
}

function writeFile(path, data, minify) {
	if (data instanceof Object) {
        if (minify !== false) {
            data = JSON.stringify(data)
        }
        else {
            data = JSON.stringify(data, null, " ")
        }
	}
	else {
        if (minify !== false) {
            try {
                data = JSON.parse(data)
                data = JSON.stringify(data)
            }
            catch { }
        }
	}
	if (config.disableWriting === false) {
        if (!path.includes("undefined") && data !== "") {
            fs.writeFileSync(path, data, function (err) { if (err) throw err; })
        }
        else {
            // console.log("Preventing write of " + path)
        }
	}
}

function writeFileSafe(path, data) {
	if (!fs.existsSync(path)) {
		writeFile(path, data)
	}
}

function getDyeNamespace(dye) {
	if (dye.includes(":")) {
		return dye.split(":")[0]
	}
	if (dye.includes("terracotta")) {
		dye = dye.replace("terracotta", "")
	}
	else if (dye.includes("_dye")) {
		dye = dye.replace("_dye", "")
	}
    else if (dye.includes("_framed_glass")) {
		dye = dye.replace("_framed_glass", "")
	}
    if (vanillaDyes.includes(dye)) {
        return mc
    }
    else {
        return modID
    }
}

function getDyeIngredient(dye) {
	switch (dye) {
		case "glow_dye":
			return "minecraft:glow_ink_sac"
		case "dragon_dye":
			return "minecraft:dragon_breath"
		case "star_dye":
			return "minecraft:nether_star"
		case "honey_dye":
			return "minecraft:honeycomb"
		case "rose_dye":
			return ["minecraft:red_dye", "minecraft:pink_dye"]
		case "nostalgia_dye":
			return "minecraft:apple"
		case "poisonous_dye":
			return "minecraft:poisonous_potato"
	}
}

function versionAbove(version) {
	const localMajor = parseInt(version.split(".")[1])
	const localMinor = parseInt(version.split(".")[2])

	if ((localMajor < majorVersion)) {
		return true;
    } else if ((majorVersion === localMajor) && (minorVersion >= localMinor)) {
		return true;
	} else {
		return false;
	}

}

function populateTemplates() {
	const templatePath = `./overrides/${modID}/models/templates/`
	const templates = fs.readdirSync(templatePath)
	templates.forEach(function(template) {
		writeFileSafe(`${paths.models}${template}`, readFile(templatePath + template))
	})
}

function generateNeoWaxables(waxedBlocks) {
    let path = paths.datamaps + "/waxables.json"
    let template = {
        "values": {}
    }
    if (fs.existsSync(path)) {
        let file = readFileAsJson(path)
        if (file != undefined) {
            template = file
        }
    }
    
    waxedBlocks.forEach(function(waxedBlock) {
        waxedBlock = "pyrite:"+waxedBlock
        var base = waxedBlock.replace("waxed_", "")
        template.values[base] = {waxed: waxedBlock}
    })

    writeFile(path, template)
}

module.exports = {
    modID: modID,
    mc: mc,
    mcVersion: mcVersion,
    majorVersion: majorVersion,
    minorVersion: minorVersion,


    id: function id(namespace, path) {
        if (path === undefined) {
            return id(modID, namespace)
        }
        // If path somehow includes an identifier already, use the path instead.
        if (path.includes(":")) {
            return path;
        }
        // If not, create a new identified path.
        return namespace + ":" + path
    },

    basePath: resourcesPath,
    recipePath: paths.recipes,
    modelPath: paths.models,
    paths: paths,
    vanillaDyes: vanillaDyes,
    config: config,

    
    readFile: readFile,
    writeFile, writeFile,
    writeFileSafe, writeFileSafe,

    readFileAsJson: readFileAsJson,

    getPath: function getPath(namespacedString) {
        if (namespacedString.includes(":")) {
            return namespacedString.split(":")[1]
        } else {
            return namespacedString;
        }
    },
    
    getNamespace: function getNamespace(namespacedString) {
        if (namespacedString.includes(":")) {
            return namespacedString.split(":")[0]
        } else {
            return namespacedString;
        }
    },

    getDyeNamespace: getDyeNamespace,
    getDyeIngredient: getDyeIngredient,

    versionAbove: versionAbove,
    populateTemplates: populateTemplates,
    generateNeoWaxables: generateNeoWaxables
}