// basic.vert

precision highp float;
// attribute vec3 aNormal;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uPosition;

varying vec2 vTextureCoord;

void main(void) {
    vec3 vNormal = aNormal;
    vec3 pos = aVertexPosition + uPosition;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
}
