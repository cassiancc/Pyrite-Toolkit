const fs = require('fs');

const rootFolder = `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.21)/`
const resourcesPath = rootFolder+`common/src/main/resources/`

const modID = "pyrite";
const mc = "minecraft";
const mcVersion = getVersion();
const majorVersion = parseInt(mcVersion.split(".")[1]);
const minorVersion = parseInt(mcVersion.split(".")[2]);



function getVersion() {
    let gradleProperties = readFile(rootFolder+"gradle.properties")
    gradleProperties = gradleProperties.split("minecraft_version")[1]
    gradleProperties = gradleProperties.split("\n")[0]
    gradleProperties = gradleProperties.replace("=", "").trim()

    return gradleProperties;

}

const s = getTrialPlural()

function getTrialPlural() {
    if (majorVersion < 21) {
        return "s"
    }
    else {
        return ""
    }
}

const paths = {
    base: `${resourcesPath}`,
    assets: `${resourcesPath}assets/pyrite/`,
    data: `${resourcesPath}data/pyrite/`,
    recipes: `${resourcesPath}data/pyrite/recipe${s}/`,
    models: `${resourcesPath}assets/pyrite/models/block${s}/`,
    itemModels: `${resourcesPath}assets/pyrite/models/item${s}/`,
    blockstates: `${resourcesPath}assets/pyrite/blockstates/`,
    items: `${resourcesPath}assets/pyrite/items/`,
    loot: `${resourcesPath}data/pyrite/loot_table${s}/blocks/`,

}

function readFile(path) {
    return fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })
}

function writeFile(path, data) {
	const demoMode = false
	if (data instanceof Object) {
		data = JSON.stringify(data)
	}
	else {
		try {
			data = JSON.parse(data)
			data = JSON.stringify(data)
		}
		catch { }

	}
	if (demoMode === false) {
        if (!path.includes("undefined")) {
            fs.writeFile(path, data, function (err) { if (err) throw err; })
        }
        else {
            console.log("Preventing write of " + path)
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
		dye = dye.replace("terracotta", "dye")
	}
	if (!dye.includes("_dye")) {
		dye = dye + "_dye"
	}

	if ((dye === "glow_dye") || (dye === "dragon_dye") || (dye === "star_dye") || (dye === "honey_dye") || (dye === "rose_dye") || (dye === "nostalgia_dye") || (dye === "poisonous_dye")) {
		return modID
	}
	else {
		return mc
	}
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

    
    readFile: readFile,
    writeFile, writeFile,
    writeFileSafe, writeFileSafe,

    readFileAsJson: function readFileAsJson(path) {
        let file;
        try {
            file = JSON.parse(readFile(path))
 
        }
        catch {
            file = undefined
        }
        return file
    },

    getPath: function getPath(namespacedString) {
        if (namespacedString.includes(":")) {
            return namespacedString.split(":")[1]
        }
        else {
            return namespacedString;
        }
    },
    
    getNamespace: function getNamespace(namespacedString) {
        if (namespacedString.includes(":")) {
            return namespacedString.split(":")[0]
        }
        else {
            return namespacedString;
        }
    },

    getDyeNamespace: getDyeNamespace
}