const { upsideDownify } = require("../helpers/language");
const { readFileAsJson } = require("../helpers/helpers");
const {flipTranslationFile} = require("../helpers/language")

console.log(upsideDownify("test"))
console.log(flipTranslationFile("./overrides/lang/en_us.json"))