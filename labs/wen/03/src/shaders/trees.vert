// trees.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWsPosition;
varying vec3 vEyePosition;
varying vec3 vWsNormal;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}


vec3 rotate(vec3 v) {
	v.xy = rotate(v.xy, aExtra.x);
	v.xz = rotate(v.xz, aExtra.y);

	return v;
}

void main(void) {
	vec3 position           = aVertexPosition;
	position.xz             *= aExtra.z;
	position                = rotate(position);
	position                += aPosOffset;
	
	vec4 worldSpacePosition = uModelMatrix * vec4(position, 1.0);
	vec4 viewSpacePosition  = uViewMatrix * worldSpacePosition;
	
	vPosition               = viewSpacePosition.xyz;
	vWsPosition             = worldSpacePosition.xyz;
	
	vec4 eyeDirViewSpace    = viewSpacePosition - vec4( 0, 0, 0, 1 );
	vEyePosition            = -vec3( uModelViewMatrixInverse * eyeDirViewSpace.xyz );
	
	vec3 N                  = aNormal * 0.0001;
	N                       += normalize(vec3(aVertexPosition.x, 0.0, aVertexPosition.z));
	vNormal                 = rotate(N);
	
	vWsNormal               = normalize( uModelViewMatrixInverse * vNormal );
	
	gl_Position             = uProjectionMatrix * viewSpacePosition;
	
	vTextureCoord           = aTextureCoord;
}