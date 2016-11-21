// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D textureCurr;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;
uniform float percent;
uniform float time;
uniform vec2 uViewport;
uniform float uFogDensity;
uniform vec3 uFogColor;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vExtra;

const float radius = 0.01;

float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 posCurr = texture2D(textureCurr, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	vec3 pos     = mix(posCurr, posNext, percent);
	vec3 extra   = texture2D(textureExtra, uv).rgb;
	vec4 viewSpace = uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	gl_Position  = uProjectionMatrix * viewSpace;
	

	float g 	 = sin(extra.r + time * mix(extra.b, 1.0, .5) * 0.5);
	g 			 = smoothstep(0.0, 1.0, g);
	g 			 = mix(g, 1.0, .5);
	vec3 color 	 = vec3(g);

	float fogDistance 	= length(viewSpace);
	float fogAmount 	= fogFactorExp2(fogDistance, uFogDensity);
	color 				= mix(color, uFogColor, fogAmount);

	
	vColor       = vec4(color, 1.0);

	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset * (1.0 + extra.x * 1.0);

	vNormal 	 = aNormal;
	vPosition 	 = pos;
	vExtra 		 = extra;
}