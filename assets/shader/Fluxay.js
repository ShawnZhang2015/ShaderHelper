const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
let CustomMaterial = require('CustomMaterial');

const shader = {
    name: 'Fluxay',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    start() {
        this._start = Date.now();
    },

    update(sprite, material) {
        const now = Date.now();
        let time = ((now - this._start) / 1000);
        if (time >= 1.414) {
            time = 0;
            this._start = now;
        }
        material.setParamValue('time', time);
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
        `uniform sampler2D texture;
        uniform vec4 color;
        uniform float time;
        varying vec2 uv0;
        
        void main()
        {
            vec4 src_color = color * texture2D(texture, uv0).rgba;
        
            float width = 0.03;       //流光的宽度范围 (调整该值改变流光的宽度)
            float start = tan(time/1.414);  //流光的起始x坐标
            float strength = 0.05;   //流光增亮强度   (调整该值改变流光的增亮强度)
            float offset = 0.5;      //偏移值         (调整该值改变流光的倾斜程度)
            if(uv0.x < (start - offset * uv0.y) &&  uv0.x > (start - offset * uv0.y - width))
            {
                vec3 improve = strength * vec3(255, 255, 255);
                vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
                gl_FragColor = vec4(result, src_color.a);
        
            }else{
                gl_FragColor = src_color;
            }
        }`,
};

CustomMaterial.addShader(shader);