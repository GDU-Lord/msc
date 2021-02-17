precision mediump float;

uniform sampler2D tex;

varying vec4 vColor;
varying vec2 vUV;

void main () {

    vec4 col = vColor;
    vec4 w = vec4(1);

    float r = 0.075;

    float a = length(vec2(0.2, 0.5)-vUV);
    float b = length(vec2(0.5, 0.5)-vUV);
    float c = length(vec2(0.8, 0.5)-vUV);

    if(a < r || b < r || c < r)
        col = w;

    gl_FragColor = col;
    
}