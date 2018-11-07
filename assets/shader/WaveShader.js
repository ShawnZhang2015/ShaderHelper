/**
 * 波浪流动效果
 * */

const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

const shader = {
    name: "wave",
    params: [
        {name: 'iTime', type: renderer.PARAM_FLOAT},
        {name: 'iOffset', type: renderer.PARAM_FLOAT2}
    ],
    
    defines: [],

    start(sprite, material) {
        material.setParamValue('iOffset', new cc.Vec2(0.2, 0.2));
        this._start = Date.now();
    },

    update(sprite, material) {
        const now = Date.now();
        const time = (now - this._start) / 1000;
        material.setParamValue('iTime', time);
    },

    vert: `uniform mat4 viewProj;
        attribute vec4 a_position;
        attribute vec2 a_uv0;
        varying vec2 uv0;

        void main()
        {
            gl_Position = viewProj * a_position;
            uv0 = a_uv0;
        }
        `,

    frag: `
        uniform sampler2D texture;
        uniform vec3 iResolution;
        uniform float iTime;
        uniform vec2 iOffset;
        varying vec2 uv0;
        
        void main() {
            vec2 coord = uv0;
            coord.x += (sin(coord.y * 30.0 + iTime * 3.0) / 30.0 * iOffset[0]);
            coord.y += (sin(coord.x * 30.0 + iTime * 3.0) / 30.0 * iOffset[1]);
            gl_FragColor = texture2D(texture, coord);
        }`
};

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);