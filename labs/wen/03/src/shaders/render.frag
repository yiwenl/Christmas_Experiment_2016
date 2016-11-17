precision highp float;

varying vec4 vColor;
varying vec3 vPosition;
varying vec3 vExtra;

uniform float uClipY;
uniform float uDir;
uniform float time;

#define center vec2(.5)

void main(void) {
	if(vPosition.y * uDir > uClipY * uDir) {
		discard;
	}

	float dist = distance(gl_PointCoord, vec2(.5));

	if(dist > .5) discard;

	float a = pow(1.0 - dist/.5, 2.0 * ( 1.0 + vExtra.r) + sin(time * 0.2 * vExtra.g) * 0.5);
	// a = 1.0;

    gl_FragColor = vColor;
    gl_FragColor *= a;
}