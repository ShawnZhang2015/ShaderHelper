const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

const shader = {
    name: 'mask',
    params: [
        { name: 'u_edge', type: renderer.PARAM_FLOAT, defaultValue: 0.5 },
    ],
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
        `
        uniform sampler2D u_texture;
        uniform float u_edge;
        varying vec2 uv0;

        void main()
        { 
            float dis = 0.0;
            if (uv0.x < u_edge)
            {
                if (uv0.y < u_edge)
                {
                    dis = distance(uv0, vec2(u_edge, u_edge));
                }
                if (uv0.y > (1.0 - u_edge))
                {
                    dis = distance(uv0, vec2(u_edge, (1.0 - u_edge)));
                }
            }
            else if (uv0.x > (1.0 - u_edge))
            {
                if (uv0.y < u_edge)
                {
                    dis = distance(uv0, vec2((1.0 - u_edge), u_edge));
                }
                if (uv0.y > (1.0 - u_edge))
                {
                    dis = distance(uv0, vec2((1.0 - u_edge), (1.0 - u_edge)));
                }
            }

            if(dis > 0.001)
            {
                float gap = u_edge * 0.02;
                if(dis <= u_edge - gap)
                {
                    gl_FragColor = texture2D(u_texture, uv0);
                }
                else if(dis <= u_edge)
                {
                    float t = smoothstep(0., gap, u_edge - dis);
                    vec4 color = texture2D(u_texture, uv0).rgba;
                    color.a = color.a * t;
                    gl_FragColor = color;
                }else{
                    gl_FragColor = vec4(0., 0., 0., 0.);
                }
            }
            else
            {
                gl_FragColor = texture2D(u_texture, uv0);
            }
        }`,
};

let CustomMaterial = require('CustomMaterial');
CustomMaterial.addShader(shader);