// ViewAnimal.js


import alfrid, { GL } from 'alfrid';


import Line from '../../geom/Line'
import Dear from '../../animals/Dear'
import Spline from '../../libs/Spline';
import vs from '../../../shaders/line.vert';
import fs from '../../../shaders/line.frag';

let tempArray = [];
class ViewAnimal extends alfrid.View {

	constructor(vs, fs, pos) {
		super(vs, fs);
		this.pos = pos;

		console.log("0-----", this.pos);
		// this.shape = new Dear();

		this.time = Math.random() * 0xFF;

    this.totalPts = [];
	}


	_init() {

	}

	reset(pos){
		this.pos = pos;

		this.points = []
    this.spline = new Spline([]);
		this.tick = 0;
    this.finalP = this.getPoints(this.shape.getPoints());
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

    this.totalPts = array;

    return array;
  }

	update(points) {
	}

	render() {
    if(!this.ready) return;

		this.time += 0.01;

		this.shader.bind();

    this.shader.uniform("alpha", "float", .6);
    this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);
		GL.draw(this.line);
	}


}

export default ViewAnimal;
