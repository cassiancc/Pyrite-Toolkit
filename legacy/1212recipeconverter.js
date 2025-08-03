var fs = require('fs');
const path = require('path');

const dir = `C:/Users/cassi/Documents/Minecraft/Mods/Cooks-Collection-1.21/src/main/resources/data/farmersdelight/recipe/cooking`

function loop() {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        //Loop through files
        files.forEach(file => {
            const filePath = path.join(dir, file);
            //Read file

            read24w33a(filePath)

        });
    });
}

  loop()


function read24w33a(filePath) {
    fs.readFile(filePath, 'utf8', (err, contents) => {
        try {
            const jContents = JSON.parse(contents)
            if (jContents.type == "minecraft:crafting_shapeless") {

                const values = Object.values(jContents.ingredients);
                console.log(values)
                jContents.ingredients = []

                values.forEach(function(value) {
                    if (value.item != null) {
                        jContents.ingredients.push(value.item)
                    }
                    else (
                        jContents.ingredients.push("#" + value.tag)
                    )
                })
                
                console.log(jContents)
                fs.writeFile(filePath, JSON.stringify(jContents, undefined, " "), function (err) { if (err) throw err; });


            }
            else if (jContents.type == "minecraft:crafting_shaped") {
                const keys = Object.keys(jContents.key);

                const values = Object.values(jContents.key);
                //    console.log(values[0].item)
                //    console.log(keys[0])

                //    delete jContents.key
                let i = 0
                keys.forEach(function (key) {
                    if (values[i].item != null) {
                        jContents.key[key] = values[i].item
                    }
                    else (
                        jContents.key[key] = "#" + values[i].tag

                    )
                    i++
                })
                fs.writeFile(filePath, JSON.stringify(jContents, undefined, " "), function (err) { if (err) throw err; });


            }
            else if (jContents.type == "cookscollection:baking") {
                const keys = jContents.ingredients;
                let i = 0;
                let newKeys = []
                keys.forEach(function (key) {
                    if (key.item != null) {
                        newKeys.push(key.item) 
                    } else {
                        newKeys.push("#"+key.tag) 
                    }
                })
                jContents.ingredients = newKeys
                fs.writeFile(filePath, JSON.stringify(jContents, undefined, " "), function (err) { if (err) throw err; });


            }
            else if (jContents.type == "minecraft:stonecutting") {
                jContents.ingredient = jContents.ingredient.item

                fs.writeFile(filePath, JSON.stringify(jContents, undefined, " "), function (err) { if (err) throw err; });



            }
            if (jContents.type == "minecraft:smelting" || jContents.type == "minecraft:campfire_cooking" || jContents.type == "minecraft:smoking") {
                jContents.ingredient = jContents.ingredient.item

                fs.writeFile(filePath, JSON.stringify(jContents, undefined, " "), function (err) { if (err) throw err; });



            }
        }
        catch {
            // console.log(file)                
        }

    });
}

// read24w33a(dir + "/gray_stained_planks.json")