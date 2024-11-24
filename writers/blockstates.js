
const helpers = require('../helpers/helpers');

function writeBlockstate(block, blockState, namespace, altNamespace) {
	if (altNamespace == undefined) {
		altNamespace = namespace;
	}
	let modelSubdirectory = "";
	if ((altNamespace != "pyrite") && (altNamespace != "minecraft")) {
		modelSubdirectory = altNamespace + "/";
	}
	block = helpers.getPath(block);
	helpers.writeFile(`${helpers.paths.blockstates}${block}.json`, blockState);
}

module.exports = {
	writeBlockstate: writeBlockstate
}