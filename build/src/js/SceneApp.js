// SceneApp.js

import alfrid, { Scene, GL, GLTexture } from 'alfrid';
import glmatrix from 'gl-matrix';
import ViewTerrain from './ViewTerrain';
import ViewWater from './ViewWater';
import ViewNothing from './views/ViewNothing';

import ViewFilmGrain from './ViewFilmGrain';
import ViewTrees from './ViewTrees';
import ViewFarground from './ViewFarground';
import ViewTrunk from './views/ViewTrunk';
import ViewEyeParticle from './views/ViewEyeParticle';
import ViewTitle from './views/ViewTitle';
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

const scissor = function(x, y, w, h) {
	GL.scissor(x, y, w, h);
	GL.viewport(x, y, w, h);

}

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		const FOV = 45 * RAD;

		this.camera.setPerspective(Math.PI/4, GL.aspectRatio, .1, 200);
		this.orbitalControl.radius.setTo(10);
		this.orbitalControl.radius.easing = 0.02;
		this.orbitalControl.radius.value = 7;

		const dataStop = CameraStops[0];

		this.orbitalControl.rx.setTo(dataStop.rx);
		this.orbitalControl.ry.setTo(dataStop.ry);
		this.orbitalControl.center[1] = hasVR ? 0 : 2;
		// this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.75);
		// this.orbitalControl.radius.limit(3, 30);

		this.eyeX = 0;
		this.eyeY = 0;
		this.eyeZ = 0;

		this._hasFormFinalShape = false;


		const trace = () => {
			console.log(this.eyeX, this.eyeY, this.eyeZ);
		}

		const range = 5;
		gui.add(this, 'eyeX', -range, range).onChange(trace);
		gui.add(this, 'eyeY', -range, range).onChange(trace);
		gui.add(this, 'eyeZ', -range, range).onChange(trace);

		this.cameraYOffset = hasVR ? -3 : 0;
		this.time = Math.random() * 0xFF;


		this.cameraOffsetX = new alfrid.TweenNumber(dataStop.x * Params.terrainSize/2, 'cubicInOut', TweenSpeed);
		this.cameraOffsetY = new alfrid.TweenNumber(this.cameraYOffset, 'cubicInOut', TweenSpeed);
		this.cameraOffsetZ = new alfrid.TweenNumber(dataStop.z * Params.terrainSize/2, 'cubicInOut', TweenSpeed);

		this.cameraReflection = new alfrid.CameraPerspective();
		this.cameraReflection.setPerspective(FOV, GL.aspectRatio, .1, 100);

		this.cameraVive = new CameraVive();

		this._pointTarget = [dataStop.tx * Params.terrainSize/2, dataStop.ty, dataStop.tz * Params.terrainSize/2];
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
			} else if(e.keyCode === 32) {
				if(this._stop == CameraStops.length-1) {

					if(this._hasFormFinalShape) {
						console.debug(' RESTART ');
						this.nextStop();
					} else {
						console.debug('Press and hold');
					}

				} else {
					this.nextStop();
				}
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
		// this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.75);
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
		this.isFinished = false;
		this.finishAnimating = false;

		this._bCopy = new alfrid.BatchCopy();
		this._bSky = new alfrid.BatchSky(80);
		this._bBall = new alfrid.BatchBall();


		this._vTerrain = new ViewTerrain();
		this._vWater = new ViewWater();
		this._vFilmGrain = new ViewFilmGrain();
		this._vTrees = new ViewTrees();
		this._vFg = new ViewFarground();
		this._vTrunk = new ViewTrunk();
		this._vEyeLeft = new ViewEyeParticle();
		this._vEyeRight = new ViewEyeParticle();
		this._vNothing = new ViewNothing();
		this._vTitle = new ViewTitle();


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


		alfrid.Scheduler.delay(()=> {
			const dataStop = CameraStops[this._stop];
			this._pointTarget = [dataStop.tx * Params.terrainSize/2, dataStop.ty, dataStop.tz * Params.terrainSize/2];

			this._subLines.goTo([this._pointTarget[0], -this._pointTarget[1], -this._pointTarget[2]], false, 8);
		}, null, 1500);
	}

	_getReflectionMatrix() {
		const camera = hasVR ? this.cameraVive : this.camera;

		const range = hasVR ? 0 : .15;
		const offsetX = Math.cos(Math.sin(this.time * 0.3987454) * 1.3265432);
		const offsetY = Math.sin(Math.sin(this.time) * 0.5789423);
		const offsetZ = Math.cos(Math.cos(this.time * 0.67894) * 0.5789423);
		mat4.translate(	camera.viewMatrix,
						camera.viewMatrix,
						vec3.fromValues(
							this.cameraOffsetX.value + offsetX * range,
							this.cameraOffsetY.value + offsetY * range,
							this.cameraOffsetZ.value + offsetZ * range
						));

		GetReflectionMatrix(camera, Params.seaLevel, this.cameraReflection)
	}

	render() {
		this.time += 0.01;
		if(!window.hasVR) {
			this.toRender();
		}
	}

	nextStop() {

		if(this.finishAnimating || this.timerBeforeNext > 0) return;

		this.timerBeforeNext = 120;
		if(!this.isFinished){
			let next = this._stop + 1;
			if(next >= CameraStops.length) {
				next = 1;
				this._subFinale.isReady = true;
				this.isFinished = true;
				// this._finish();
			}
			else {
			}
			this._gotoStop(next);
		}
		else {
			this._finish()
			this.finishAnimating = true;
		}
	}

	_finish() {
		this._hasTouchControl = false;
		const rx = this.orbitalControl.rx.value;
		const ry = this.orbitalControl.ry.value;

		this.orbitalControl.rx = new alfrid.TweenNumber(rx, 'expInOut', rotSpeed);
		this.orbitalControl.ry = new alfrid.TweenNumber(ry, 'expInOut', rotSpeed);
		this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.75);

		const dataStop = {"x":0.,"z":-0.,"tx":-0.020370370370370372,"ty":2.543168085871387,"tz":0.6121824555767954,"rx":0.0198826170582594,"ry":0};

		this._pointTarget = [dataStop.tx * Params.terrainSize/2, dataStop.ty, dataStop.tz * Params.terrainSize/2];
		this._subLines.goTo([0, -1, 0], true);
		// this._subLines.goTo([this._pointTarget[0], -this._pointTarget[1], -this._pointTarget[2]], this.isFinished);


		this.cameraOffsetX.value = dataStop.x * Params.terrainSize/2;
		this.cameraOffsetZ.value = dataStop.z * Params.terrainSize/2;
		this.orbitalControl.rx.value = dataStop.rx;
		this.orbitalControl.ry.value = dataStop.ry;
	}

	finishFinalShape() {
		this._hasFormFinalShape = true;
		document.body.classList.remove('stop-8');
		document.body.classList.add('complete');
	}

	_gotoStop(i) {
		this._vTitle.close();
		let className = `stop-${this._stop}`;
		document.body.classList.remove(className);
		document.body.classList.remove('complete');

		console.log("goto stop", i);
		this._hasTouchControl = false;
		const rx = this.orbitalControl.rx.value;
		const ry = this.orbitalControl.ry.value;

		this.orbitalControl.rx = new alfrid.TweenNumber(rx, 'expInOut', rotSpeed);
		this.orbitalControl.ry = new alfrid.TweenNumber(ry, 'expInOut', rotSpeed);
		this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.75);

		this._stop = i;
		const dataStop = CameraStops[this._stop];

		this._pointTarget = [dataStop.tx * Params.terrainSize/2, dataStop.ty, dataStop.tz * Params.terrainSize/2];

		this._subLines.goTo([this._pointTarget[0], -this._pointTarget[1], -this._pointTarget[2]], false);


		this.cameraOffsetX.value = dataStop.x * Params.terrainSize/2;
		this.cameraOffsetZ.value = dataStop.z * Params.terrainSize/2;
		this.orbitalControl.rx.value = dataStop.rx;
		this.orbitalControl.ry.value = dataStop.ry;

		className = `stop-${this._stop}`;
		document.body.classList.add(className);

		if(i === 8) {
			console.debug('Finishing');

			alfrid.Scheduler.delay(()=> {
				this.finishFinalShape();
			}, null, 1000);
		}
	}


	toRender() {
		//	update subscenes

		if(this.timerBeforeNext > 0){
			this.timerBeforeNext--;
		}

		this._subParticles.update();
		this._subLines.update();

		// if(this.isFinished){
			this._subFinale.update();
		// }

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

			GL.enableAdditiveBlending();
			this._vFilmGrain.render();
			GL.enableAlphaBlending();
		} else {

			GL.enable(GL.SCISSOR_TEST);
			const w2 = GL.width/2;

			//	VR enter frame
			VIVEUtils.vrDisplay.requestAnimationFrame(()=>this.toRender());

			//	get VR data
			const frameData = VIVEUtils.getFrameData();
			this.cameraVive.updateCamera(frameData);

			//	left eye
			this.cameraVive.setEye('left');
			this._getReflectionMatrix();

			scissor(0, 0, w2, GL.height);
			GL.setMatrices(this.cameraReflection);
			this._fboReflection.bind();
			GL.clear(0, 0, 0, 0);
			this._renderScene();
			this._fboReflection.unbind();

			scissor(0, 0, w2, GL.height);
			GL.setMatrices(this.cameraVive);
			this._renderScene(true);


			//	right eye
			this.cameraVive.setEye('right');
			this._getReflectionMatrix();

			scissor(w2, 0, w2, GL.height);
			GL.setMatrices(this.cameraReflection);
			this._fboReflection.bind();
			GL.clear(0, 0, 0, 0);
			this._renderScene();
			this._fboReflection.unbind();

			scissor(w2, 0, w2, GL.height);
			GL.setMatrices(this.cameraVive);
			this._renderScene(true);


			GL.disable(GL.SCISSOR_TEST);

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
		this._vTrunk.render(this._textureRad, this._textureIrr, this._textureStar);
		this._bBall.draw(this._pointTarget, [.5, .5, .5], [.8, .2, .1], .25);

		this._subLines.render(this.orbitalControl.position);
		// this._subFinale.render();

		// if(this.isFinished){
		// }

		GL.enableAdditiveBlending();
		this._vEyeLeft.render([this.eyeX, this.eyeY, this.eyeZ], this._pointTarget);
		this._vEyeRight.render([this.eyeX, this.eyeY, this.eyeZ], this._pointTarget);
		this._subParticles.render();

		this._vTitle.render(this._pointTarget);
		this._vNothing.render();
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
