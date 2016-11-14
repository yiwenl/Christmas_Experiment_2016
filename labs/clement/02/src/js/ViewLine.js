// ViewLine.js


import alfrid, { GL } from 'alfrid';
import glmatrix from './libs/gl-matrix';

import Perlin from './libs/Perlin'
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

		this.perlin = new Perlin.Noise(Math.random());

	}


	_init() {
		this.dear = new Dear();
		this.spline = new Spline([]);

    this.points = []
		for (var i = 0; i < 10; i++) {
			this.points.push([0,0,0])
		}

		this.line = new Line(this.getPoints(this.points));
		this.line.points = this.points;


		this.tick = 0;


		this.radius = 5;
		this.targetPoint = [0,0,0];

		this.xoff = Math.random() * 100;
		this.yoff = Math.random() * 100;

		// GUI.add(this.radius, 0, 10)
		gui.add(this, 'radius', -10, 10);
		// console.log(gui);

	}



  newPoints(line){
		var pt0 = line.points[0];

    pt0[0] += (this.targetPoint[0] - pt0[0]) * 0.3;
    pt0[2] += (this.targetPoint[2] - pt0[2]) * 0.3;

		// pt0[0] = this.targetPoint[0]
    // pt0[2] = this.targetPoint[2]
    pt0[1] += (this.targetPoint[1] - pt0[1]) * 0.1;


    for (var i = 1; i < line.points.length; i++) {
      // var dir = Matrices.normalize(Matrices.subtractVectors(line.points[i], line.points[i-1]));

			let dir = [];
			glmatrix.vec3.normalize(dir, glmatrix.vec3.sub(dir, line.points[i], line.points[i-1]));

			let r = Math.min(this.radius/4, 1);
      line.points[i][0] = line.points[i-1][0] + dir[0] * r;
      line.points[i][1] = line.points[i-1][1] + dir[1] * r;
      line.points[i][2] = line.points[i-1][2] + dir[2] * r;
    }

    return this.getPoints(line.points)
	}


  getPoints(pts){
    this.spline.points = pts;
    tempArray.length = 0;
    let index, n_sub = 3;

    var array = []
    for (let i = 0; i < pts.length * n_sub; i ++ ) {
			index = i / ( pts.length * n_sub );
      array.push(this.spline.getPoint( index ));
		}

    return array;
  }


	update() {
		this.time += 1;

		this.targetPoint[0] = Math.cos(this.time/20) * this.radius;
		this.targetPoint[2] = Math.sin(this.time/20) * this.radius;

		this.xoff += .01;
		this.yoff += .01;

		var p = this.perlin.perlin2(this.xoff, this.yoff)
		this.targetPoint[1] += p/20;
		this.targetPoint[1] += Math.sin(Math.tan(Math.cos(this.time/80) * 1.2)) * .01;

		if(this.targetPoint[1] > 0) this.targetPoint[1] = 0;
	}


	render() {
    this.update();


		this.shader.bind();
    this.shader.uniform("texture", "uniform1i", 0);

    this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

		var pts = this.newPoints(this.line);

		this.line.render(pts);
		GL.draw(this.line);
	}


}

export default ViewLine;
