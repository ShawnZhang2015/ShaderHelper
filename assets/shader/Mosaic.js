// Shader: 方形马赛克
const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

var shader = {
    name: "Mosaic",
    
    params: [
        {name: 'iResolution', type: renderer.PARAM_FLOAT3},
        {name: 'mosaicSize', type: renderer.PARAM_FLOAT},
    ],
    defines: [],

    start(sprite, material) {
        var iResolution = new cc.Vec3(sprite.node.width, sprite.node.height, 0);
        material.setParamValue('iResolution', iResolution);
        material.setParamValue('mosaicSize', 16);
    },

    vert: `uniform mat4 viewProj;
        attribute vec3 a_position;
        attribute vec2 a_uv0;
        varying vec2 uv0;
        void main () {
            vec4 pos = viewProj * vec4(a_position, 1);
            gl_Position = pos;
            uv0 = a_uv0;
        }
        `,

    frag: `uniform sampler2D texture;
    uniform vec3 iResolution;
    uniform float mosaicSize;
    varying vec2 uv0;
     
    void main(void)
    {
        vec4 color;
        vec2 xy = vec2(uv0.x * iResolution.x, uv0.y * iResolution.y);
        vec2 xyMosaic = vec2(floor(xy.x / mosaicSize) * mosaicSize, floor(xy.y / mosaicSize) * mosaicSize);
        vec2 xyFloor = vec2(floor(mod(xy.x, mosaicSize)), floor(mod(xy.y, mosaicSize)));
        vec2 uvMosaic = vec2(xyMosaic.x / iResolution.x, xyMosaic.y / iResolution.y);
        color = texture2D( texture, uvMosaic);
        gl_FragColor = color; 
    }`,
}

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);