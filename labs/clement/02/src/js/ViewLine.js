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

	constructor(app) {
		super(vs, fs);

		this.app = app;
		this.time = Math.random() * 0xFF;

		this.perlin = new Perlin.Noise(Math.random());

		this.ready = false;

		var image = new Image();
	  image.src = "./assets/img/stroke3.png";
	  image.onload = function() {
			this.ready = true;

			var texture = GL.gl.createTexture();
			GL.gl.bindTexture(GL.gl.TEXTURE_2D, texture);

			// Set the parameters so we can render any size image.
			GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_S, GL.gl.CLAMP_TO_EDGE);
			GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_T, GL.gl.CLAMP_TO_EDGE);
			GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MIN_FILTER, GL.gl.NEAREST);
			GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MAG_FILTER, GL.gl.NEAREST);

			// Upload the image into the texture.
			GL.gl.texImage2D(GL.gl.TEXTURE_2D, 0, GL.gl.RGBA, GL.gl.RGBA, GL.gl.UNSIGNED_BYTE, image);
	  }.bind(this)

	}


	_init() {
		this.dear = new Dear();
		this.spline = new Spline([]);

    this.points = []
		const max = Math.floor(Math.random() * 5) + 10;
		for (var i = 0; i < max; i++) {
			this.points.push([0,0,0])
		}

		this.line = new Line(this.getPoints(this.points));
		this.line.points = this.points;


		this.tick = Math.random() * Math.PI*2 * 100;

		this.startAngle = Math.random() * Math.PI*2;


		this.radius = Math.floor(Math.random() * 3) + 2;
		this.targetPoint = [0,0,0];

		this.xoff = Math.random() * 100;
		this.yoff = Math.random() * 100;

		// GUI.add(this.radius, 0, 10)
		// gui.add(this, 'radius', -10, 10);
		this.motions = [this.circle.bind(this), this.snake.bind(this)];
		this.indexMotion = Math.floor(Math.random() * this.motions.length);

		this.speed = .5 + Math.random();

		if(Math.random() > .5){
			this.speed *= -1;
		}
		// console.log(gui);

	}

	newPoints(line){
		var pt0 = line.points[0];

    pt0[0] += (this.targetPoint[0] - pt0[0]) * 0.4;
    pt0[2] += (this.targetPoint[2] - pt0[2]) * 0.4;

		// pt0[0] = this.targetPoint[0]
    // pt0[2] = this.targetPoint[2]
    pt0[1] += (this.targetPoint[1] - pt0[1]) * 0.2;


    for (var i = 1; i < line.points.length; i++) {
      // var dir = Matrices.normalize(Matrices.subtractVectors(line.points[i], line.points[i-1]));

			let dir = [];
			// glmatrix.vec3.normalize(dir, glmatrix.vec3.sub(dir, line.points[i], line.points[i-1]));

			// let r = Math.min(this.radius/8, 1);
			let r = Math.min(this.radius/4, 1);


			line.points[i][0] += (line.points[i-1][0] - line.points[i][0]) * .4;
      line.points[i][1] += (line.points[i-1][1] - line.points[i][1]) * .4;
      line.points[i][2] += (line.points[i-1][2] - line.points[i][2]) * .4;

      // line.points[i][0] = line.points[i-1][0] + dir[0] * r;
      // line.points[i][1] = line.points[i-1][1] + dir[1] * r;
      // line.points[i][2] = line.points[i-1][2] + dir[2] * r;
    }

    return this.getPoints(line.points)
	}


  getPoints(pts){
    this.spline.points = pts;
    tempArray.length = 0;
    let index, n_sub = 1.2;

    var array = []
    for (let i = 0; i < pts.length * n_sub; i ++ ) {
			index = i / ( pts.length * n_sub );
      array.push(this.spline.getPoint( index ));
		}

    return array;
  }

	circle(){
		this.targetPoint[0] = Math.cos(this.time/20 + this.startAngle) * this.radius;
		this.targetPoint[2] = Math.sin(this.time/20 + this.startAngle) * this.radius;

		this.xoff += .01;
		this.yoff += .01;

		var p = this.perlin.perlin2(this.xoff, this.yoff)
		this.targetPoint[1] += p/20;
		this.targetPoint[1] += Math.sin(Math.tan(Math.cos(this.time/80 +this.startAngle) * 1.2)) * .01;

	}

	snake(){
		this.targetPoint[0] = Math.cos(this.time/40 + this.startAngle) * this.radius;
		this.targetPoint[2] = Math.sin(this.time/50 + this.startAngle) * this.radius * 1.2 ;


		// var p = this.perlin.perlin2(this.xoff, this.yoff)
		// this.targetPoint[1] += p/20;
		// this.targetPoint[1] += Math.cos(this.time/10) * 1;
		// this.targetPoint[1] += Math.cos(Math.sin(this.time/100) * Math.tan(3.14 * this.time/200) * Math.PI/8) * 1;
		this.targetPoint[1] = - Math.abs(Math.sin(this.time / 100) * 4) - 2;
		this.targetPoint[0] += Math.cos(Math.pow(8, Math.sin(this.time/40 + this.startAngle))) * .5;
		this.targetPoint[1] += Math.sin(Math.pow(8, Math.sin(this.time/20 + this.startAngle))) * 1;
	}

	changeMotion() {
		this.targetPoint[0] = 0;
		this.targetPoint[1] = 0;
		this.targetPoint[2] = 0;

		this.indexMotion++;
		this.indexMotion %= this.motions.length;

	}
	update() {

		if(this.app.controller.spacePressed && !this.spacePressed){
			this.spacePressed = true;
			this.changeMotion();
		}
		else if(!this.app.controller.spacePressed){
			this.spacePressed = false;
		}

		this.time += 1 * this.speed;

		// if(this.motions[this.indexMotion]){
		// this.snake()
			this.motions[this.indexMotion]();
		// }
		// this.snake();

		if(this.targetPoint[1] > 0) this.targetPoint[1] = 0;

	}


	render() {

		if(!this.ready) return;



		this.shader.bind();
    this.shader.uniform("texture", "uniform1i", 0);

    this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);
		// if(!this.neverWent){
			this.neverWent = true;
			this.update();
			var pts = this.newPoints(this.line);
			this.line.render(pts);
		// }


		GL.draw(this.line);
	}


}

export default ViewLine;
