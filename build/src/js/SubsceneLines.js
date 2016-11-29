// SubsceneLines.js
import alfrid, { GL } from 'alfrid';

import Sono from 'sono';
import Controller from './controller/controller'
import ViewDear from './views/viewsAnimals/ViewDear'
import ViewBoar from './views/viewsAnimals/ViewBoar'
import ViewFox from './views/viewsAnimals/ViewFox'
import ViewBat from './views/viewsAnimals/ViewBat'
import ViewBear from './views/viewsAnimals/ViewBear'
import ViewWolf from './views/viewsAnimals/ViewWolf'
import ViewRabbit from './views/viewsAnimals/ViewRabbit'
import ViewWeasel from './views/viewsAnimals/ViewWeasel'
import LinesManager from './managers/LinesManager'
import CameraStops from './CameraStops';
import Params from './Params';


class SubsceneLines {
	constructor(mScene) {
		this._scene = mScene;
		this._initTextures();
		this._initViews();


	}

	_initTextures() {

	}

	_initViews() {
		this._step = 0;
		this.cameraPos = [0,0,0];
		this._tick = 0;
		this.lightSound = Sono.createSound({
        src: ["./assets/sounds/light.mp3"],
        volume: 0,
				loop: true
    });


		this._bBall = new alfrid.BatchBall();

		this.lightSound.play();
		// setTimeout(()=>{
			// this.pause()
		// }, 2000)

		this.controller = new Controller(this);

		// just a dear
		// this._viewDear = new ViewDear();
		this.animals = [];

		let shapes = [
			ViewBoar,
			ViewBat,
			ViewFox,
			ViewBear,
			ViewDear,
			ViewWolf,
			ViewRabbit,
			ViewWeasel
		];



		for (var i = 0; i < CameraStops.length + 1; i++) {
			// CameraStops[i]


			let view = new shapes[i % shapes.length];
			
			if(i === CameraStops.length){
				let dataStop = CameraStops[0];
				let _pT = [dataStop.tx * Params.terrainSize/2, dataStop.ty, dataStop.tz * Params.terrainSize/2];
				this._pt = _pT;
				// view.reset([0,0,0], CameraStops[0].rx, CameraStops[0].ry)
				view.reset([_pT[0], -_pT[1], -_pT[2]], CameraStops[0].rx, CameraStops[0].ry)
				this.animals.push(view);
			}
			else {
				let dataStop = CameraStops[i];
				let _pT = [dataStop.tx * Params.terrainSize/2, dataStop.ty, dataStop.tz * Params.terrainSize/2];
				this._pt = _pT;
				// view.reset([0,0,0], CameraStops[i].rx, CameraStops[i].ry)
				view.reset([_pT[0], -_pT[1], -_pT[2]], CameraStops[i].rx, CameraStops[i].ry)
				this.animals.push(view);
			}
		}
		// }


		this.linesManager = new LinesManager();

		for (var i = 0; i < (GL.isMobile ? 3:7); i++) {
			this.linesManager.addLine();
		}

		// this._vLine = new ViewLine(this);
		// this._vLine.alpha = .3 + Math.random() * .5

	}

	goTo(pt, isFinished){
		// say the lines to all move to pt ! Second paramater is the animal to draw
		this.linesManager.moveTo(pt, this.animals[this._step % this.animals.length], isFinished)
		this._step++;
	}

	pause(){
		this.linesManager.pause();
		// this._vLine.pause();
		// this.linesManager.moveTo([-5, -2, 5])
	}

	onClick(pt){
    // console.log(pt);
		// this._pointsManager.addPoint(pt)
  }

	undraw(){
		// this.l.undraw();
		this.linesManager.undraw();
	}

	transform(){
	}

	update(pos) {
		this.lightSound.volume += (this.volume - this.lightSound.volume) * .1;

		if(this.lightSound.volume > 1){
			this.lightSound.volume = 1;
		}
	}

	render(pos) {

		this.controller.update();

		this.linesManager.update(pos);

		let d = this.linesManager.dist;

		if(d < 10) d= 10;
		if(d > 100) d= 100;
		let volume = this.map(d, 10, 100, 1, 0)
		this.volume = volume;
		// this.volume = 0;

		for (var i = 0; i < this.animals.length; i++) {
			this.animals[i].render();

			const pos = [this.animals[i].shape.centerX + this._pt[0], this.animals[i].shape.centerY + this._pt[1], this.animals[i].shape.centerZ + this._pt[2]];
			this._bBall.draw(pos, [.1, .1, .1], [0.2, 0.6, 1.0]);
		}
		// if(this.volume < .02) this.volume = .02;

		// console.log("dist", this.linesManager.dist);
		// this._vLine.render();
		// this._viewDear.render();
	}

	map(val, inputMin, inputMax, outputMin, outputMax){
        return ((outputMax - outputMin) * ((val - inputMin)/(inputMax - inputMin))) + outputMin;
    }
}

export default SubsceneLines;
