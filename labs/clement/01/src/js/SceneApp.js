// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewTest from './ViewTest';
import ViewNoise from './ViewNoise';
import ViewTerrain from './ViewTerrain';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();


		this._vTest = new ViewTest();
		this._vNoise = new ViewNoise();
		this._vTerrain = new ViewTerrain();

		this._fbo = new alfrid.FrameBuffer(512, 512);
	}


	render() {
		// this.orbitalControl.ry.value += 0.01;
		GL.clear(0, 0, 0, 0);
		// this._bAxis.draw();
		// this._bDots.draw();

		// this._vTest.render();
		// this._vNoise.render();

		this._fbo.bind();
		GL.clear(0, 0, 0, 0);
		this._vNoise.render();
		this._fbo.unbind();

		this._vTerrain.render(this._fbo.getTexture());


		const size = 300;
		GL.viewport(0, 0, 300, 300);
		this._bCopy.draw(this._fbo.getTexture());
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;