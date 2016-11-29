// GetReflectionMatrix.js

const mInvertView = mat4.create();
let camX, camY, camZ;
let lookAtX, lookAtY, lookAtZ;

const posCam = vec3.create();
const vLookDir = vec3.create()
const posTarget = vec3.create();
const posCamRefl = vec3.create()
const posTargetRefl = vec3.create();

let distToWater;

const func1 = function(mCamera, mSeaLevel, mTarget) {
	mat4.invert(mInvertView, mCamera.viewMatrix);
	camX = mInvertView[12];
	camY = mInvertView[13];
	camZ = mInvertView[14];

	lookAtX = mCamera.viewMatrix[2];
	lookAtY = mCamera.viewMatrix[6];
	lookAtZ = mCamera.viewMatrix[10];

	vec3.set(posCam, camX, camY, camZ);
	vec3.set(vLookDir, -lookAtX, -lookAtY, -lookAtZ);
	vec3.add(posTarget, posCam, vLookDir);

	vec3.copy(posCamRefl, posCam);
	vec3.copy(posTargetRefl, posTarget);

	//	gettting reflection camera pos
	distToWater = posCam[1] - mSeaLevel;
	posCamRefl[1] -= distToWater * 2.0;

	//	gettting reflection target pos
	distToWater = posTarget[1] - mSeaLevel;
	posTargetRefl[1] -= distToWater * 2.0;

	mTarget.lookAt(posCamRefl, posTargetRefl);
	mat4.copy(mTarget.projection, mCamera.projection);
}


const func2 = function(mCamera, mSeaLevel, mTarget) {
	mat4.invert(mInvertView, mCamera.viewMatrix);
	camX = mInvertView[12];
	camY = mInvertView[13];
	camZ = mInvertView[14];

	lookAtX = mCamera.viewMatrix[2];
	lookAtY = mCamera.viewMatrix[6];
	lookAtZ = mCamera.viewMatrix[10];

	vec3.set(posCam, camX, camY, camZ);
	vec3.set(vLookDir, -lookAtX, -lookAtY, -lookAtZ);
	vec3.add(posTarget, posCam, vLookDir);

	vec3.copy(posCamRefl, posCam);
	vec3.copy(posTargetRefl, posTarget);

	//	gettting reflection camera pos
	distToWater = posCam[1] - mSeaLevel;
	posCamRefl[1] -= distToWater * 2.0;

	//	gettting reflection target pos
	distToWater = posTarget[1] - mSeaLevel;
	posTargetRefl[1] -= distToWater * 2.0;

	mTarget.lookAt(posCamRefl, posTargetRefl);
}

export default func1;

