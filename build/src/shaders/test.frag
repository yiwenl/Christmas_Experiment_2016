// test.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D textureHeight;

void main(void) {
	vec4 color = texture2D(textureHeight, vTextureCoord);
    gl_FragColor = color;
}