const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

const shader = {

    name: 'WindowTransfer',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    time: 2,
    update(sprite, material) {


        if (this.time < 4) {

            this.time += 0.02;
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


    void main()
    {

        float dur = 2.;
        float dim = 7.;
        vec2 v = uv0;
        v.y=1.-v.y;
        vec2 x = mod(1.-v.xx, 1./dim)+floor(v*dim)/dim;
        float a = .5*(abs(x.x)+abs(x.y));
        float b = fract(time/dur);
        a=a>b?0.:1.;
        bool mt = mod(floor(time/dur),2.)==0.;
        float cd = a;
        if (mt)
        {
            cd=1.-cd;    
        }
        vec4 colore = vec4(0.5,0.2,0.3, 0.01);
        gl_FragColor = mix(vec4(a),(mix(texture2D(texture, uv0), colore, cd)), 1.);

    }`,
};

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);