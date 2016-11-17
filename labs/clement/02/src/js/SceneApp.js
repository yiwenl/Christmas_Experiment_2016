// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewLine from './ViewLine';
import PointsManager from './PointsManager';
import Controller from './controller'
import EffectComposer from './effectComposer/EffectComposer';
import PassBlur from './effectComposer/passes/PassBlur';


class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 10;
		this.orbitalControl.center[1] = 2;
	}

	_initTextures() {
		console.log('init textures');

		this._fboRender = new alfrid.FrameBuffer(GL.width, GL.height);
		const composerSize = 1024;

		this._composer = new EffectComposer(composerSize, composerSize);
		this._passBlur = new PassBlur();
		this._composer.addPass(this._passBlur);
		this._composer.addPass(this._passBlur);
		this._composer.addPass(this._passBlur);
		// this._composer.addPass(this._passBlur);
	}


	_initViews() {
		console.log('init views');
		this.controller = new Controller(this);

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();

		this.lines = [];

		for (var i = 0; i < 8; i++) {
			var l = new ViewLine(this);
			this.lines.push(l);
		}
		// this._vLine = new ViewLine(this);
		// this._pointsManager = new PointsManager(this);



	}

	onClick(pt){
    // console.log(pt);
		// this._pointsManager.addPoint(pt)
  }

	render() {
		this.controller.update();

		GL.clear(0, 0, 0, 0);
		// this._bAxis.draw();

		this._fboRender.bind();
		GL.clear(0, 0, 0, 0);

		this._renderScene();
		this._fboRender.unbind();


		this._composer.render(this._fboRender.getTexture());
		// this._bCopy.draw(this._fboRender.getTexture());
		this._bCopy.draw(this._composer.getTexture());
		
		


	}

	_renderScene() {
		this._bDots.draw();

		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i].render();
		}

		// this._vLine.render();
		// this._pointsManager.update();
		// this._vNoise.render();
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;
