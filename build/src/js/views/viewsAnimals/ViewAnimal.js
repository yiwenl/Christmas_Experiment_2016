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
		this.rotation = 0;
	}

	rotateX(rx){
		this.shape.rotateX(rx);
	}

	rotateY(ry){
		this.shape.rotateY(ry);
	}

	reset(pos, rx = 0, ry = 0){
		this.sub = GL.isMobile ? 2 : 6;
		this.pos = pos;

		// this.shape.rotateX(rx);
		this.shape.rotateY(ry);

		this.points = []
    this.spline = new Spline([]);
		this.tick = 0;
    this.finalP = this.getPoints(this.shape.getPoints());
    this.line = new Line(this.finalP);
	}

	updatePos(pos, rx = 0, ry = 0, debug){
		this.pos = pos;
		this.shape.rotateY(ry);

		// this.points = []
    // this.spline = new Spline([]);
		// this.tick = 0;
    this.finalP = this.getPoints(this.shape.getPoints());
    // this.line = new Line(this.finalP);

	}

  getPointsWithPos(pt){
		var array = [];
		let index= 0;
		for (var i = 0; i < this.finalP.length; i++) {
			array[index++] = [this.finalP[i][0] + pt[0], this.finalP[i][1] + pt[1], this.finalP[i][2] + pt[2]];
		}

		return array;
	}

  getPoints(pts){
    this.spline.points = pts;
    tempArray.length = 0;
    let index;

    var array = []
    for (let i = 0; i < pts.length * this.sub; i ++ ) {
			index = i / ( pts.length * this.sub );
      array.push(this.spline.getPoint( index ));
		}

    this.totalPts = array;

    return array;
  }

	update(points) {
	}

	render() {
     return;

		this.time += 0.01;

		this.shader.bind();

    this.shader.uniform("alpha", "float", .6);
    this.shader.uniform("thickness", "float", .5);
    this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);


		if(this.needsUpdate){
			this.needsUpdate = false;
			// console.log(this.finalP);
			this.line.render(this.finalP, true);
		}

		GL.draw(this.line);
	}


}

export default ViewAnimal;
