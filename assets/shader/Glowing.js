// Shader: 外发光
const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

var shader = {
    name: "Glowing",

    params: [
        {name: 'iResolution', type: renderer.PARAM_FLOAT3},
    ],

    defines: [],

    start(sprite, material) {
        sprite.node.color = cc.color('#1A7ADC');
        var iResolution = new cc.Vec3(sprite.node.width, sprite.node.height, 0);
        material.setParamValue("iResolution", iResolution);
        this._start = Date.now();
    },

    update(sprite, material) {
        const now = Date.now();
        const time = (now - this._start) / 1000;
        material.setParamValue('iTime', time);
    },

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
    uniform vec3 iResolution;
    uniform float iTime;
    uniform vec4 color;
    varying vec2 uv0;

    const float radius = 4.0;

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = fragCoord.xy;
        vec2 unit = 1.0 / iResolution.xy;
        vec4 texel = texture2D(texture, uv);
        vec4 finalColor = vec4(0.0);
        float density = 0.0;

        if(texel.a >= 1.0)
        {
            finalColor = texel;
        }
        else
        {
            for(int i = 0; i < int(radius); ++i)
            {
                density += texture2D(texture, vec2(uv.x + unit.x * float(i), uv.y + unit.y * float(i))).a;
                density += texture2D(texture, vec2(uv.x - unit.x * float(i), uv.y + unit.y * float(i))).a;
                density += texture2D(texture, vec2(uv.x - unit.x * float(i), uv.y - unit.y * float(i))).a;
                density += texture2D(texture, vec2(uv.x + unit.x * float(i), uv.y - unit.y * float(i))).a;
            }
            density = density / radius;
            finalColor = vec4(color.rgb * density, density);
            finalColor += vec4(texel.rgb * texel.a, texel.a);
        }
        fragColor = finalColor;
    }

    void main()
    {
        mainImage(gl_FragColor, uv0.xy);
    }`,
}

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);