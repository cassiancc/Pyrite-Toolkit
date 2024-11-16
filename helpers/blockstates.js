const helpers = require('./helpers');

module.exports = {

    generateBarBlockState: function generateBarBlockState(block, namespace, baseBlock) {
        return `{"multipart":[{"apply":{"model":"${namespace}:block/${block}_post_ends"}},{"when":{"north":"false","west":"false","south":"false","east":"false"},"apply":{"model":"${namespace}:block/${block}_post"}},{"when":{"north":"true","west":"false","south":"false","east":"false"},"apply":{"model":"${namespace}:block/${block}_cap"}},{"when":{"north":"false","west":"false","south":"false","east":"true"},"apply":{"model":"${namespace}:block/${block}_cap","y":90}},{"when":{"north":"false","west":"false","south":"true","east":"false"},"apply":{"model":"${namespace}:block/${block}_cap_alt"}},{"when":{"north":"false","west":"true","south":"false","east":"false"},"apply":{"model":"${namespace}:block/${block}_cap_alt","y":90}},{"when":{"north":"true"},"apply":{"model":"${namespace}:block/${block}_side"}},{"when":{"east":"true"},"apply":{"model":"${namespace}:block/${block}_side","y":90}},{"when":{"south":"true"},"apply":{"model":"${namespace}:block/${block}_side_alt"}},{"when":{"west":"true"},"apply":{"model":"${namespace}:block/${block}_side_alt","y":90}}]}`
    },


    generatePaneBlockState: function generatePaneBlockState(block, namespace, baseBlock) {
        return `{"multipart":[{"apply":{"model":"${namespace}:block/${block}_post"}},{"when":{"north":"true"},"apply":{"model":"${namespace}:block/${block}_side"}},{"when":{"east":"true"},"apply":{"model":"${namespace}:block/${block}_side","y":90}},{"when":{"south":"true"},"apply":{"model":"${namespace}:block/${block}_side_alt"}},{"when":{"west":"true"},"apply":{"model":"${namespace}:block/${block}_side_alt","y":90}},{"when":{"north":"false"},"apply":{"model":"${namespace}:block/${block}_noside"}},{"when":{"east":"false"},"apply":{"model":"${namespace}:block/${block}_noside_alt"}},{"when":{"south":"false"},"apply":{"model":"${namespace}:block/${block}_noside_alt","y":90}},{"when":{"west":"false"},"apply":{"model":"${namespace}:block/${block}_noside","y":270}}]}`
    },

    generateDoorBlockState: function generateDoorBlockState(block, namespace, baseBlock) {
        return `{
                "variants": {
                    "facing=east,half=lower,hinge=left,open=false": {
                        "model": "${namespace}:block/${block}_bottom_left"
                    },
                    "facing=east,half=lower,hinge=left,open=true": {
                        "model": "${namespace}:block/${block}_bottom_left_open",
                        "y": 90
                    },
                    "facing=east,half=lower,hinge=right,open=false": {
                        "model": "${namespace}:block/${block}_bottom_right"
                    },
                    "facing=east,half=lower,hinge=right,open=true": {
                        "model": "${namespace}:block/${block}_bottom_right_open",
                        "y": 270
                    },
                    "facing=east,half=upper,hinge=left,open=false": {
                        "model": "${namespace}:block/${block}_top_left"
                    },
                    "facing=east,half=upper,hinge=left,open=true": {
                        "model": "${namespace}:block/${block}_top_left_open",
                        "y": 90
                    },
                    "facing=east,half=upper,hinge=right,open=false": {
                        "model": "${namespace}:block/${block}_top_right"
                    },
                    "facing=east,half=upper,hinge=right,open=true": {
                        "model": "${namespace}:block/${block}_top_right_open",
                        "y": 270
                    },
                    "facing=north,half=lower,hinge=left,open=false": {
                        "model": "${namespace}:block/${block}_bottom_left",
                        "y": 270
                    },
                    "facing=north,half=lower,hinge=left,open=true": {
                        "model": "${namespace}:block/${block}_bottom_left_open"
                    },
                    "facing=north,half=lower,hinge=right,open=false": {
                        "model": "${namespace}:block/${block}_bottom_right",
                        "y": 270
                    },
                    "facing=north,half=lower,hinge=right,open=true": {
                        "model": "${namespace}:block/${block}_bottom_right_open",
                        "y": 180
                    },
                    "facing=north,half=upper,hinge=left,open=false": {
                        "model": "${namespace}:block/${block}_top_left",
                        "y": 270
                    },
                    "facing=north,half=upper,hinge=left,open=true": {
                        "model": "${namespace}:block/${block}_top_left_open"
                    },
                    "facing=north,half=upper,hinge=right,open=false": {
                        "model": "${namespace}:block/${block}_top_right",
                        "y": 270
                    },
                    "facing=north,half=upper,hinge=right,open=true": {
                        "model": "${namespace}:block/${block}_top_right_open",
                        "y": 180
                    },
                    "facing=south,half=lower,hinge=left,open=false": {
                        "model": "${namespace}:block/${block}_bottom_left",
                        "y": 90
                    },
                    "facing=south,half=lower,hinge=left,open=true": {
                        "model": "${namespace}:block/${block}_bottom_left_open",
                        "y": 180
                    },
                    "facing=south,half=lower,hinge=right,open=false": {
                        "model": "${namespace}:block/${block}_bottom_right",
                        "y": 90
                    },
                    "facing=south,half=lower,hinge=right,open=true": {
                        "model": "${namespace}:block/${block}_bottom_right_open"
                    },
                    "facing=south,half=upper,hinge=left,open=false": {
                        "model": "${namespace}:block/${block}_top_left",
                        "y": 90
                    },
                    "facing=south,half=upper,hinge=left,open=true": {
                        "model": "${namespace}:block/${block}_top_left_open",
                        "y": 180
                    },
                    "facing=south,half=upper,hinge=right,open=false": {
                        "model": "${namespace}:block/${block}_top_right",
                        "y": 90
                    },
                    "facing=south,half=upper,hinge=right,open=true": {
                        "model": "${namespace}:block/${block}_top_right_open"
                    },
                    "facing=west,half=lower,hinge=left,open=false": {
                        "model": "${namespace}:block/${block}_bottom_left",
                        "y": 180
                    },
                    "facing=west,half=lower,hinge=left,open=true": {
                        "model": "${namespace}:block/${block}_bottom_left_open",
                        "y": 270
                    },
                    "facing=west,half=lower,hinge=right,open=false": {
                        "model": "${namespace}:block/${block}_bottom_right",
                        "y": 180
                    },
                    "facing=west,half=lower,hinge=right,open=true": {
                        "model": "${namespace}:block/${block}_bottom_right_open",
                        "y": 90
                    },
                    "facing=west,half=upper,hinge=left,open=false": {
                        "model": "${namespace}:block/${block}_top_left",
                        "y": 180
                    },
                    "facing=west,half=upper,hinge=left,open=true": {
                        "model": "${namespace}:block/${block}_top_left_open",
                        "y": 270
                    },
                    "facing=west,half=upper,hinge=right,open=false": {
                        "model": "${namespace}:block/${block}_top_right",
                        "y": 180
                    },
                    "facing=west,half=upper,hinge=right,open=true": {
                        "model": "${namespace}:block/${block}_top_right_open",
                        "y": 90
                    }
                }
            }`
    },
    generateFenceBlockState: function generateFenceBlockState(block, namespace, baseBlock) {
        return `{"multipart":[{"apply":{"model":"${namespace}:block/${block}_post"}},{"apply":{"model":"${namespace}:block/${block}_side","uvlock":true},"when":{"north":"true"}},{"apply":{"model":"${namespace}:block/${block}_side","uvlock":true,"y":90},"when":{"east":"true"}},{"apply":{"model":"${namespace}:block/${block}_side","uvlock":true,"y":180},"when":{"south":"true"}},{"apply":{"model":"${namespace}:block/${block}_side","uvlock":true,"y":270},"when":{"west":"true"}}]}`
    },
    
    generateButtonBlockState: function generateButtonBlockState(block, namespace, baseBlock) {
        return `{"variants":{"face=ceiling,facing=east,powered=false":{"model":"${namespace}:block/${block}","x":180,"y":270},"face=ceiling,facing=east,powered=true":{"model":"${namespace}:block/${block}_pressed","x":180,"y":270},"face=ceiling,facing=north,powered=false":{"model":"${namespace}:block/${block}","x":180,"y":180},"face=ceiling,facing=north,powered=true":{"model":"${namespace}:block/${block}_pressed","x":180,"y":180},"face=ceiling,facing=south,powered=false":{"model":"${namespace}:block/${block}","x":180},"face=ceiling,facing=south,powered=true":{"model":"${namespace}:block/${block}_pressed","x":180},"face=ceiling,facing=west,powered=false":{"model":"${namespace}:block/${block}","x":180,"y":90},"face=ceiling,facing=west,powered=true":{"model":"${namespace}:block/${block}_pressed","x":180,"y":90},"face=floor,facing=east,powered=false":{"model":"${namespace}:block/${block}","y":90},"face=floor,facing=east,powered=true":{"model":"${namespace}:block/${block}_pressed","y":90},"face=floor,facing=north,powered=false":{"model":"${namespace}:block/${block}"},"face=floor,facing=north,powered=true":{"model":"${namespace}:block/${block}_pressed"},"face=floor,facing=south,powered=false":{"model":"${namespace}:block/${block}","y":180},"face=floor,facing=south,powered=true":{"model":"${namespace}:block/${block}_pressed","y":180},"face=floor,facing=west,powered=false":{"model":"${namespace}:block/${block}","y":270},"face=floor,facing=west,powered=true":{"model":"${namespace}:block/${block}_pressed","y":270},"face=wall,facing=east,powered=false":{"model":"${namespace}:block/${block}","uvlock":true,"x":90,"y":90},"face=wall,facing=east,powered=true":{"model":"${namespace}:block/${block}_pressed","uvlock":true,"x":90,"y":90},"face=wall,facing=north,powered=false":{"model":"${namespace}:block/${block}","uvlock":true,"x":90},"face=wall,facing=north,powered=true":{"model":"${namespace}:block/${block}_pressed","uvlock":true,"x":90},"face=wall,facing=south,powered=false":{"model":"${namespace}:block/${block}","uvlock":true,"x":90,"y":180},"face=wall,facing=south,powered=true":{"model":"${namespace}:block/${block}_pressed","uvlock":true,"x":90,"y":180},"face=wall,facing=west,powered=false":{"model":"${namespace}:block/${block}","uvlock":true,"x":90,"y":270},"face=wall,facing=west,powered=true":{"model":"${namespace}:block/${block}_pressed","uvlock":true,"x":90,"y":270}}}`
    },
    
    generateFenceGateBlockState: function generateFenceGateBlockState(block, namespace) {
        return `{"variants":{"facing=east,in_wall=false,open=false":{"model":"${namespace}:block/${block}","uvlock":true,"y":270},"facing=east,in_wall=false,open=true":{"model":"${namespace}:block/${block}_open","uvlock":true,"y":270},"facing=east,in_wall=true,open=false":{"model":"${namespace}:block/${block}_wall","uvlock":true,"y":270},"facing=east,in_wall=true,open=true":{"model":"${namespace}:block/${block}_wall_open","uvlock":true,"y":270},"facing=north,in_wall=false,open=false":{"model":"${namespace}:block/${block}","uvlock":true,"y":180},"facing=north,in_wall=false,open=true":{"model":"${namespace}:block/${block}_open","uvlock":true,"y":180},"facing=north,in_wall=true,open=false":{"model":"${namespace}:block/${block}_wall","uvlock":true,"y":180},"facing=north,in_wall=true,open=true":{"model":"${namespace}:block/${block}_wall_open","uvlock":true,"y":180},"facing=south,in_wall=false,open=false":{"model":"${namespace}:block/${block}","uvlock":true},"facing=south,in_wall=false,open=true":{"model":"${namespace}:block/${block}_open","uvlock":true},"facing=south,in_wall=true,open=false":{"model":"${namespace}:block/${block}_wall","uvlock":true},"facing=south,in_wall=true,open=true":{"model":"${namespace}:block/${block}_wall_open","uvlock":true},"facing=west,in_wall=false,open=false":{"model":"${namespace}:block/${block}","uvlock":true,"y":90},"facing=west,in_wall=false,open=true":{"model":"${namespace}:block/${block}_open","uvlock":true,"y":90},"facing=west,in_wall=true,open=false":{"model":"${namespace}:block/${block}_wall","uvlock":true,"y":90},"facing=west,in_wall=true,open=true":{"model":"${namespace}:block/${block}_wall_open","uvlock":true,"y":90}}}`
    },

    generateOrientableBlockState: function generateOrientableBlockState(block) {
        const namespace = helpers.getNamespace(block)
        const path = helpers.getPath(block)
        return {
            "variants": {
              "facing=east": [
                {
                  "model": `${namespace}:block/${path}`,
                  "y": 90
                }
              ],
              "facing=north": [
                {
                    "model": `${namespace}:block/${path}`
                }
              ],
              "facing=south": [
                {
                    "model": `${namespace}:block/${path}`,
                    "y": 180
                }
              ],
              "facing=west": [
                {
                    "model": `${namespace}:block/${path}`,
                    "y": 270
                }
              ]
            }
          }
    },
    generateBasicBlockstate: function generateBasicBlockstate(block, namespace) {
       return {
                "variants": {
                    "": {
                        "model": `${namespace}:block/${block}`
                    }
                }
            }
    },
    generateCarpetBlockState: function generateCarpetBlockState(block, namespace, baseBlock) {
        return `{"variants": {"": {"model": "${namespace}:block/${block}"}}}`
    },

    generateTrapdoorBlockState: function generateTrapdoorBlockState(block, namespace, baseBlock) {
	    return `{"variants":{"facing=east,half=bottom,open=false":{"model":"${namespace}:block/${block}_bottom","y":90},"facing=east,half=bottom,open=true":{"model":"${namespace}:block/${block}_open","y":90},"facing=east,half=top,open=false":{"model":"${namespace}:block/${block}_top","y":90},"facing=east,half=top,open=true":{"model":"${namespace}:block/${block}_open","x":180,"y":270},"facing=north,half=bottom,open=false":{"model":"${namespace}:block/${block}_bottom"},"facing=north,half=bottom,open=true":{"model":"${namespace}:block/${block}_open"},"facing=north,half=top,open=false":{"model":"${namespace}:block/${block}_top"},"facing=north,half=top,open=true":{"model":"${namespace}:block/${block}_open","x":180,"y":180},"facing=south,half=bottom,open=false":{"model":"${namespace}:block/${block}_bottom","y":180},"facing=south,half=bottom,open=true":{"model":"${namespace}:block/${block}_open","y":180},"facing=south,half=top,open=false":{"model":"${namespace}:block/${block}_top","y":180},"facing=south,half=top,open=true":{"model":"${namespace}:block/${block}_open","x":180,"y":0},"facing=west,half=bottom,open=false":{"model":"${namespace}:block/${block}_bottom","y":270},"facing=west,half=bottom,open=true":{"model":"${namespace}:block/${block}_open","y":270},"facing=west,half=top,open=false":{"model":"${namespace}:block/${block}_top","y":270},"facing=west,half=top,open=true":{"model":"${namespace}:block/${block}_open","x":180,"y":90}}}`
    }
}


function generateOldDoorBlockState(block, namespace, baseBlock) {
	return `{"variants":{"facing=east,half=lower,hinge=left,open=false":{"model":"${namespace}:block/${block}_bottom"},"facing=east,half=lower,hinge=left,open=true":{"model":"${namespace}:block/${block}_bottom_hinge","y":90},"facing=east,half=lower,hinge=right,open=false":{"model":"${namespace}:block/${block}_bottom_hinge"},"facing=east,half=lower,hinge=right,open=true":{"model":"${namespace}:block/${block}_bottom","y":270},"facing=east,half=upper,hinge=left,open=false":{"model":"${namespace}:block/${block}_top"},"facing=east,half=upper,hinge=left,open=true":{"model":"${namespace}:block/${block}_top_hinge","y":90},"facing=east,half=upper,hinge=right,open=false":{"model":"${namespace}:block/${block}_top_hinge"},"facing=east,half=upper,hinge=right,open=true":{"model":"${namespace}:block/${block}_top","y":270},"facing=north,half=lower,hinge=left,open=false":{"model":"${namespace}:block/${block}_bottom","y":270},"facing=north,half=lower,hinge=left,open=true":{"model":"${namespace}:block/${block}_bottom_hinge"},"facing=north,half=lower,hinge=right,open=false":{"model":"${namespace}:block/${block}_bottom_hinge","y":270},"facing=north,half=lower,hinge=right,open=true":{"model":"${namespace}:block/${block}_bottom","y":180},"facing=north,half=upper,hinge=left,open=false":{"model":"${namespace}:block/${block}_top","y":270},"facing=north,half=upper,hinge=left,open=true":{"model":"${namespace}:block/${block}_top_hinge"},"facing=north,half=upper,hinge=right,open=false":{"model":"${namespace}:block/${block}_top_hinge","y":270},"facing=north,half=upper,hinge=right,open=true":{"model":"${namespace}:block/${block}_top","y":180},"facing=south,half=lower,hinge=left,open=false":{"model":"${namespace}:block/${block}_bottom","y":90},"facing=south,half=lower,hinge=left,open=true":{"model":"${namespace}:block/${block}_bottom_hinge","y":180},"facing=south,half=lower,hinge=right,open=false":{"model":"${namespace}:block/${block}_bottom_hinge","y":90},"facing=south,half=lower,hinge=right,open=true":{"model":"${namespace}:block/${block}_bottom"},"facing=south,half=upper,hinge=left,open=false":{"model":"${namespace}:block/${block}_top","y":90},"facing=south,half=upper,hinge=left,open=true":{"model":"${namespace}:block/${block}_top_hinge","y":180},"facing=south,half=upper,hinge=right,open=false":{"model":"${namespace}:block/${block}_top_hinge","y":90},"facing=south,half=upper,hinge=right,open=true":{"model":"${namespace}:block/${block}_top"},"facing=west,half=lower,hinge=left,open=false":{"model":"${namespace}:block/${block}_bottom","y":180},"facing=west,half=lower,hinge=left,open=true":{"model":"${namespace}:block/${block}_bottom_hinge","y":270},"facing=west,half=lower,hinge=right,open=false":{"model":"${namespace}:block/${block}_bottom_hinge","y":180},"facing=west,half=lower,hinge=right,open=true":{"model":"${namespace}:block/${block}_bottom","y":90},"facing=west,half=upper,hinge=left,open=false":{"model":"${namespace}:block/${block}_top","y":180},"facing=west,half=upper,hinge=left,open=true":{"model":"${namespace}:block/${block}_top_hinge","y":270},"facing=west,half=upper,hinge=right,open=false":{"model":"${namespace}:block/${block}_top_hinge","y":180},"facing=west,half=upper,hinge=right,open=true":{"model":"${namespace}:block/${block}_top","y":90}}}`
}