const fs = require('fs');

const modID = "pyrite";
const mc = "minecraft";
const mcVersion = "1.21.1";
const majorVersion = parseInt(mcVersion.split(".")[1]);
const minorVersion = parseInt(mcVersion.split(".")[2]);

const recipePath = `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.21)/common/src/main/resources/data/pyrite/recipes`

const modelPath = `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.21)/common/src/main/resources/assets/pyrite/models/block/`



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
		fs.writeFile(path, data, function (err) { if (err) throw err; })
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

    basePath: function getBasePath() {
        return `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.21)/common/src/main/resources`
    },

    recipePath: recipePath,

    modelPath: modelPath,

    
    readFile: readFile,

    writeFile, writeFile,

    writeFileSafe, writeFileSafe,

    readFileAsJson: function readFileAsJson(path) {
        return JSON.parse(readFile(path))
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