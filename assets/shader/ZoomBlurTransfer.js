const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

const shader = {

    name: 'ZoomBlurTransfer',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    time: 10,
    update(sprite, material) {

        if (this.time < 14.0) {
            this.time = this.time + 0.05;
        }
        material.setParamValue('time', this.time);

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

    const float strength = 0.3;
    const float PI = 3.141592653589793;

    float Linear_ease(in float begin, in float change, in float duration, in float time) {
        return change * time / duration + begin;
    }

    float Exponential_easeInOut(in float begin, in float change, in float duration, in float time) {
        if (time == 0.0)
            return begin;
        else if (time == duration)
            return begin + change;
        time = time / (duration / 2.0);
        if (time < 1.0)
             return change / 2.0 * pow(2.0, 10.0 * (time - 1.0)) + begin;
        return change / 2.0 * (-pow(2.0, -10.0 * (time - 1.0)) + 2.0) + begin;
    }

    float Sinusoidal_easeInOut(in float begin, in float change, in float duration, in float time) {
        return -change / 2.0 * (cos(PI * time / duration) - 1.0) + begin;
    }

    float random(in vec3 scale, in float seed) {
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    vec4 crossFade(in vec2 uv, in float dissolve) {
        vec4 colore = vec4(0.0,0.0,0.0,0.0);
        return mix(texture2D(texture, uv), colore, dissolve);
    }

    void main()
    {
        float progress = sin(time*0.5) * 0.5 + 0.5;
        vec2 center = vec2(Linear_ease(0.5, 0.0, 1.0, progress),0.5);
        float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, progress);
    
        float strength = Sinusoidal_easeInOut(0.0, strength, 0.5, progress);
    
        vec4 colorx = vec4(0.0);
        float total = 0.0;
        vec2 toCenter = center - uv0;

        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0)*0.5;
    
        for (float t = 0.0; t <= 20.0; t++) {
            float percent = (t + offset) / 20.0;
            float weight = 1.0 * (percent - percent * percent);
            colorx += crossFade(uv0 + toCenter * percent * strength, dissolve) * weight;
            total += weight;
        }
        gl_FragColor = colorx / total;
    }`,
};

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);