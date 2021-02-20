precision mediump float;

uniform sampler2D tex;

varying vec4 vColor;
varying vec2 vUV;

vec4 rand(vec2 n) { 
	return vec4(vec3(fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453)/7.0+1.0), 1);
}

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

    gl_FragColor = c*rand(vUV);

    gl_FragColor.rgb *= gl_FragColor.a;

}