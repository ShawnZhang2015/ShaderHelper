// Shader: 纹理与颜色叠加

var shader = {
    name: "overlay",
    defines:[],
    start(sprite) {
        sprite.node.color = cc.color('#FBC00C');
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
        varying vec2 uv0;
        uniform vec4 color;
        void main() 
        { 
            vec4 texColor = texture2D(texture, uv0);  
            if (texColor.r <= 0.5)
            gl_FragColor.r = 2.0 * texColor.r * color.r;
            else
            gl_FragColor.r = 1.0 - 2.0 * (1.0 - texColor.r) * (1.0 - color.r);
            if (texColor.g <= 0.5)
            gl_FragColor.g = 2.0 * texColor.g * color.g;
            else
            gl_FragColor.g = 1.0 - 2.0 * (1.0 - texColor.g) * (1.0 - color.g);
            if (texColor.b <= 0.5)
            gl_FragColor.b = 2.0 * texColor.b * color.b;
            else
            gl_FragColor.b = 1.0 - 2.0 * (1.0 - texColor.b) * (1.0 - color.b);
            gl_FragColor.a = texColor.a * color.a;
        }`,
}

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);