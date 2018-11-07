// Shader: 水
const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

var shader = {
    name: "Water",
    
    params: [
        {name: 'iResolution', type: renderer.PARAM_FLOAT3},
        {name: 'iTime', type: renderer.PARAM_FLOAT},
    ],
    defines: [],

    start(sprite, material) {
        var iResolution = new cc.Vec3(sprite.node.width, sprite.node.height, 0);
        material.setParamValue('iResolution', iResolution);
        this._start = Date.now();
    },

    update(sprite, material) {
        const now = Date.now();
        const time = (now - this._start) / 500;
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
    varying vec2 uv0;

    #define F cos(x-y)*cos(y),sin(x+y)*sin(y)

    vec2 s(vec2 p)
    {
        float d=iTime*0.2,x=8.*(p.x+d),y=8.*(p.y+d);
        return vec2(F);
    }
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // 换成resolution
        vec2 rs = iResolution.xy;
        // 换成纹理坐标v_texCoord.xy
        vec2 uv = fragCoord;
        vec2 q = uv+2./iResolution.x*(s(uv)-s(uv+rs));
        //反转y
        //q.y=1.-q.y;
        fragColor = texture2D(texture, q);
    }
    void main()
    {
        mainImage(gl_FragColor, uv0.xy);
    }`,
}

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);