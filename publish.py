import os, glob, re, requests

# Variables
modVersion = "0.13"
# pyrite-forge-1.20.1-0.13.jar

fabric = "/fabric/build/libs"
forge = "/forge/build/libs"
neoforge = "/neoforge/build/libs"
common = "/common/build/libs"


class version:
    def __init__(self, path, versionNumber, forgeProvider):
        self.path = base+path
        self.fabricPath = base + path + fabric
        self.forgePath = base + path + forge
        self.commonPath = base + path + common
        self.forgePath = base + path + "/" + forgeProvider + "/build/libs"
        self.forgeProvider = forgeProvider
        self.versionNumber = versionNumber



# Base folders
base = "/home/cassian/Desktop/Minecraft/Mods/Pyrite"
wild = version("/Pyrite (1.19)", "1.19.2", "forge")
trails = version("/Pyrite (1.20)", "1.20.1", "forge")
armored = version("/Pyrite (1.20.5)", "1.20.6", "neoforge")


currentTemplate = "pyrite-[a-z]*-"+modVersion+"-[0-9.]*.jar"


commonProjects = [
   wild.commonPath,
   trails.commonPath,
   armored.commonPath
]

versions = [
    wild.path,
    trails.path,
    armored.path,
]

activeProjects = [
    wild.fabricPath,
    wild.forgePath,
    trails.fabricPath,
    trails.forgePath,
    armored.fabricPath,
    armored.forgePath
]

def clearAll():
    # clear common folders
    for project in commonProjects:
        for f in glob.glob(project + '/*'):
            os.remove(f)
    # Clear gradle of all but most recent version.
    for project in activeProjects:
        for f in glob.glob(project+'/*'):
            if (re.search(currentTemplate, f)):
                print(f)
            else:
                os.remove(f)
    
    

def buildAll():
    for project in versions:
        os.chdir(f'{project}')
        os.system(f"./gradlew build")
            
def uploadAll():
    for project in activeProjects:
        for f in glob.glob(project+'/*'):
            if (re.search(currentTemplate, f)):
               os.system(f"cp '{f}' '/home/cassian/Desktop/Minecraft/Mods/Pyrite/Builds/{modVersion}'")




def publish():
    # Clear current gradle folders.
    # clearAll()
    # # Build most recent version of active mods.
    # buildAll()
    # Clear other files.
    # print(armored.forgePath)
    uploadAll()
    
publish()
