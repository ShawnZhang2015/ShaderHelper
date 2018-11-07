const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

const shader = {
    name: 'Transfer',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    time: 0,
    update(sprite, material) {
        this.time += 0.005;
        if (this.time > 1) {
            this.time = 0;
        }
        cc.log(this.time);
        material.setParamValue('time', this.time);
    },

    defines:[],

    vert: `
        uniform mat4 viewProj;
        attribute vec3 a_position;
        attribute vec2 a_uv0;
        varying vec2 uv0;
        void main () {
            vec4 pos = viewProj * vec4(a_position, 1);
            gl_Position = pos;
            uv0 = a_uv0;
        }`,

    frag:
        `
        uniform sampler2D texture;
        uniform vec4 color;
        uniform float time;
        varying vec2 uv0;
        
        void main()
        {
            vec4 c = color * texture2D(texture, uv0);
            gl_FragColor = c;
    
            float temp = uv0.x - time;
            if (temp <= 0.0) {
                float temp2 = abs(temp);
                if (temp2 <= 0.2) {
                    gl_FragColor.w = 1.0 - temp2/0.2;
                } else {
                    gl_FragColor.w = 0.0;
                }
            } else {
                gl_FragColor.w = 1.0;
            }
        }`,
};

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);