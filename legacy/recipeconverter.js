var fs = require('fs');
const path = require('path');

const dir = `/home/deck/Documents/GitHub/Cultural-Delights-Refabricated/src/main/resources/data/culturalrecipes/recipe/`


fs.readdir(dir, (err, files) => {
    if (err) throw err;
    //Loop through files
    files.forEach(file => {
        const filePath = path.join(dir, file);
            //Read file
            fs.readFile(filePath, 'utf8', (err, contents) => {
                try {
                    const jContents = JSON.parse(contents)
                    if (jContents.type == 'minecraft:stonecutting') {
                        //Find if the recipe is 1.20.5+ compatible.
                        if (jContents.result.id == undefined) {
                            //Convert recipe to 1.20.5+
                            jContents.result = {
                                id: jContents.result,
                                count: jContents.count
                            }
                            delete jContents.count
                            //Write file.
                            fs.writeFile(filePath, JSON.stringify(jContents), function (err) { if (err) throw err; });

                        }
                    }
                    else if (jContents.type == "minecraft:crafting_shaped" || jContents.type == "minecraft:crafting_shapeless") {
                        if (jContents.result.id == undefined) {
                            //Convert recipe to 1.20.5+
                            console.log(jContents.result)
                            if (jContents.result.item == undefined) {
                                let count = jContents.count;
                                if (count == undefined) {
                                    count = 1
                                }
                                jContents.result = {
                                    id: jContents.result,
                                    count: count
                                }
                            }
                            else {
                                let count = jContents.count;
                                if (count == undefined) {
                                    count = 1
                                }
                                jContents.result = {
                                    id: jContents.result.item,
                                    count: count
                                }
                            }                            
                            //Write file.
                            fs.writeFile(filePath, JSON.stringify(jContents, undefined, 2), function (err) { if (err) throw err; });

                        }
                    }

                }
                catch {
                    console.log(file)                
                }
    
              });
      });
  });