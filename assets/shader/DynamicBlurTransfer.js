const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

const shader = {

    name: 'DynamicBlurTransfer',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    time: 0,
    update(sprite, material) {


        if (this.time < 2.25) {

            this.time += 0.01;
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
    varying vec2 uv0;
    uniform float time;

    #define SAMPLES 10
    #define SHARPNESS 4.0    
    #define SAMPLES_F float(SAMPLES)
    #define TAU  6.28318530718
    #define HASHSCALE1 443.8975

    float hash13(vec3 p3)
    {
        p3  = fract(p3 * HASHSCALE1);
        p3 += dot(p3, p3.yzx + 19.19);
        return fract((p3.x + p3.y) * p3.z);
    }

    void main()
    {
        float r = 0.05 + 0.05 * sin(time*.2*TAU+4.3);

        float d = (r * 2.0 * uv0.x) / SAMPLES_F;
        float lod = log2(max(d / SHARPNESS, 1.0));
        
        vec4 color = vec4(0.0, 0.0, 0.0, 0.0);    
        for (int i = 0; i < SAMPLES; ++i)
        {
            float fi = float(i);
            float rnd = hash13(vec3(uv0.xy, fi));
            float f = (fi + rnd) / SAMPLES_F;
            f = (f * 2.0 - 1.0) * r;
            color += texture2D(texture, uv0 + vec2(f, 0.0), lod);
        }
        color = color / SAMPLES_F;
        gl_FragColor = color;

        gl_FragColor.w = 2.25 - time;

    }`,
};

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);