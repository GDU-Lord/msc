precision mediump float;

uniform sampler2D tex;

varying vec4 vColor;
varying vec2 vUV;

vec4 rand(vec2 n) { 
	return vec4(vec3(fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453)/7.0+1.0), 1);
}

void main (void) {

    gl_FragColor = texture2D(tex, vUV)*vColor*rand(vUV);

    gl_FragColor.rgb *= gl_FragColor.a;

}