// test.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uPosition;

uniform sampler2D textureHeight;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
	float r = texture2D(textureHeight, aTextureCoord).r;
	vec3 position = aVertexPosition + uPosition + vec3(0, r, 0);
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}