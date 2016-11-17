// water.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D textureReflection;

varying vec4 vClipSpace;
varying vec4 vViewSpace;

void main(void) {
	vec2 ndc = vClipSpace.xy / vClipSpace.w;
	ndc = ndc * 0.5 + 0.5;

	vec2 uvReflect = vec2(ndc.x, 1.0-ndc.y);
	vec4 colorReflection = texture2D(textureReflection, uvReflect);
	colorReflection.rgb *= 0.5;

    gl_FragColor = colorReflection;
}