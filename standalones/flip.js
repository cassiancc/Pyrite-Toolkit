const { upsideDownify } = require("../helpers/language");
const { readFileAsJson } = require("../helpers/helpers");
const langHelper = require("../helpers/language")

console.log(upsideDownify("test"))
console.log(langHelper.flipTranslationFile("./overrides/lang/en_us.json"))