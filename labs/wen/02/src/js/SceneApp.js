// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
// import ViewObjModel from './ViewObjModel';
import ViewTerrain from './ViewTerrain';
import ViewLine from './ViewLine';

window.getAsset = function(id) {
	return assets.find( (a) => a.id === id).file;
}

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		GL.enable(GL.DEPTH_TEST);
		GL.enable(GL.CULL_FACE);
		this.camera.setPerspective(Math.PI/4, GL.aspectRatio, .1, 200);
		this.orbitalControl.radius.value = 7;
		this.orbitalControl.rx.value = 0.3;
		this.orbitalControl.center[1] = 1;
		this.orbitalControl.rx.limit(0, Math.PI/2 - 0.1);
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
	}


	_initViews() {
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();
		this._bSkybox = new alfrid.BatchSkybox();

		this._vTerrain = new ViewTerrain();
		this._vLine = new ViewLine();
	}


	render() {
		GL.clear(0, 0, 0, 0);
		// this._bSkybox.draw(this._textureRad);
		this._bAxis.draw();
		this._bDots.draw();


		// this._bSkybox.draw(this._textureRad);
		this._vTerrain.render(this._textureRad, this._textureIrr);
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;