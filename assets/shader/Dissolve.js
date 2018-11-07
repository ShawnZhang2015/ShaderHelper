const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
let CustomMaterial = require('CustomMaterial');

const shader = {    
    name: 'Dissolve',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    start() {
        this.time = 0;
        this.flag = 1;
    },

    update(sprite, material, dt) {
        dt /= 3;
        if (this.flag) {
            this.time += dt;    
        } else {
            this.time -= dt;  
        }
       
        if (this.time >= 1.2) {
            this.flag = 0;
        } else if (this.time <= -0.2 ) {
            this.flag = 1;
        }

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
    vec4 c = color * texture2D(texture,uv0);
    float height = c.g;
    if(height < time)
    {
        discard;
    }
    if(height < time+0.04)
    {
        // 溶解颜色，可以自定义
        c = vec4(1, 0, 0, c.a);
    }
    gl_FragColor = c;
}`,
};

CustomMaterial.addShader(shader);
module.exports = shader;