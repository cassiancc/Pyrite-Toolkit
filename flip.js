const { upsideDownify } = require("../helpers/language");
const { readFileAsJson, writeFile } = require("../helpers/helpers");
const {flipTranslationFile} = require("../helpers/language");
const fs = require("fs");
const helpers = require("../helpers/helpers");

// console.log(upsideDownify("test"))
// console.log(flipTranslationFile("./overrides/lang/en_us.json"))

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
//   });

if (process.argv[2] != undefined) {
    let dir = process.argv[2]
    if (fs.existsSync(dir)) {
        let path = dir
        if (fs.lstatSync(path).isDirectory()) {
            path += "/en_us.json"
            
        }
        else {
            dir = dir.slice(0, dir.lastIndexOf("/"))
            console.log(dir)
        }
        flipped = flipTranslationFile(path)
        writeFile(dir+"/en_ud.json", flipped, false)
        console.log(`Upside downified ${path.split("/").at(-1)}!`)
    }
    else {
        if (fs.existsSync(`${helpers.paths.assets}lang/en_us.json`)) {
            flipped = flipTranslationFile(`${helpers.paths.assets}lang/en_us.json`)
            writeFile(`${helpers.paths.assets}lang/en_ud.json`, flipped, false)
            console.log(`Upside downified ${helpers.modID}!`)
        }
        else {
            console.log(upsideDownify(dir))
        }
    }
}
else if (existsSync("./en_us.json")) {
    writeFile("./en_ud.json", flipTranslationFile(readFileAsJson("./en_us.json")))
    console.log("Upside downified en_us.json!")
}
else {
    console.log("Please pass a file path to the file you want")
}