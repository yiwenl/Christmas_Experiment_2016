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


function calculateReflectionMatrix(reflectionMat, plane) {
	// console.log(reflectionMat);

	reflectionMat[0] = 1 - 2 * plane[0] * plane[0];
	reflectionMat[1] = -2 * plane[0] * plane[1];
	reflectionMat[2] = -2 * plane[0] * plane[2];
	reflectionMat[3] = -2 * plane[3] * plane[0];

	reflectionMat[4] = -2 * plane[1] * plane[0];
	reflectionMat[5] = 1 - 2 * plane[1] * plane[1];
	reflectionMat[6] = -2 * plane[1] * plane[2];
	reflectionMat[7] = -2 * plane[3] * plane[1];

	reflectionMat[8] = -2 * plane[2] * plane[0];
	reflectionMat[9] = -2 * plane[2] * plane[1];
	reflectionMat[10] = 1 - 2 * plane[2] * plane[2];
	reflectionMat[11] = -2 * plane[3] * plane[2];

	reflectionMat[12] = 0;
	reflectionMat[13] = 0;
	reflectionMat[14] = 0;
	reflectionMat[15] = 1;
	
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

	// vec3.copy(posCamRefl, posCam);
	// vec3.copy(posTargetRefl, posTarget);

	//	gettting reflection camera pos
	distToWater = posCam[1] - mSeaLevel;
	posCamRefl[1] -= distToWater * 2.0;

	// //	gettting reflection target pos
	// distToWater = posTarget[1] - mSeaLevel;
	// posTargetRefl[1] -= distToWater * 2.0;

	// mTarget.lookAt(posCamRefl, posTargetRefl);

	const normal = vec3.fromValues(0, 1, 0);
	const reflPlane = vec4.fromValues(normal[0], normal[1], normal[2], distToWater);

	// console.log(reflPlane);
	const mReflection = mat4.create();

	calculateReflectionMatrix(mReflection, reflPlane);

	mat4.mul(mTarget.viewMatrix, mReflection, mCamera.viewMatrix);
	mat4.copy(mTarget.projection, mCamera.projection);
}

export default func1;

