// SubsceneLines.js
import Controller from './controller/controller'
import ViewDear from './views/ViewDear'
import ViewLine from './views/ViewLine'


class SubsceneLines {
	constructor(mScene) {
		this._scene = mScene;
		this._initTextures();
		this._initViews();
	}

	_initTextures() {

	}

	_initViews() {

		this.controller = new Controller(this);

		// just a dear
		this._viewDear = new ViewDear();


		this.lines = [];

		for (var i = 0; i < 4; i++) {
			var l = new ViewLine(this);
			l.alpha = .3 + Math.random() * .5
			this.lines.push(l);
		}

		// this._vLine = new ViewLine(this);
		// this._vLine.alpha = .3 + Math.random() * .5

	}

	pause(){
		this._vLine.pause();

	}

	onClick(pt){
    // console.log(pt);
		// this._pointsManager.addPoint(pt)
  }

	undraw(){
		this.l.undraw();
	}

	transform(){
		// console.log(this._scene);
		// this._scene.orbitalControl.rx.value = 0;
		// this._scene.orbitalControl.ry.value = 0;
		this.l = this.lines[Math.floor(Math.random() * this.lines.length)]
		// this._vLine.transformTo(this._viewDear);
		this.l.transformTo(this._viewDear);
	}

	update() {

	}

	render() {
		this.controller.update();

		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i].render();
		}
		// this._vLine.render();
		// this._viewDear.render();
	}
}

export default SubsceneLines;
