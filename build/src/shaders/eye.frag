// eye.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

uniform float uOpacity;

varying vec2 vTextureCoord;
varying vec3 vNormal;

#define center vec2(.5)

void main(void) {

	float d = min(distance(center, vTextureCoord), .5) / .5;
	d = 1.0 - d;

	d = pow(d, 2.25);


    gl_FragColor = vec4(vec3(d), 1.0);
    gl_FragColor *= uOpacity;
}
