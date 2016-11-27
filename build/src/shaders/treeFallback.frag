// treeFallback.frag
// trees.frag

precision highp float;
uniform sampler2D texture;

uniform sampler2D textureTree;
uniform sampler2D textureNoise;
uniform sampler2D textureEnv;

uniform float		uExposure;
uniform float		uGamma;
uniform float 		uClipY;
uniform float 		uDir;
uniform float 		uFogDensity;
uniform vec3 		uFogColor;

{{UNIFORMS}}

varying vec3        vNormal;
varying vec3        vPosition;
varying vec3		vEyePosition;
varying vec3		vWsNormal;
varying vec3		vWsPosition;
varying vec2 		vTextureCoord;



#define saturate(x) clamp(x, 0.0, 1.0)
#define PI 3.1415926535897932384626433832795

const float TwoPI = PI * 2.0;
const vec3 LIGHT = vec3(1.0, .5, 1.0);

// Filmic tonemapping from
// http://filmicgames.com/archives/75

const float A = 0.15;
const float B = 0.50;
const float C = 0.10;
const float D = 0.20;
const float E = 0.02;
const float F = 0.30;

vec3 Uncharted2Tonemap( vec3 x )
{
	return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}

float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}

vec2 envMapEquirect(vec3 wcNormal, float flipEnvMap) {
  //I assume envMap texture has been flipped the WebGL way (pixel 0,0 is a the bottom)
  //therefore we flip wcNorma.y as acos(1) = 0
  float phi = acos(-wcNormal.y);
  float theta = atan(flipEnvMap * wcNormal.x, wcNormal.z) + PI;
  return vec2(theta / TwoPI, phi / PI);
}

vec2 envMapEquirect(vec3 wcNormal) {
    //-1.0 for left handed coordinate system oriented texture (usual case)
    return envMapEquirect(wcNormal, -1.0);
}

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}

vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

void main(void) {
	if(vWsPosition.y * uDir > uClipY * uDir) {
		discard;
	}	

	vec2 uv  			= vTextureCoord * vec2(1.0, 20.0);

    vec3 N 				= vNormal;
	vec3 noise 			= texture2D( textureNoise, uv * 30.0).rgb * 2.0 - 1.0;
	vec3 colorTree 	    = texture2D( textureTree, uv).rgb;
	N 					= normalize( N + noise * 0.2);
	
	vec3 color 			= colorTree;
	float _diffuse 		= diffuse(N, LIGHT);
	color 				*= mix(_diffuse, 1.0, .5);

	vec2 uvEnv 			= envMapEquirect(N);
	vec3 colorEnv 		= texture2D(textureEnv, uvEnv).rgb;
	color 				*= mix(colorEnv, vec3(1.0), .25);

	// apply the tone-mapping
	color				= Uncharted2Tonemap( color * uExposure );
	// white balance
	color				= color * ( 1.0 / Uncharted2Tonemap( vec3( 20.0 ) ) );
	
	// gamma correction
	color				= pow( color, vec3( 1.0 / uGamma ) );

	float fogDistance 	= length(vPosition);
	float fogAmount 	= fogFactorExp2(fogDistance, uFogDensity);
	color 				= mix(color, uFogColor, fogAmount);

    gl_FragColor 		= vec4(color, 1.0);
}