var fs = require('fs');
const path = require('path');

const dir = process.argv[2]

let badPaths = []
let badDirs = []


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

// Then, use it with a simple async for loop
async function main() {
    for await (const p of walk(dir)) {
        try {
            let pathArray = p.split("assets/")
            let badFile = pathArray[1].split("/")
            badFile = badFile[badFile.length - 1]
            pathArray[1] = pathArray[1].replaceAll(" ", "_").toLowerCase()
            let newPath = pathArray[0] + "assets/" + pathArray[1]
    
            console.log(badFile)
            badDirs.push(badFile)
            fs.renameSync(p, newPath)
        }
        catch {}
        
    }
    console.log(badPaths)
    badPaths.forEach(function (badPath) {
        let pathArray = badPath.split("assets/")
        let badDir = pathArray[1].split("/")
        badDir = badDir[badDir.length - 1]
        pathArray[1] = pathArray[1].replaceAll(" ", "_").toLowerCase()
        let newPath = pathArray[0] + "assets/" + pathArray[1]

        console.log(badDir)
        badDirs.push(badDir)
        fs.renameSync(badPath, newPath)
    })
    for await (const p of walk(dir)) {
        if (p.includes(".properties")) {
            fs.readFile(p, 'utf8', (err, contents) => {
                if (contents.search(badDirs[0]) != -1) {
                    try {
                        let newContents = contents.replaceAll(badDirs[0], badDirs[0].replaceAll(" ", "_").toLowerCase())
                        fs.writeFile(p, newContents, function (err) { if (err) throw err; });
                    }
                    catch {
                        
                    }
                    
                }
                
            });
            
        }
        if (p.includes(".json")) {
            fs.readFile(p, 'utf8', (err, contents) => {
                contents = contents.toLowerCase()
                const jContents = JSON.parse(contents)
                let texture = jContents.textures
                let i = 0;
                Object.keys(texture).forEach(function(key) { 
                    texture[key] = texture[key].replaceAll(" ", "_")
                });
                jContents.textures = texture

                fs.writeFile(p, JSON.stringify( jContents), function (err) { if (err) throw err; });
                
            });
        }
        


    }
}

main()