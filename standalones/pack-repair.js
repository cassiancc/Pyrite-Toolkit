var fs = require('fs');
const path = require('path');

let badPaths = []
let badDirs = []
let fixedFiles = 0

var isWin = process.platform === "win32";
var assets = "assets/"

if (isWin) {
    assets = "assets\\"
}

async function* walk(dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) {
            if (d.name.includes(" ") || d.name.match(/[A-Z]/)) {
                let fullPath = d.parentPath + "/" + d.name
                badPaths.push(fullPath)
            }
            yield* walk(entry);
        }
        else if (d.isFile()) yield entry;
    }
}

async function main(dir) {
    if (dir == undefined) {
        console.error("Please provide a path to the unzipped resource pack you wish to repair as a command line argument.")
        console.error("For example: node standalones/pack-repair \"/home/username/Minecraft/resourcepacks/resourcepackname\"")
        return
    }
    repair(dir)
    // it seems to need to run twice to correct the full set of errors? worth investigating a fix here
    repair(dir)
    
    console.info("Resource Pack repair finished, " + fixedFiles + " files with broken paths repaired.")
}

function repairPath(path) {
    if (path.includes("assets")) {
        try {
            let pathArray = path.split(assets)
            let badDir = pathArray[1].split("/")
            badDir = badDir[badDir.length - 1]
            pathArray[1] = pathArray[1].replaceAll(" ", "_").toLowerCase()
            let newPath = pathArray[0] + assets + pathArray[1]
        
            // console.log(badDir)
            badDirs.push(badDir)
            fs.renameSync(path, newPath)
            fixedFiles++
        }
        catch (e) {
            console.log(path)
            console.log(e)
        }
    }
    
}

async function repair(dir) {
    for await (const p of walk(dir)) {
        try {
            let pathArray = p.split(assets)
            let badFile = pathArray[1].split("/")
            badFile = badFile[badFile.length - 1]
            pathArray[1] = pathArray[1].replaceAll(" ", "_").toLowerCase()
            let newPath = pathArray[0] + assets + pathArray[1]
    
            // console.log(badFile)
            badDirs.push(badFile)
            console.log(badFile)
            fs.renameSync(p, newPath)
            fixedFiles++
        }
        catch {}
        
    }
    // console.log(badPaths)
    badPaths.forEach(function (badPath) {
        let pathArray = badPath.split(assets)
        let badDir = pathArray[1].split("/")
        badDir = badDir[badDir.length - 1]
        pathArray[1] = pathArray[1].replaceAll(" ", "_").toLowerCase()
        let newPath = pathArray[0] + assets + pathArray[1]

        // console.log(badDir)
        badDirs.push(badDir)
        fs.renameSync(badPath, newPath)
        fixedFiles++
    })
    for await (const p of walk(dir)) {
        if (p.includes(".properties")) {
            fs.readFile(p, 'utf8', (err, contents) => {
                let split = contents.split("model=")
                if (split != undefined) {
                    try {
                        let split1 = split[1].replaceAll(" ", "_").toLowerCase()
                        let newContents = split[0] + "model=" + split1
                        if (split1 != split[1]) {
                            fs.writeFile(p, newContents, function (err) { if (err) throw err; }); 
                            fixedFiles++
                        }
                    }
                    catch {

                    }
                    
                }
                
                
            });
            
        }
        else if (p.includes(".json")) {
            fs.readFile(p, 'utf8', (err, contents) => {
                contents = contents.toLowerCase()
                const jContents = JSON.parse(contents)
                let texture = jContents.textures
                let i = 0;
                if (texture != undefined) {
                    Object.keys(texture).forEach(function(key) { 
                        texture[key] = texture[key].replaceAll(" ", "_")
                    });
                    jContents.textures = texture
    
                    if (jContents != undefined) {
                        fs.writeFile(p, JSON.stringify( jContents, null, " "), function (err) { if (err) throw err; }); 
                        fixedFiles++
                    }
                }
                
                
            });
        }

    }
}

main(process.argv[2])