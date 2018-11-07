/**
 * Shader: 高斯模糊
 */ 

const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

var shader = {
    name: "GaussBlurs",
    
    defines: [],
    params: [
        {name: 'bluramount', type: renderer.PARAM_FLOAT, defaultValue: 0.5},
    ],

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
    varying vec2 uv0;
    uniform float bluramount;

    vec4 draw(vec2 uv) {
        return texture2D(texture, uv).rgba; 
    }

    float grid(float var, float size) {
        return floor(var*size)/size;
    }

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void mainImage( out vec4 fragColor, in vec2 uv0 )
    {
        vec2 uv = uv0.xy;
        vec4 blurred_image = vec4(0.);
        #define repeats 5.
        for (float i = 0.; i < repeats; i++) { 
            vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i,uv.x+uv.y))+bluramount); 
            vec2 uv2 = uv+(q*bluramount);
            blurred_image += draw(uv2)/2.;
            q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i+2.,uv.x+uv.y+24.))+bluramount); 
            uv2 = uv+(q*bluramount);
            blurred_image += draw(uv2)/2.;
        }
        blurred_image /= repeats;
        fragColor = vec4(blurred_image);
    }

    void main()
    {
        mainImage(gl_FragColor, uv0.xy);
    }`,
}

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);