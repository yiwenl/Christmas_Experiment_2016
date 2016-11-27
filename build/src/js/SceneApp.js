// SceneApp.js

import alfrid, { Scene, GL, GLTexture } from 'alfrid';
import glmatrix from 'gl-matrix';
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
import SubsceneFinale from './SubsceneFinale';

import GetReflectionMatrix from './utils/GetReflectionMatrix';
import CameraStops from './CameraStops';

import fsSoftLight from '../shaders/softlight.frag';

const RAD = Math.PI / 180;
const TweenSpeed = GL.isMobile ? 0.007 : 0.0035;
const rotSpeed = GL.isMobile ? 0.004 : 0.002;

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		const FOV = 45 * RAD;

		this.camera.setPerspective(Math.PI/4, GL.aspectRatio, .1, 200);
		this.orbitalControl.radius.value = 7;

		this.orbitalControl.rx.setTo(0.3);
		this.orbitalControl.ry.setTo(0.0);
		this.orbitalControl.center[1] = hasVR ? 0 : 2;
		this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.75);
		this.orbitalControl.radius.limit(3, 30);

		this.cameraYOffset = hasVR ? -2 : 0;


		this.cameraOffsetX = new alfrid.TweenNumber(0, 'cubicInOut', TweenSpeed);
		this.cameraOffsetY = new alfrid.TweenNumber(0, 'cubicInOut', TweenSpeed);
		this.cameraOffsetZ = new alfrid.TweenNumber(0, 'cubicInOut', TweenSpeed);

		this.cameraReflection = new alfrid.CameraPerspective();
		this.cameraReflection.setPerspective(FOV, GL.aspectRatio, .1, 100);

		this.cameraVive = new CameraVive();

		this._pointTarget = [0, 2.5, 0];
		this._stop = 0;
		this._hasTouchControl = true;

		this.resize();

		if(hasVR) {
			this.toRender();
		}

		// socket.on('cameraAngleChange', (angles)=> this._onCameraAngle(angles));
		// socket.on('cameraPositionChange', (pos)=> this._onCameraPosition(pos));
		// socket.on('targetPositionChange', (pos)=> this._onTargetPosition(pos));

		const btnNext = document.body.querySelector('.button-next');
		btnNext.addEventListener('touchstart', (e)=> {
			this.nextStop();
		});

		window.addEventListener('keydown', (e)=> {
			if(e.keyCode === 39) {
				this.nextStop();
			}
		});


		GL.canvas.addEventListener('mousedown', (e)=>this._enableCameraTouchControl());
		GL.canvas.addEventListener('touchstart', (e)=>this._enableCameraTouchControl());
	}

	_enableCameraTouchControl() {
		if(this._hasTouchControl) {	return;	}

		console.debug('Enable camera touch control');

		const rx = this.orbitalControl.rx.value;
		const ry = this.orbitalControl.ry.value;

		this.orbitalControl.rx = new alfrid.EaseNumber(rx);
		this.orbitalControl.ry = new alfrid.EaseNumber(ry);
		this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.75);
		this._hasTouchControl = true;
	}

	_onCameraAngle(angles) {
		this.orbitalControl.rx.value = angles.rx;
		this.orbitalControl.ry.value = angles.ry;
	}

	_onCameraPosition(pos) {
		this.cameraOffsetX.value = pos.x * Params.terrainSize/2;
		this.cameraOffsetZ.value = pos.z * Params.terrainSize/2;
	}

	_onTargetPosition(pos) {
		this._pointTarget = [pos.x * Params.terrainSize/2, pos.y, pos.z * Params.terrainSize/2];
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
		this._textureStar = new GLTexture(getAsset(GL.isMobile ? 'starsmapMobile' : 'starsmap'));
		this._textureNoise = new GLTexture(getAsset('noise'));
		this._textureGradient = new GLTexture(getAsset('gradient'));

		this._resetFrameBuffer();
	}

	_initViews() {
		this._bCopy = new alfrid.BatchCopy();
		this._bSky = new alfrid.BatchSky(80);
		this._bBall = new alfrid.BatchBall();


		this._vTerrain = new ViewTerrain();
		this._vWater = new ViewWater();
		this._vFilmGrain = new ViewFilmGrain();
		this._vTrees = new ViewTrees();
		this._vFg = new ViewFarground();


		//	Sub scenes
		this._subParticles = new SubsceneParticles(this);
		this._subLines = new SubsceneLines(this);
		this._subFinale = new SubsceneFinale(this);

		this._composer = new EffectComposer(GL.width, GL.height);
		this._passSoftLight = new Pass(fsSoftLight)
		this._passSoftLight.bindTexture('textureGradient', this._textureGradient);
		this._passFxaa = new PassFXAA();
		this._composer.addPass(this._passSoftLight);
		this._composer.addPass(this._passFxaa);
	}

	_getReflectionMatrix() {
		const camera = hasVR ? this.cameraVive : this.camera;
		mat4.translate(camera.viewMatrix, camera.viewMatrix, vec3.fromValues(this.cameraOffsetX.value, this.cameraOffsetY.value, this.cameraOffsetZ.value));

		GetReflectionMatrix(camera, Params.seaLevel, this.cameraReflection)
	}

	render() {
		if(!window.hasVR) {
			this.toRender();
		}
	}

	nextStop() {
		let next = this._stop + 1;
		if(next >= CameraStops.length) {
			next = 0;
		}

		this._gotoStop(next);

	}

	_gotoStop(i) {
		this._hasTouchControl = false;
		const rx = this.orbitalControl.rx.value;
		const ry = this.orbitalControl.ry.value;

		this.orbitalControl.rx = new alfrid.TweenNumber(rx, 'expInOut', rotSpeed);
		this.orbitalControl.ry = new alfrid.TweenNumber(ry, 'expInOut', rotSpeed);
		this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.75);

		this._stop = i;
		const dataStop = CameraStops[this._stop];

		this._pointTarget = [dataStop.tx * Params.terrainSize/2, dataStop.ty, dataStop.tz * Params.terrainSize/2];

		this._subLines.goTo([this._pointTarget[0], -this._pointTarget[1], -this._pointTarget[2]]);


		this.cameraOffsetX.value = dataStop.x * Params.terrainSize/2;
		this.cameraOffsetZ.value = dataStop.z * Params.terrainSize/2;
		this.orbitalControl.rx.value = dataStop.rx;
		this.orbitalControl.ry.value = dataStop.ry;
	}


	toRender() {
		//	update subscenes
		this._subParticles.update();
		this._subLines.update();
		this._subFinale.update();

		if(!hasVR) {
			const { eye, center } = this.camera;
			let distToWater       = eye[1] - Params.seaLevel;
			const eyeRef          = [eye[0], eye[1] - distToWater * 2.0, eye[2]];
			distToWater           = center[1] - Params.seaLevel;
			const centerRef       = [center[0], center[1] - distToWater * 2.0, center[2]];
			this.cameraReflection.lookAt(eyeRef, centerRef);

			// this._getReflectionMatrix();
		}

		Params.clipY = Params.seaLevel;

		GL.clear(0, 0, 0, 0);


		if(!window.hasVR) {
			//	get reflection matrix
			this._getReflectionMatrix();

			GL.setMatrices(this.cameraReflection);
			this._renderReflection();
			GL.setMatrices(this.camera);
			this._renderScene(true);

			// GL.enableAdditiveBlending();
			// this._vFilmGrain.render();
			// GL.enableAlphaBlending();
		} else {

			GL.enable(GL.SCISSOR_TEST);
			const w2 = GL.width/2;


			VIVEUtils.vrDisplay.requestAnimationFrame(()=>this.toRender());

			const frameData = VIVEUtils.getFrameData();
			this.cameraVive.updateCamera(frameData);


			this.cameraVive.setEye('left');
			this._getReflectionMatrix();

			GL.setMatrices(this.cameraReflection);
			this._fboReflection.bind();
			GL.clear(0, 0, 0, 0);
			this._renderScene();
			this._fboReflection.unbind();

			GL.viewport(0, 0, w2, GL.height);
			GL.scissor(0, 0, w2, GL.height);
			GL.setMatrices(this.cameraVive);
			this._renderScene(true);



			this.cameraVive.setEye('right');
			this._getReflectionMatrix();

			GL.setMatrices(this.cameraReflection);
			this._fboReflection.bind();
			GL.clear(0, 0, 0, 0);
			this._renderScene();
			this._fboReflection.unbind();

			GL.viewport(w2, 0, w2, GL.height);
			GL.scissor(w2, 0, w2, GL.height);
			GL.setMatrices(this.cameraVive);
			this._renderScene(true);

			GL.disable(GL.SCISSOR_TEST);



			/*


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
			*/

			VIVEUtils.submitFrame();
		}

		const size = 256 * 2;

		GL.viewport(window.innerWidth/2, 0, size, size/GL.aspectRatio * 2);
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
		this._vFg.render();
		if(withWater) {
			this._vWater.render(this._fboReflection.getTexture());
		}
		this._vTerrain.render(this._textureRad, this._textureIrr, this._textureNoise, this._textureStar);
		this._vTrees.render(this._textureRad, this._textureIrr, this._textureNoise, this._textureStar);

		this._bBall.draw(this._pointTarget, [.5, .5, .5], [.8, .2, .1]);

		this._subParticles.render();
		this._subLines.render();
		// this._subFinale.render();
	}


	_renderReflection() {
		this._fboReflection.bind();
		GL.clear(0, 0, 0, 0);
		this._renderScene();
		this._fboReflection.unbind();
	}


	resize() {
		const scale = hasVR ? 2 : 1;
		GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
		if(!hasVR) {
			this.camera.setAspectRatio(GL.aspectRatio);
			this.cameraReflection.setAspectRatio(GL.aspectRatio);
		}


		this._resetFrameBuffer();
	}

	_resetFrameBuffer() {
		const scale = GL.isMobile ? 0.5 : 1;
		this._fboReflection = new alfrid.FrameBuffer((hasVR ? GL.width / 2 : GL.width) * scale, GL.height * scale);
		// console.log('Frame buffer size : ', this._fboReflection.width, this._fboReflection.height);
	}
}


export default SceneApp;
