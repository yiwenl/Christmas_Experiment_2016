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
			[813, 68, Math.random() * 100 - 50],
			[788, 157, Math.random() * 100 - 50],
			[725, 167, Math.random() * 100 - 50],
			[667, 149, Math.random() * 100 - 50],
			[670, 106, Math.random() * 100 - 50],
			[709, 66, Math.random() * 100 - 50],
			[745, 77, Math.random() * 100 - 50],
			[762, 126, Math.random() * 100 - 50],
			[743, 214, Math.random() * 100 - 50],
			[697, 245, Math.random() * 100 - 50],
			[649, 242, Math.random() * 100 - 50],
			[607, 197, Math.random() * 100 - 50],
			[588, 109, Math.random() * 100 - 50],
			[578, 39, Math.random() * 100 - 50],
			[572, 39, Math.random() * 100 - 50],
			[519, 200, Math.random() * 100 - 50],
			[534, 251, Math.random() * 100 - 50],
			[764, 386, Math.random() * 100 - 50],
			[810, 364, Math.random() * 100 - 50],
			[813, 297, Math.random() * 100 - 50],
			[752, 292, Math.random() * 100 - 50],
			[715, 330, Math.random() * 100 - 50],
			[707, 414, Math.random() * 100 - 50],
			[709, 595, Math.random() * 100 - 50],
			[709, 595, Math.random() * 100 - 50],
			[660, 504, Math.random() * 100 - 50],
			[575, 453, Math.random() * 100 - 50],
			[493, 448, Math.random() * 100 - 50],
			[433, 471, Math.random() * 100 - 50],
			[394, 561, Math.random() * 100 - 50],
			[372, 604, Math.random() * 100 - 50],
			[372, 604, Math.random() * 100 - 50],
			[347, 438, Math.random() * 100 - 50],
			[289, 367, Math.random() * 100 - 50],
			[303, 287, Math.random() * 100 - 50],
			[350, 249, Math.random() * 100 - 50],
			[435, 246, Math.random() * 100 - 50],
			[495, 361, Math.random() * 100 - 50],
			[473, 481, Math.random() * 100 - 50],
			[448, 531, Math.random() * 100 - 50],
			[446, 580, Math.random() * 100 - 50],
			[456, 607, Math.random() * 100 - 50]
		];

		for (var i = 0; i < pts.length; i++) {
			pts[i][0] /= 300;
			pts[i][1] /= 300;
			pts[i][2] /= 200;
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
