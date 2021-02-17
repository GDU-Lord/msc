#define PI 3.141592653589793

precision mediump float;

uniform sampler2D tex;

varying vec4 vColor;
varying vec2 vUV;

void main (void) {

    // vec2 uv = vec2(ivec2(vUV*5.0))/5.0;
    

    vec4 c = vColor;
    vec4 w = vec4(1, 1, 1, 1);

    float r5 = 0.4;
    float r4 = 0.35;
    float r3 = 0.3;
    float r2 = 0.25;
    float r1 = 0.2;

    vec2 uv = (vUV-0.5);
    vec2 uv2 = (uv+vec2(0.14, 0))/1.2;
    float m = uv.y/abs(uv.y);
    uv.y -= m*(uv.x-0.05);
    uv.x /= 100.0;

    float l1 = length(uv);
    float l2 = length(uv2);
    float a = atan(uv2.x, uv2.y)/PI*180.0-45.0;

    if(uv.x > 0.0 && a >= 0.0 && a <= 90.0) {
        if(l2 < r5 && l2 > r4)
            c = w;
        else if(l2 < r3 && l2 > r2)
            c = w;
        else if(l2 < r1)
            c = w;
    }
    else if(uv.x < 0.0) {
        if(l1 < r5)
            c = w;
    }

    gl_FragColor = c;

    gl_FragColor.rgb *= gl_FragColor.a;

}