precision mediump float;

uniform sampler2D tex;

varying vec4 vColor;
varying vec2 vUV;

void main (void) {

    vec2 uv = vec2(ivec2(vUV*5.0))/5.0;

    vec4 c = vColor;
    vec4 w = vec4(1, 1, 1, 1);

    if(uv.x == 0.4 && uv.y == 0.2)
        c = w;
    else if(uv.x == 0.2 && uv.y == 0.4)
        c = w;
    else if(uv.x == 0.6 && uv.y == 0.4)
        c = w;
    else if(uv.x == 0.4 && uv.y == 0.6)
        c = w;
    else if(uv.x == 0.4 && uv.y == 0.4)
        c = w;

    gl_FragColor = c;

    gl_FragColor.rgb *= gl_FragColor.a;

}