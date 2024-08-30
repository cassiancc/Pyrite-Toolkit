import os, glob, re, requests

# Variables
modVersion = "0.14.2"
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
trails = version("/Pyrite (1.20.1)", "1.20.1", "forge")
armored = version("/Pyrite (1.20.5)", "1.20.6", "neoforge")
tricky = version("/Pyrite (1.21)", "1.21", "neoforge")


currentTemplate = "pyrite-[a-z]*-"+modVersion+"-[0-9.]*.jar"

activeVersions = [
    wild, trails, tricky, armored
]

activeProjects = [
    wild.fabricPath,
    wild.forgePath,
    trails.fabricPath,
    trails.forgePath,
    armored.fabricPath,
    armored.forgePath,
    tricky.fabricPath,
    tricky.forgePath
]

def clearAll():
    # clear common folders
    for project in activeVersions:
        for f in glob.glob(project.commonPath + '/*'):
            os.remove(f)
    # Clear gradle of all but most recent version.
    for project in activeProjects:
        for f in glob.glob(project+'/*'):
            if (re.search(currentTemplate, f)):
                print(f)
            else:
                os.remove(f)
    
    

def buildAll():
    for project in activeVersions:
        os.chdir(f'{project.path}')
        os.system(f"./gradlew build")
            
def uploadAll():
    for project in activeProjects:
        for f in glob.glob(project+'/*'):
            if (re.search(currentTemplate, f)):
               os.system(f"cp '{f}' '/home/cassian/Desktop/Minecraft/Mods/Pyrite/Builds/{modVersion}'")




def publish():
    # Clear current gradle folders.
    clearAll()
    # # Build most recent version of active mods.
    buildAll()
    # Clear other files.
    # print(armored.forgePath)
    uploadAll()
    
publish()
