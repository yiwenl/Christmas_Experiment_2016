// eye.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uModelViewMatrixInverse;
uniform vec3 uPosition;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
	vec3 position = uModelViewMatrixInverse * aVertexPosition;
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(position + uPosition, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}
