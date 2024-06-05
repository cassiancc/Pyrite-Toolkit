var fs = require('fs');
const path = require('path');

const dir = `/home/cassian/Desktop/Minecraft/Mods/Pyrite/Pyrite (1.20)/common/src/main/resources/assets/pyrite/models/block`


fs.readdir(dir, (err, files) => {
    if (err) throw err;
    //Loop through files
    files.forEach(file => {
        const filePath = path.join(dir, file);
            //Read file
            fs.readFile(filePath, 'utf8', (err, contents) => {
                if (file.search("paeonia") != -1) {
                    try {
                        const jContents = JSON.parse(contents)
                        jContents.render_type = "cutout"
                        console.log(jContents.parent)

                            //Find if the recipe is 1.20.5+ compatible.
                            //Convert recipe to 1.20.5+
                            //Write file.
                            fs.writeFile(filePath, JSON.stringify(jContents), function (err) { if (err) throw err; });
    
                    }
                    catch {
                        console.log(file)                
                    }
                }
    
              });
      });
  });