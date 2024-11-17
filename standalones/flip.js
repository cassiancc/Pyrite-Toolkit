const { upsideDownify } = require("../helpers/language");
const { readFileAsJson, writeFile } = require("../helpers/helpers");
const {flipTranslationFile} = require("../helpers/language");
const { existsSync } = require("fs");

// console.log(upsideDownify("test"))
// console.log(flipTranslationFile("./overrides/lang/en_us.json"))

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
//   });

if (process.argv[2] != undefined) {
    if (existsSync(process.argv[2])) {
        writeFile("./en_ud.json", flipTranslationFile(readFileAsJson(process.argv[2])))
        console.log(`Upside downified ${process.argv[2].split("/").at(-1)}!`)
    }
    else {
        console.log(upsideDownify(process.argv[2]))
    }
}
else if (existsSync("./en_us.json")) {
    writeFile("./en_ud.json", flipTranslationFile(readFileAsJson("./en_us.json")))
    console.log("Upside downified en_us.json!")
}
else {
    console.log("Please pass a file path to the file you want")
}