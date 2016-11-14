// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewLine from './ViewLine';
import PointsManager from './PointsManager';
import Controller from './controller'


class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 10;
	}

	_initTextures() {
		console.log('init textures');
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
