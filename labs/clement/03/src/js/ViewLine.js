// ViewLine.js


import alfrid, { GL } from 'alfrid';
import glmatrix from './libs/gl-matrix';

import Perlin from './libs/Perlin'
import Line from './geom/Line'
import Dear from './animals/Dear'
import Spline from './libs/Spline';
import vs from '../shaders/line.vert';
import fs from '../shaders/line.frag';
import Easings from './libs/Easings';

const STATES = {
	wandering: 0,
	muting: 1,
}
let tempArray = [];
class ViewLine extends alfrid.View {

	constructor(app) {
		super(vs, fs);

		this.app = app;
		this.time = Math.random() * 0xFF;

		this.mainSpeed = 1;

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
		// this.dear = new Dear();
		this.spline = new Spline([]);

		this.state = STATES.wandering;
    this.points = []
		const max = 30//Math.floor(Math.random() * 5) + 10;
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



		// if(this.state === STATES.muting){
		// 	if(!this.beenInside){
		//
		// 		this.beenInside = true;
		// 		for (var i = 0; i < line.points.length; i++) {
		// 			var dearIndex = this.target.finalP.length / (this.target.dear.vertices.length) *  (this.target.dear.vertices.length - i - 1)// 4 is hardcoded but correspond to the sub points of the dear spline
		// 			line.points[i][0] = this.target.finalP[dearIndex][0];
		// 			line.points[i][1] = this.target.finalP[dearIndex][1];
		// 			line.points[i][2] = this.target.finalP[dearIndex][2];
		// 		}
		//
		// 		var pts = this.getPoints(line.points);
		// 		return pts
		// 	}
		// }
		// else
		if(this.state === STATES.muting){

			// console.log(line.points.length);
			var pt0 = line.points[this.currentPointToFollowIndex];

			if(!pt0) {
				var pts = this.getPoints(line.points);
				return pts
			}
	    pt0[0] += (this.targetPoint[0] - pt0[0]) * 0.4 * this.mainSpeed;
	    pt0[2] += (this.targetPoint[2] - pt0[2]) * 0.4 * this.mainSpeed;
	    pt0[1] += (this.targetPoint[1] - pt0[1]) * 0.2 * this.mainSpeed;

			var dist = glmatrix.vec3.distance(pt0, this.targetPoint);
			if(dist < .01){
				// var dearIndex = this.target.finalP.length / 4 *  (this.target.dear.vertices.length - 1 - this.currentPointToFollowIndex)// 4 is hardcoded but correspond to the sub points of the dear spline
				var dearIndex = this.target.finalP.length / (this.target.dear.vertices.length) *  (this.target.dear.vertices.length - this.currentPointToFollowIndex - 1)// 4 is hardcoded but correspond to the sub points of the dear spline

				// console.log(this.target.finalP.length / (this.target.dear.vertices.length), this.target.dear.vertices.length - this.currentPointToFollowIndex - 1);
				// this.arrayCorrespondance[this.currentPointToFollowIndex] = {
				// 	obj: pt0,
				//
				// }


				// line.points[this.currentPointToFollowIndex] = this.target.finalP[dearIndex];

				// console.log(this.currentPointToFollowIndex, dearIndex, this.target.finalP[dearIndex]);
				// console.log("----> ", line.points[this.currentPointToFollowIndex], this.target.finalP[dearIndex]);
				// line.points[this.currentPointToFollowIndex][0] = this.target.finalP[dearIndex][0];
				// line.points[this.currentPointToFollowIndex][1] = this.target.finalP[dearIndex][1];
				// line.points[this.currentPointToFollowIndex][2] = this.target.finalP[dearIndex][2];

				// console.log(dearIndex);

				console.log(this.currentPointToFollowIndex, dearIndex);

				var obj = {
					line:line,
					currentIndex:this.currentPointToFollowIndex,
					lineIndex: 0
				}
				Easings.instance.to(obj, 1 * (1 - (this.currentPointToFollowIndex / line.points.length-1))   , {
					lineIndex: dearIndex,
					ease: Easings.instance.easeOutCirc,
					onUpdate: ()=> {
						let floorIndex = Math.floor(obj.lineIndex);

						// console.log(obj.currentIndex, floorIndex);
						if(obj.currentIndex === 0){

						}
						obj.line.points[obj.currentIndex][0] = this.target.finalP[floorIndex][0]
						obj.line.points[obj.currentIndex][1] = this.target.finalP[floorIndex][1]
						obj.line.points[obj.currentIndex][2] = this.target.finalP[floorIndex][2]
					}
				});

				this.currentPointToFollowIndex++;

				// get correspondant index in the target
			}
			// else {
				// for the points which didnt reach the target
				for (var i = this.currentPointToFollowIndex + 1; i < line.points.length; i++) {
					line.points[i][0] += (line.points[i-1][0] - line.points[i][0]) * .9 * this.mainSpeed;
					line.points[i][1] += (line.points[i-1][1] - line.points[i][1]) * .9 * this.mainSpeed;
					line.points[i][2] += (line.points[i-1][2] - line.points[i][2]) * .9 * this.mainSpeed;
				}

			// }

			var pts = this.getPoints(line.points);
			return pts
			//
		}
		else {

			var pt0 = line.points[0];

	    pt0[0] += (this.targetPoint[0] - pt0[0]) * 0.4 * this.mainSpeed;
	    pt0[2] += (this.targetPoint[2] - pt0[2]) * 0.4 * this.mainSpeed;
	    pt0[1] += (this.targetPoint[1] - pt0[1]) * 0.2 * this.mainSpeed;

			for (var i = 1; i < line.points.length; i++) {
				line.points[i][0] += (line.points[i-1][0] - line.points[i][0]) * .4 * this.mainSpeed;
				line.points[i][1] += (line.points[i-1][1] - line.points[i][1]) * .4 * this.mainSpeed;
				line.points[i][2] += (line.points[i-1][2] - line.points[i][2]) * .4 * this.mainSpeed;
			}
			var pts = this.getPoints(line.points);
			return pts
		}

		return false
		// console.log(pts);
	}


  getPoints(pts){
    this.spline.points = pts;
    tempArray.length = 0;
    let index, n_sub = 4;

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

		if(this.state === STATES.wandering){

			if(this.app.controller.spacePressed && !this.spacePressed){
				this.spacePressed = true;
				// this.changeMotion();
				// this.changeMotion();
			}
			else if(!this.app.controller.spacePressed){
				this.spacePressed = false;
			}

			this.time += 1 * this.speed * this.mainSpeed;
			this.motions[this.indexMotion]();

			if(this.targetPoint[1] > 0) this.targetPoint[1] = 0;
		}
		else {
			this.targetPoint[0] = this.target.dear.vertices[0][0];
			this.targetPoint[1] = this.target.dear.vertices[0][1];
			this.targetPoint[2] = this.target.dear.vertices[0][2];
		}

	}

	transformTo(target){
		this.arrayCorrespondance = []
		this.currentPointToFollowIndex = 0;
		this.mainSpeed = .4;
		this.state = STATES.muting;


		this.target = target; // harcoded for now

		let nbPointsTarget = this.target.finalP.length/4;

		if(this.line.points.length < nbPointsTarget){
			var diff = nbPointsTarget - this.line.points.length;

			let lastP1 = this.line.points[this.line.points.length-1];
			let lastP2 = this.line.points[this.line.points.length-2];


			let sub = [];
			glmatrix.vec3.subtract(sub, lastP2, lastP1)
			let dir = [];
			glmatrix.vec3.normalize(dir, sub);
			let dist = glmatrix.vec3.distance(lastP1, lastP2)

			for (var i = 0; i < diff; i++) {
				var addPt = [];
				var mult = [];

				var direction = [
					dir[0] * dist/diff * i,
					dir[1] * dist/diff * i,
					dir[2] * dist/diff * i,
				]
				glmatrix.vec3.add(addPt, lastP1, direction);

				// console.log(addPt);
				// console.log(addPt);
				this.line.points.push(addPt);

				this.needsUpdate = true;
			}
		}
		else if(this.line.points.length > nbPointsTarget) {
			this.line.points.slice(0, nbPointsTarget-1);
			this.needsUpdate = true;
		}
		else {
			this.needsUpdate = false;
		}

		// console.log(this.line.points.length, nbPointsTarget);
	}

	render() {

		if(!this.ready) return;

		Easings.instance.update();



		this.shader.bind();
    this.shader.uniform("texture", "uniform1i", 0);

		this.shader.uniform("alpha", "float", .8);
    this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

		this.update();
		var pts = this.newPoints(this.line);

		if(pts){
			this.line.render(pts, this.needsUpdate);
		}



		GL.draw(this.line);

		if(this.needsUpdate){
			this.needsUpdate = false;
		}
	}


}

export default ViewLine;
