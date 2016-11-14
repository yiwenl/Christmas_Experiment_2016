// ViewLine.js


import alfrid, { GL } from 'alfrid';


import Line from './geom/Line'
import Dear from './animals/Dear'
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
		this.dear = new Dear();

    this.points = []
    this.spline = new Spline([]);



		this.tick = 0;



    this.finalP = this.getPoints(this.dear.getPoints());
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
