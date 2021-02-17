#define PI 3.141592653589793
#define D 0.15

precision mediump float;

uniform sampler2D tex;

varying vec4 vColor;
varying vec2 vUV;

void main (void) {

    vec2 uv = vUV;//vec2(ivec2(vUV*F))/F;

    vec4 c = vColor;
    vec4 w = vec4(1, 1, 1, 1);

    float l = length(uv-0.5);

    if(l < 0.4) {
        if(abs(uv.x-uv.y) < D)
            c = w;
        else if(abs(uv.x+uv.y-1.0) < D)
            c = w;
    }

    

    gl_FragColor = c;//vec4(uv, 0, 1);

    gl_FragColor.rgb *= gl_FragColor.a;

}