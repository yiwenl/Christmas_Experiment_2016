// SceneApp.js

import alfrid, { Scene, GL, GLTexture } from 'alfrid';
import ViewTerrain from './ViewTerrain';
import ViewLine from './ViewLine';
import ViewWater from './ViewWater';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';
import ViewSave from './ViewSave';
import ViewFilmGrain from './ViewFilmGrain';
import ViewTrees from './ViewTrees';
import Params from './Params';
import VIVEUtils from './VIVEUtils';
import CameraVive from './CameraVive';

const RAD = Math.PI / 180;


quat.toEulerAngles = function(q) {
	let ysqr = q[1] * q[1];
	let t0 = -2.0 * (ysqr + q[2] * q[2]) + 1.0;
	let t1 = +2.0 * (q[0] * q[1] - q[3] * q[2]);
	let t2 = -2.0 * (q[0] * q[2] + q[3] * q[1]);
	let t3 = +2.0 * (q[1] * q[2] - q[3] * q[0]);
	let t4 = -2.0 * (q[0] * q[0] + ysqr) + 1.0;

	t2 = t2 > 1.0 ? 1.0 : t2;
	t2 = t2 < -1.0 ? -1.0 : t2;

	const pitch = Math.asin(t2);
	const roll = Math.atan2(t3, t4);
	const yaw = Math.atan2(t1, t0);

	return {
		pitch,
		roll,
		yaw
	}
}

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this._count = 0;
		const FOV = 45 * RAD;

		this.camera.setPerspective(Math.PI/4, GL.aspectRatio, .1, 200);
		this.orbitalControl.radius.value = 7;
		this.orbitalControl.rx.value = 0.3;
		this.orbitalControl.center[1] = hasVR ? 0 : 2;
		this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.1);
		// this.orbitalControl.radius.limit(3, 30);

		this._modelMatrix = mat4.create();
		mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, -5, 0));
		// let scale = 2.5;
		// mat4.scale(this._modelMatrix, this._modelMatrix, vec3.fromValues(scale, scale, scale));


		this.cameraReflection = new alfrid.CameraPerspective();
		this.cameraReflection.setPerspective(FOV, GL.aspectRatio, .1, 100);

		this.cameraVive = new CameraVive();

		this.resize();
	}

	_initTextures() {
		let irr_posx = alfrid.HDRLoader.parse(getAsset('irr_posx'));
		let irr_negx = alfrid.HDRLoader.parse(getAsset('irr_negx'));
		let irr_posy = alfrid.HDRLoader.parse(getAsset('irr_posy'));
		let irr_negy = alfrid.HDRLoader.parse(getAsset('irr_negy'));
		let irr_posz = alfrid.HDRLoader.parse(getAsset('irr_posz'));
		let irr_negz = alfrid.HDRLoader.parse(getAsset('irr_negz'));

		this._textureIrr = new alfrid.GLCubeTexture([irr_posx, irr_negx, irr_posy, irr_negy, irr_posz, irr_negz]);
		this._textureRad = alfrid.GLCubeTexture.parseDDS(getAsset('radiance'));
		this._textureStar = new GLTexture(getAsset('starsmap'));
		this._textureNoise = new GLTexture(getAsset('noise'));

		this._fboReflection = new alfrid.FrameBuffer(hasVR ? GL.width / 2 : GL.width, GL.height);


		//	PARTICLES
		const numParticles = Params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.HALF_FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
	}

	_initViews() {
		this._bCopy = new alfrid.BatchCopy();
		this._bSky = new alfrid.BatchSky(80);

		this._vRender = new ViewRender();
		this._vSim 	  = new ViewSim();
		this._vTerrain = new ViewTerrain();
		this._vWater = new ViewWater();
		this._vFilmGrain = new ViewFilmGrain();
		this._vTrees = new ViewTrees();


		this._vSave = new ViewSave();
		GL.setMatrices(this.cameraOrtho);


		this._fboCurrent.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboCurrent.unbind();

		this._fboTarget.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboTarget.unbind();

		GL.setMatrices(this.camera);

	}

	updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2));
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;
	}


	_getReflectionMatrix() {

		const mInvertView = mat4.create();
		mat4.invert(mInvertView, this.camera.viewMatrix);
		const camX = mInvertView[12];
		const camY = mInvertView[13];
		const camZ = mInvertView[14];

		const Nx = 0;
		const Ny = 1;
		const Nz = 0;

		const translation = vec3.create();
		mat4.getTranslation(translation, this.camera.viewMatrix);

		const D = camY - Params.seaLevel;

		const rotationCam = quat.create();
		mat4.getRotation(rotationCam, this.camera.viewMatrix);
		let o = quat.toEulerAngles(rotationCam);


		const mReflection = mat4.fromValues(
			1 - 2 * Nx * Nx, -2 * Nx * Ny, -2 * Nx * Nz, -2 * Nx * D,
			-2 * Nx * Ny, 1 - 2 * Ny * Ny, -2 * Ny * Nz, -2 * Ny * D,
			-2 * Nx * Nz, -2 * Ny * Nz, 1 - 2 * Nz * Nz, -2 * Nz * D,
			0, 0, 0, 1
			);

		if(Math.random() > .99) {
			// console.log('Dist to water :', D);
			// console.log(mat4.str(mReflection));
			// console.log(-camX, -camY, -camZ, translation);
			console.log(o);
		}

		// mat4.scale(this.cameraReflection.viewMatrix, this.camera.viewMatrix, vec3.fromValues(1, -1, 1));
		// mat4.translate(this.cameraReflection.viewMatrix, this.cameraReflection.viewMatrix, vec3.fromValues(0, -D * 2, 0));

		mat4.translate(this.cameraReflection.viewMatrix, this.camera.viewMatrix, vec3.fromValues(0, D * 2, 0));
		mat4.scale(this.cameraReflection.viewMatrix, this.cameraReflection.viewMatrix, vec3.fromValues(1, -1, 1));
		

		// mat4.multiply(this.cameraReflection.viewMatrix, mInvertView, mReflection);
		// mat4.multiply(this.cameraReflection.viewMatrix, mReflection, mInvertView);
		// mat4.multiply(this.cameraReflection.viewMatrix, this.camera.viewMatrix, mReflection);
		// mat4.multiply(this.cameraReflection.viewMatrix, mReflection, this.camera.viewMatrix);
	}


	render() {
		if(!hasVR) {
			const { eye, center } = this.camera;
			let distToWater       = eye[1] - Params.seaLevel;
			const eyeRef          = [eye[0], eye[1] - distToWater * 2.0, eye[2]];
			distToWater           = center[1] - Params.seaLevel;
			const centerRef       = [center[0], center[1] - distToWater * 2.0, center[2]];
			this.cameraReflection.lookAt(eyeRef, centerRef);

			// this._getReflectionMatrix();
		}
		
		this._count ++;
		if(this._count % Params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		Params.clipY = Params.seaLevel;

		GL.clear(0, 0, 0, 0);


		if(!window.hasVR) {
			GL.setMatrices(this.cameraReflection);
			this._renderReflection();
			GL.setMatrices(this.camera);
			this._renderScene(true);
		} else {
			const frameData = VIVEUtils.getFrameData();
			this.cameraVive.updateCamera(frameData);
			GL.enable(GL.SCISSOR_TEST);
			const w2 = GL.width/2;

			//	left
			GL.viewport(0, 0, w2, GL.height);
			GL.scissor(0, 0, w2, GL.height);
			this.cameraVive.setEye('left');
			GL.setMatrices(this.cameraVive);
			GL.rotate(this._modelMatrix);
			this._renderScene(false);

			//	right
			GL.viewport(w2, 0, w2, GL.height);
			GL.scissor(w2, 0, w2, GL.height);
			this.cameraVive.setEye('right');
			GL.setMatrices(this.cameraVive);
			GL.rotate(this._modelMatrix);
			this._renderScene(false);

			GL.disable(GL.SCISSOR_TEST);

			VIVEUtils.submitFrame();
		}
		
		

		GL.enableAdditiveBlending();
		this._vFilmGrain.render();
		GL.enableAlphaBlending();

		// this._bCopy.draw(this._fboReflection.getTexture());
	}


	_renderScene(withWater=false) {
		if(withWater) {
			Params.clipY = 999;
			Params.clipDir = 1;
		} else {
			Params.clipDir = -1;
		}


		this._bSky.draw(this._textureStar);
		if(withWater) {
			this._vWater.render(this._fboReflection.getTexture());	
		}
		this._vTerrain.render(this._textureRad, this._textureIrr, this._textureNoise);
		this._vTrees.render(this._textureRad, this._textureIrr, this._textureNoise);
		
		let p = this._count / Params.skipCount;
		GL.enableAdditiveBlending();
		this._vRender.render(this._fboTarget.getTexture(0), this._fboCurrent.getTexture(0), p, this._fboCurrent.getTexture(2));
		GL.enableAlphaBlending();
	}


	_renderReflection() {
		this._fboReflection.bind();
		GL.clear(0, 0, 0, 0);
		this._renderScene();
		this._fboReflection.unbind();
	}


	resize() {
		const scale = hasVR ? 2 : 1;
		console.debug('Scale : ', scale);
		GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
		this.camera.setAspectRatio(GL.aspectRatio);
		this.cameraReflection.setAspectRatio(GL.aspectRatio);
		this._fboReflection = new alfrid.FrameBuffer(hasVR ? GL.width / 2 : GL.width, GL.height);
	}
}


export default SceneApp;