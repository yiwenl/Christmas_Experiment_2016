// SubsceneLines.js
import Controller from './controller/controller'
import ViewDear from './views/viewsAnimals/ViewDear'
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
		this._spots = [
			// [0, -2, -0],
			// [-15, -2, 15],
			// [15, -2, 15],
			// [15, -2, -15],
			[0, -5, -0],
			[0, -5, -0],
			[0, -5, -0],
			[0, -5, -0],
		]

		// setTimeout(()=>{
			// this.pause()
		// }, 2000)

		this.controller = new Controller(this);

		// just a dear
		// this._viewDear = new ViewDear();
		this.animals = [];

		for (var i = 0; i < CameraStops.length; i++) {
			// CameraStops[i]
			let vDear = new ViewDear()
			// console.log([CameraStops[i].x * Params.terrainSize/2, -1, CameraStops[i].z * Params.terrainSize/2]);
			vDear.reset([0,-1,0])

			this.animals.push(vDear);
		}
		// for (var i = 0; i < this._spots.length; i++) {
		// }


		this.linesManager = new LinesManager();

		for (var i = 0; i < 7; i++) {
			this.linesManager.addLine();
		}

		// this._vLine = new ViewLine(this);
		// this._vLine.alpha = .3 + Math.random() * .5

	}

	goTo(pt){
		// say the lines to all move to pt ! Second paramater is the animal to draw
		this.linesManager.moveTo(pt, this.animals[this._step % this.animals.length])
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
		// this.linesManager.draw(this.animals[this._step % this.animals.length]);
		// this.linesManager.moveTo(this._spots[this._step % this._spots.length], this.animals[this._step % this.animals.length])
		this._step++
	}

	update() {

	}

	render() {
		this.controller.update();

		this.linesManager.update();
		// this._vLine.render();
		// this._viewDear.render();
	}
}

export default SubsceneLines;
