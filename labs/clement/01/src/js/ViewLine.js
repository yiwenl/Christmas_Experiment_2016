// ViewLine.js


import alfrid, { GL } from 'alfrid';


import Line from './geom/Line'
import Spline from './libs/Spline';
import vs from '../shaders/line.vert';
import fs from '../shaders/line.frag';

let tempArray = [];
class ViewLine extends alfrid.View {

	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {

    this.points = []
    this.spline = new Spline([]);

    var pts = [
			[813, 68, 0],
			[788, 157, 0],
			[725, 167, 0],
			[667, 149, 0],
			[670, 106, 0],
			[709, 66, 0],
			[745, 77, 0],
			[762, 126, 0],
			[743, 214, 0],
			[697, 245, 0],
			[649, 242, 0],
			[607, 197, 0],
			[588, 109, 0],
			[578, 39, 0],
			[572, 39, 0],
			[519, 200, 0],
			[534, 251, 0],
			[764, 386, 0],
			[810, 364, 0],
			[813, 297, 0],
			[752, 292, 0],
			[715, 330, 0],
			[707, 414, 0],
			[709, 595, 0],
			[709, 595, 0],
			[660, 504, 0],
			[575, 453, 0],
			[493, 448, 0],
			[433, 471, 0],
			[394, 561, 0],
			[372, 604, 0],
			[372, 604, 0],
			[347, 438, 0],
			[289, 367, 0],
			[303, 287, 0],
			[350, 249, 0],
			[435, 246, 0],
			[495, 361, 0],
			[473, 481, 0],
			[448, 531, 0],
			[446, 580, 0],
			[456, 607, 0]
		];

		this.tick = 0;
		for (var i = 0; i < pts.length; i++) {

			this.tick++;

			pts[i][0] /= 300;
			pts[i][1] /= 300;
			pts[i][2] = Math.cos(this.tick);
			pts[i][0] -= 2;
			pts[i][1] -= 2;
		}


    this.finalP = this.getPoints(pts);
    this.line = new Line(this.finalP);





	}



  getPoints(pts){
    this.spline.points = pts;
    tempArray.length = 0;
    let index, n_sub = 6;

    var array = []
    for (let i = 0; i < pts.length * n_sub; i ++ ) {
			index = i / ( pts.length * n_sub );
      array.push(this.spline.getPoint( index ));
		}

    return array;
  }


	update(points) {
    // this.controller.update();
		// const positions = [];

		// this.line.bufferVertex(positions);
	}


	render() {
    // this.update();

		this.time += 0.01;

		this.shader.bind();
    this.shader.uniform("texture", "uniform1i", 0);

    this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);
		GL.draw(this.line);
	}


}

export default ViewLine;
