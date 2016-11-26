// SubsceneLines.js
import Controller from './controller/controller'
import ViewDear from './views/viewsAnimals/ViewDear'
import LinesManager from './managers/LinesManager'


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
			[0, -3, -0],
			[-15, -3, 15],
			[15, -3, 15],
			[15, -3, -15],
			// [0, -5, -0],
			// [0, -5, -0],
			// [0, -5, -0],
		]

		this.controller = new Controller(this);

		// just a dear
		// this._viewDear = new ViewDear();
		this.animals = [];
		for (var i = 0; i < this._spots.length; i++) {
			let vDear = new ViewDear()
			// vDear.reset(this._spots[3])
			vDear.reset([this._spots[i][0], -1, this._spots[i][2]])
			// vDear.reset([this._spots[3][0], -1, this._spots[3][2]])

			this.animals.push(vDear);
		}


		this.linesManager = new LinesManager();

		for (var i = 0; i < 6; i++) {
			this.linesManager.addLine();
		}

		// this._vLine = new ViewLine(this);
		// this._vLine.alpha = .3 + Math.random() * .5

	}

	pause(){
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
		this.linesManager.moveTo(this._spots[this._step % this._spots.length], this.animals[this._step % this.animals.length])
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
