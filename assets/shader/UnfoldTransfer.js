const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

const shader = {
    name: 'UnfoldTransfer',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    time: 0,
    flag: 1,
    update(sprite, material) {
        if (this.flag == 1) {

            this.time += 0.01;
            cc.log(this.time)
            if (this.time >= 1.0) {
                //this.time = 0;
                this.flag = 0;
                this.time = 0.9999;
            }
            material.setParamValue('time', this.time);

        }

    },

    defines: [],

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
            vec4 result = vec4(1.0,1.0,1.0,1.0);
            vec2 translate = vec2(uv0.x,uv0.y);
            result = texture2D(texture, uv0);
            
            // Calculate modulo to decide even and odd row
            float div = 2.0;
            float num = floor(uv0.y * 10.0);
            float odd = num - (div * floor(num/div));
            
            float t = mod(time,1.0);
            
            //Only do the odd number
            if( odd == 0.0){
                translate.x = translate.x - t;        
                result = texture2D(texture,translate);
                if(translate.x < 0.0){
                    result.w = 0.0;
                }
            }
            else{
                translate.x = translate.x + t;        
                result = texture2D(texture,translate);
                if(translate.x > 1.0){
                    result.w = 0.0;
                }
            }
            
            // Output to screen
            gl_FragColor = result;
        }`,
};

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);