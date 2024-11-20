const fs = require('fs');

const rootFolder = readFileAsJson("./config.json").modPath
const resourcesPath = rootFolder+`${commonPath()}/src/main/resources/`

const modID = readFileAsJson("./config.json").modID
const mc = "minecraft";
const mcVersion = getVersion();
const majorVersion = parseInt(mcVersion.split(".")[1]);
const minorVersion = parseInt(mcVersion.split(".")[2]);

const vanillaDyes = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"]


function commonPath() {
    const projectType = readFileAsJson("./config.json").projectType
    if (projectType == "architectury") {
        return "common"
    }
    else {
        return ""
    }
}

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
    assets: `${resourcesPath}assets/${modID}/`,
    data: `${resourcesPath}data/${modID}/`,
    recipes: `${resourcesPath}data/${modID}/recipe${s}/`,
    models: `${resourcesPath}assets/${modID}/models/block${s}/`,
    itemModels: `${resourcesPath}assets/${modID}/models/item${s}/`,
    blockstates: `${resourcesPath}assets/${modID}/blockstates/`,
    items: `${resourcesPath}assets/${modID}/items/`,
    loot: `${resourcesPath}data/${modID}/loot_table${s}/blocks/`,

}

function readFile(path) {
    return fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })
}

function readFileAsJson(path) {
    let file;
    try {
        file = JSON.parse(readFile(path))

    }
    catch {
        file = undefined
    }
    return file
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
		dye = dye.replace("terracotta", "")
	}
	if (dye.includes("_dye")) {
		dye.replace("_dye", "")
	}

    if (vanillaDyes.includes(dye)) {
        return mc
    }
    else {
        return modID
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
    vanillaDyes: vanillaDyes,

    
    readFile: readFile,
    writeFile, writeFile,
    writeFileSafe, writeFileSafe,

    readFileAsJson: readFileAsJson,

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