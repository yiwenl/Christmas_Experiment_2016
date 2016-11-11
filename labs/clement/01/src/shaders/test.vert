// test.vert


precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;
uniform float time;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;


const vec3 center = vec3(.25);

void main(void) {
	vec3 relativePos = aVertexPosition - center;
	float dist = length(relativePos);
	vec3 dirPos = normalize(relativePos);

	vec3 position = center + dirPos * (dist * (sin(time) * .5 + .5));

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
    vColor = aColor;
}