// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewLine from './ViewLine';
import PointsManager from './PointsManager';
import Controller from './controller'
import ViewDear from './ViewDear'


class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.7;
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

		this._viewDear = new ViewDear();
		this.lines = [];

		for (var i = 0; i < 4; i++) {
			var l = new ViewLine(this);
			l.alpha = .3 + Math.random() * .5
			this.lines.push(l);
		}
		this._vLine = new ViewLine(this);
		this._vLine.alpha = .3 + Math.random() * .5
		// this._pointsManager = new PointsManager(this);


		// this.controller.



	}

	pause(){
		this._vLine.pause();

	}
	transform(){
		console.log("TRASNFROM");
		this.orbitalControl.rx.value = 0;
		this.orbitalControl.ry.value = 0;
		this._vLine.transformTo(this._viewDear);
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
		this._vLine.render();
		this._viewDear.render();
		// this._pointsManager.update();
		// this._vNoise.render();


	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;
