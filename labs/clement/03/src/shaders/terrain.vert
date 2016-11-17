// terrain.vert


precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;


uniform sampler2D texture;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying float vHeight;

void main(void) {
	float height = texture2D(texture, aTextureCoord).r;
	vec3 position = aVertexPosition + vec3(0.0, height * 2.0, 0.0);
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
    vHeight = height;
}