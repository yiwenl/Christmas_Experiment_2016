// SubsceneLines.js
import Sono from 'sono';
import Controller from './controller/controller'
import ViewDear from './views/viewsAnimals/ViewDear'
import ViewWolf from './views/viewsAnimals/ViewWolf'
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

		this.lightSound.play();
		// setTimeout(()=>{
			// this.pause()
		// }, 2000)

		this.controller = new Controller(this);

		// just a dear
		// this._viewDear = new ViewDear();
		this.animals = [];

		for (var i = 0; i < CameraStops.length; i++) {
			// CameraStops[i]
			let vDear = new ViewWolf()
			// console.log([CameraStops[i].x * Params.terrainSize/2, -1, CameraStops[i].z * Params.terrainSize/2]);
			// vDear.rotateX(CameraStops[i].rx);
			// vDear.rotateY(CameraStops[i].ry);
			vDear.reset([0,-1,0], CameraStops[i].rx, CameraStops[i].ry)

			this.animals.push(vDear);
		}
		// }


		this.linesManager = new LinesManager();

		for (var i = 0; i < 7; i++) {
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
	}

	render(pos) {

		this.controller.update();

		this.linesManager.update(pos);

		let d = this.linesManager.dist;

		if(d < 10) d= 10;
		if(d > 200) d= 200;
		let volume = this.map(d, 10, 200, 1, 0)
		this.volume = volume;
		this.volume = 0;
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
