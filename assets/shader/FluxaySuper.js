const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
let CustomMaterial = require('CustomMaterial');

const shader = {
    name: 'FluxaySuper',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    start() {
        this._start = Date.now();
    },

    update(sprite, material) {
        const now = Date.now();
        let time = ((now - this._start) / 1000)
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
        `#define TAU 6.12
        #define MAX_ITER 5
        uniform sampler2D texture;
        uniform vec4 color;
        uniform float time;
        varying vec2 uv0;
        
        void main()
        {
            float time = time * .5+5.;
            // uv should be the 0-1 uv of texture...
            vec2 uv = uv0.xy;//fragCoord.xy / iResolution.xy;
            
            vec2 p = mod(uv*TAU, TAU)-250.0;
        
            vec2 i = vec2(p);
            float c = 1.0;
            float inten = .0045;
        
            for (int n = 0; n < MAX_ITER; n++) 
            {
                float t =  time * (1.0 - (3.5 / float(n+1)));
                i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(1.5*t + i.x));
                c += 1.0/length(vec2(p.x / (cos(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
            }
            c /= float(MAX_ITER);
            c = 1.17-pow(c, 1.4);
            vec4 tex = texture2D(texture,uv);
            vec3 colour = vec3(pow(abs(c), 20.0));
            colour = clamp(colour + vec3(0.0, 0.0, .0), 0.0, tex.a);
        
            // 混合波光
            float alpha = c*tex[3];  
            tex[0] = tex[0] + colour[0]*alpha; 
            tex[1] = tex[1] + colour[1]*alpha; 
            tex[2] = tex[2] + colour[2]*alpha; 
            gl_FragColor = color * tex;
        }`,
};

CustomMaterial.addShader(shader);