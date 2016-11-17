// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewTerrain from './ViewTerrain';
import ViewLine from './ViewLine';
import ViewWater from './ViewWater';
import Params from './Params';

const RAD = Math.PI / 180;

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();

		const FOV = 45 * RAD;

		this.camera.setPerspective(Math.PI/4, GL.aspectRatio, .1, 200);
		this.orbitalControl.radius.value = 7;
		this.orbitalControl.rx.value = 0.3;
		this.orbitalControl.center[1] = 2;
		this.orbitalControl.rx.limit(0.3, Math.PI/2 - 0.1);

		this.cameraReflection = new alfrid.CameraPerspective();
		this.cameraReflection.setPerspective(FOV, GL.aspectRatio, .1, 100);
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
		this._textureStar = new alfrid.GLTexture(getAsset('starsmap'));

		this._fboReflection = new alfrid.FrameBuffer(GL.width, GL.height);
	}


	_initViews() {
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bSky = new alfrid.BatchSky();

		this._vTerrain = new ViewTerrain();
		this._vWater = new ViewWater();
	}


	render() {
		const { eye, center } = this.camera;
		let distToWater       = eye[1] - Params.seaLevel;
		const eyeRef          = [eye[0], eye[1] - distToWater * 2.0, eye[2]];
		distToWater           = center[1] - Params.seaLevel;
		const centerRef       = [center[0], center[1] - distToWater * 2.0, center[2]];
		this.cameraReflection.lookAt(eyeRef, centerRef);


		Params.clipY = Params.seaLevel;

		GL.clear(0, 0, 0, 0);
		
		this._fboReflection.bind();
		GL.clear(0, 0, 0, 0);
		Params.clipDir = -1;
		GL.setMatrices(this.cameraReflection);
		this._renderScene();
		this._fboReflection.unbind();

		Params.clipY = 999;
		Params.clipDir = 1;
		GL.setMatrices(this.camera);
		this._renderScene(true);

		const size = 256;
		GL.viewport(0, 0, size, size/GL.aspectRatio);
		// this._bCopy.draw(this._fboReflection.getTexture());
	}


	_renderScene(withWater=false) {
		this._bSky.draw(this._textureStar);
		if(withWater) {
			this._vWater.render(this._fboReflection.getTexture());	
		}
		this._vTerrain.render(this._textureRad, this._textureIrr);
		
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;