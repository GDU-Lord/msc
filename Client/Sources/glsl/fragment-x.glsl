#define PI 3.141592653589793
#define D 0.15

precision mediump float;

uniform sampler2D tex;

varying vec4 vColor;
varying vec2 vUV;

vec4 rand(vec2 n) { 
	return vec4(vec3(fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453)/7.0+1.0), 1);
}

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

    

    gl_FragColor = c*rand(vUV);//vec4(uv, 0, 1);

    gl_FragColor.rgb *= gl_FragColor.a;

}