// SceneApp.js

import alfrid, { Scene, GL, GLTexture } from 'alfrid';
import ViewTerrain from './ViewTerrain';
import ViewWater from './ViewWater';

import ViewFilmGrain from './ViewFilmGrain';
import ViewTrees from './ViewTrees';
import ViewFarground from './ViewFarground';
import EffectComposer from './effectComposer/EffectComposer';
import Pass from './effectComposer/Pass';
import PassFXAA from './effectComposer/passes/PassFXAA';
import Params from './Params';
import VIVEUtils from './VIVEUtils';
import CameraVive from './CameraVive';

import SubsceneParticles from './SubsceneParticles';
import SubsceneLines from './SubsceneLines';

import fsSoftLight from '../shaders/softlight.frag';

const RAD = Math.PI / 180;

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		const FOV = 45 * RAD;

		this.camera.setPerspective(Math.PI/4, GL.aspectRatio, .1, 200);
		this.orbitalControl.radius.value = 7;
		// this.orbitalControl.rx.value = 0.3;
		this.orbitalControl.center[1] = hasVR ? 0 : 2;
		// this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.75);
		this.orbitalControl.radius.limit(3, 30);

		const yOffset = -3;
		this._modelMatrix = mat4.create();
		mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, yOffset, 0));

		this._modelMatrixRefl = mat4.create();
		mat4.translate(this._modelMatrixRefl, this._modelMatrixRefl, vec3.fromValues(0, -yOffset, 0));
		// let scale = 2.5;
		// mat4.scale(this._modelMatrix, this._modelMatrix, vec3.fromValues(scale, scale, scale));

		this.cameraReflection = new alfrid.CameraPerspective();
		this.cameraReflection.setPerspective(FOV, GL.aspectRatio, .1, 100);

		this.cameraVive = new CameraVive();

		this.resize();

		if(hasVR) {
			this.toRender();
		}
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
		this._textureGradient = new GLTexture(getAsset('gradient'));

		this._fboRender = new alfrid.FrameBuffer(hasVR ? GL.width / 2 : GL.width, GL.height);
		this._fboReflection = new alfrid.FrameBuffer(hasVR ? GL.width : GL.width, GL.height);
	}

	_initViews() {
		this._bCopy = new alfrid.BatchCopy();
		this._bSky = new alfrid.BatchSky(80);

		
		this._vTerrain = new ViewTerrain();
		this._vWater = new ViewWater();
		this._vFilmGrain = new ViewFilmGrain();
		this._vTrees = new ViewTrees();
		this._vFg = new ViewFarground();


		//	Sub scenes
		this._subParticles = new SubsceneParticles(this);
		this._subLines = new SubsceneLines();

		this._composer = new EffectComposer(GL.width, GL.height);
		this._passSoftLight = new Pass(fsSoftLight)
		this._passSoftLight.bindTexture('textureGradient', this._textureGradient);
		this._passFxaa = new PassFXAA();
		this._composer.addPass(this._passSoftLight);
		this._composer.addPass(this._passFxaa);
	}

	
	_getReflectionMatrix() {
		const camera = hasVR ? this.cameraVive : this.camera;

		const mInvertView = mat4.create();
		mat4.invert(mInvertView, camera.viewMatrix);
		const camX = mInvertView[12];
		const camY = mInvertView[13];
		const camZ = mInvertView[14];

		const lookAtX = camera.viewMatrix[2];
		const lookAtY = camera.viewMatrix[6];
		const lookAtZ = camera.viewMatrix[10];

		const posCam = vec3.fromValues(camX, camY, camZ);
		const vLookDir = vec3.fromValues(-lookAtX, -lookAtY, -lookAtZ);
		const posTarget = vec3.create();
		vec3.add(posTarget, posCam, vLookDir);

		const posCamRefl = vec3.clone(posCam);
		const posTargetRefl = vec3.clone(posTarget);

		let distToWater
		//	gettting reflection camera pos
		distToWater = posCam[1] - Params.seaLevel;
		posCamRefl[1] -= distToWater * 2.0;

		//	gettting reflection target pos
		distToWater = posTarget[1] - Params.seaLevel;
		posTargetRefl[1] -= distToWater * 2.0;

		this.cameraReflection.lookAt(posCamRefl, posTargetRefl);
	}


	render() {
		if(!window.hasVR) {
			this.toRender();
		}
	}


	toRender() {
		//	update subscenes
		this._subParticles.update();
		this._subLines.update();
		Params.clipY = Params.seaLevel;

		GL.clear(0, 0, 0, 0);


		if(!window.hasVR) {
			//	get reflection matrix
			this._getReflectionMatrix();

			GL.setMatrices(this.cameraReflection);
			GL.rotate(this._modelMatrixRefl);
			this._renderReflection();

			if(Params.postEffect) {
				this._fboRender.bind();
				GL.clear(0, 0, 0, 0);	
			}
			
			GL.setMatrices(this.camera);
			GL.rotate(this._modelMatrix);
			this._renderScene(true);

			if(Params.postEffect) {
				this._fboRender.unbind();
				this._composer.render(this._fboRender.getTexture());
				this._bCopy.draw(this._composer.getTexture());
			}

			GL.enableAdditiveBlending();
			this._vFilmGrain.render();
			GL.enableAlphaBlending();
		} else {

			VIVEUtils.vrDisplay.requestAnimationFrame(()=>this.toRender());

			const frameData = VIVEUtils.getFrameData();
			this.cameraVive.updateCamera(frameData);
			this.cameraVive.setEye('left');

			//	get reflection matrix
			this._getReflectionMatrix();

			GL.setMatrices(this.cameraReflection);
			GL.rotate(this._modelMatrixRefl);
			this._renderReflection();

			GL.setMatrices(this.cameraVive);
			GL.rotate(this._modelMatrix);
			this._renderScene(true);

			
			

			/*
			GL.enable(GL.SCISSOR_TEST);
			const w2 = GL.width/2;

			//	left
			GL.viewport(0, 0, w2, GL.height);
			GL.scissor(0, 0, w2, GL.height);
			this.cameraVive.setEye('left');

			//	get reflection matrix
			this._getReflectionMatrix();

			//	render reflection
			GL.setMatrices(this.cameraReflection);
			GL.rotate(this._modelMatrix);
			this._fboReflection.bind();
			GL.viewport(0, 0, w2, GL.height);
			GL.scissor(0, 0, w2, GL.height);
			GL.clear(0, 0, 0, 0);
			this._renderScene();
			this._fboReflection.unbind();

			//	render full scene
			GL.viewport(0, 0, w2, GL.height);
			GL.scissor(0, 0, w2, GL.height);
			GL.setMatrices(this.cameraVive);
			GL.rotate(this._modelMatrix);
			this._renderScene(true);

			GL.enableAdditiveBlending();
			this._vFilmGrain.render();
			GL.enableAlphaBlending();



			//	right
			GL.viewport(w2, 0, w2, GL.height);
			GL.scissor(w2, 0, w2, GL.height);
			this.cameraVive.setEye('right');

			//	get reflection matrix
			this._getReflectionMatrix();

			//	render reflection
			GL.setMatrices(this.cameraReflection);
			GL.rotate(this._modelMatrix);

			this._fboReflection.bind();
			GL.viewport(w2, 0, w2, GL.height);
			GL.scissor(w2, 0, w2, GL.height);
			GL.clear(0, 0, 0, 0);
			this._renderScene();
			this._fboReflection.unbind();

			//	render full scene
			GL.viewport(w2, 0, w2, GL.height);
			GL.scissor(w2, 0, w2, GL.height);
			GL.setMatrices(this.cameraVive);
			GL.rotate(this._modelMatrix);
			this._renderScene(true);

			GL.enableAdditiveBlending();
			this._vFilmGrain.render();
			GL.enableAlphaBlending();

			GL.disable(GL.SCISSOR_TEST);

			VIVEUtils.submitFrame();
			*/
		}

	}


	_renderScene(withWater=false) {
		if(withWater) {
			Params.clipY = 999;
			Params.clipDir = 1;
		} else {
			Params.clipDir = -1;
		}


		this._bSky.draw(this._textureStar);
		this._vFg.render();
		if(withWater) {
			this._vWater.render(this._fboReflection.getTexture());	
		}
		this._vTerrain.render(this._textureRad, this._textureIrr, this._textureNoise);
		this._vTrees.render(this._textureRad, this._textureIrr, this._textureNoise);

		
		this._subParticles.render();
		// this._subLines.render();
	}


	_renderReflection() {
		this._fboReflection.bind();
		GL.clear(0, 0, 0, 0);
		this._renderScene();
		this._fboReflection.unbind();
	}


	resize() {
		const scale = hasVR ? 3 : 1;
		GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
		this.camera.setAspectRatio(GL.aspectRatio);
		this.cameraReflection.setAspectRatio(GL.aspectRatio);
		this._fboRender = new alfrid.FrameBuffer(hasVR ? GL.width / 2 : GL.width, GL.height);
		this._fboReflection = new alfrid.FrameBuffer(hasVR ? GL.width : GL.width, GL.height);
		this._composer = new EffectComposer(GL.width, GL.height);
		this._composer.addPass(this._passSoftLight);
		this._composer.addPass(this._passFxaa);
	}
}


export default SceneApp;