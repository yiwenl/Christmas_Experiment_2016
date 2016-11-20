// ViewPoints.js


import alfrid, { GL } from 'alfrid';

import PtLine from './geom/PtLine';
// import vs from '../shaders/line.vert';
// import fs from '../shaders/line.frag';

let tempArray = [];
class PointsManager {

	constructor(app) {

    this.app = app;
		// super(vs, fs);
		this.time = Math.random() * 0xFF;

    this._init();
	}


	_init() {
    this.points = []
	}


	addPoint(pos) {
    var position = [];

    if(pos.x > window.innerWidth/2){
      position[0] = (pos.x - window.innerWidth/2) / window.innerWidth/2 * this.app.orbitalControl.radius.value * 2;
    }
    else {
      position[0] = window.innerWidth/2 - (window.innerWidth/2 + pos.x) / window.innerWidth/2 * this.app.orbitalControl.radius.value;
    }

    // var x = ((window.innerWidth/2 - pos.x)) / window.innerWidth/2;
    var y = ((window.innerHeight/2 - pos.y)) / window.innerHeight/2

    position[1] = y;
    console.log(position);
    var pt = new PtLine(position);
    this.points.push(pt);
  }

	update() {
    // this.update();

		this.time += 0.01;

		for (var i = 0; i < this.points.length; i++) {
		  this.points[i].render();
		}
		// GL.draw(this.line);
	}


}

export default PointsManager;
