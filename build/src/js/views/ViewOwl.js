// ViewOwl.js


import alfrid, { GL } from 'alfrid';
import Line from '../geom/Line'
import Owl from '../animals/Owl'
import vs from '../../shaders/line_owl.vert';
import fs from '../../shaders/line_owl.frag';
// import vs from '../../shaders/line.vert';
// import fs from '../../shaders/line_end.frag';
// import Easings from '../libs/Easings';

class ViewOwl extends alfrid.View {

	constructor(app) {
		super(vs, fs);

    this.app = app;
		this.alpha = 1;

		this.isPaused = false;
		this.app = app;
		this._tick = 0;



	}


	_init() {

    this.ratio = 0;
    this.alpha = 0;

    this.owl = new Owl();
    this.lines = [];

    for (var i = 0; i < this.owl.finalLines.length; i++) {
      let l = new Line(this.owl.finalLines[i]);
  		// this.line.points = this.points;
      this.lines.push(l);
    }

	}


	drawEyes() {

    let eyes = this.owl.eyes;

    this.app._vEyeLeft.slowMode();
    this.app._vEyeRight.slowMode();

		this.app._vEyeLeft._finalPosition[0] = eyes[0][0];
		this.app._vEyeLeft._finalPosition[1] = -eyes[0][1];
		this.app._vEyeLeft._finalPosition[2] = -eyes[0][2];
    this.app._vEyeLeft.prepare(true);
		this.app._vEyeLeft.show();

  	this.app._vEyeRight._finalPosition[0] = eyes[1][0];
		this.app._vEyeRight._finalPosition[1] = -eyes[1][1];
		this.app._vEyeRight._finalPosition[2] = -eyes[1][2];
		this.app._vEyeRight.prepare(true);
    this.app._vEyeRight.show();

  }

	render() {
		this._tick+= .1 * (window.hasVR ? .66 : 1);

		let canUpdate = (this.tickRender++ % 2 == 0);

		if(canUpdate){
			if(Easings.instance.tweens.length){
				Easings.instance.update();
			}
			this.update();
		}

		this.shader.bind();

		this.shader.uniform("ratio", "float", this.ratio);
		this.shader.uniform("thickness", "float", .2);
		this.shader.uniform("alpha", "float", this.alpha);
		this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
		this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

    for (var i = 0; i < this.lines.length; i++) {
      GL.draw(this.lines[i]);
    }


	}
}

export default ViewOwl;
