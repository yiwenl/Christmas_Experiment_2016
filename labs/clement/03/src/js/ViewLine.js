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

		this.alpha = 1;

		this.isPaused = false;
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



		if(this.state === STATES.muting){
			// var dearIndex = this.target.finalP.length / (this.target.dear.vertices.length) *  (this.target.dear.vertices.length - this.currentPointToFollowIndex - 1)// 4 is hardcoded but correspond to the sub points of the dear spline

			// console.log(this.currentPointToFollowIndex, dearIndex);

			// console.log(line.vert.length);
			if(!this.beenInside){
				this.objectsToTween = [];
				this.beenInside = true;

				console.log("this.path.length", this.path.length);
				for (var i = 0; i < line.vert.length; i++) {
				// for (var i = line.vert.length; i >= 0; i--) {

					var startIndex = ( (line.vert.length -1 ) - i)   // 4 is hardcoded but correspond to the sub points of the dear spline

					// console.log("heeeeerererere", startIndex);
					// var endIndex = this.target.finalP.length / (this.target.dear.vertices.length) *  (this.target.dear.vertices.length - i - 1) + this.nbToAdd // 4 is hardcoded but correspond to the sub points of the dear spline
					var endIndex =  (this.path.length - 1) - i  // 4 is hardcoded but correspond to the sub points of the dear spline


					if(i === 0) console.log(startIndex, endIndex);



					var obj = {
						startIndex: startIndex,
						endIndex: endIndex,
						currentIndex: startIndex
					}

					var o = Easings.instance.returnVariable(obj, 1 + .1, {
						currentIndex: endIndex
					});

					o.point = startIndex;

					// if(i == line.vert.length - 1)
					this.objectsToTween.push(o);

					// Easings.instance.to(obj, 2, {
					// 	currentIndex: endIndex,
					// 	ease: Easings.instance.easeOutCirc,
					// 	onUpdate: ()=> {
					// 		let floorIndex = Math.floor(obj.currentIndex);
					//
					// 		console.log(obj.random);
					// 		if(obj.ind === 0){
					// 			console.log(obj.startIndex, obj.endIndex);
					//
					// 		}
					// 		obj.point[0] = this.path[floorIndex][0]
					// 		obj.point[1] = this.path[floorIndex][1]
					// 		obj.point[2] = this.path[floorIndex][2]
					// 	}
					// });



				}
			}

		}
		// if(this.state === STATES.muting){
		// 	if(!this.beenInside){
		//
		// 		this.beenInside = true;
		// 		for (var i = 0; i < line.points.length; i++) {
		// 			var dearIndex = this.target.finalP.length / (this.target.dear.vertices.length) *  (this.target.dear.vertices.length - i - 1)// 4 is hardcoded but correspond to the sub points of the dear spline
		// 			line.points[i][0] = this.path[dearIndex + this.nbToAdd][0];
		// 			line.points[i][1] = this.path[dearIndex + this.nbToAdd][1];
		// 			line.points[i][2] = this.path[dearIndex + this.nbToAdd][2];
		// 		}
		//
		// 		var pts = this.getPoints(line.points);
		// 		return pts
		// 	}
		// }
		else if(this.state === 10000){
		// if(this.state === STATES.muting){

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
    let index, n_sub = 6;

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

		Easings.instance.to(this, 1, {
			alpha: 1,
			ease: Easings.instance.easeOutCubic
		});
		
		this.arrayCorrespondance = []
		this.currentPointToFollowIndex = 0;
		this.mainSpeed = .4;
		this.state = STATES.muting;


		this.target = target;

		let nbPointsTarget = this.target.finalP.length/ 6 ; // harcoded for now, 4 the nuber of points between each vertices

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


		// NOW DEFINE THE TOTAL PATH FROM THE LAST LINE POINTS TO THE LAST TARGET POINT

		this.path = [];

		this.line.vert = this.getPoints(this.line.points)
		let pathLine = this.line.vert.slice();
		// pathLine.reverse();

		// path intermediaire
		let firstPointLine = this.line.points[0];
		let firstPointTarget = this.target.finalP[0];
		let pathToTarget = this.getPoints([firstPointLine, firstPointTarget]);

		let pathTarget = this.target.finalP;

		for (var i = pathLine.length-1; i > -1; i--) {
			// for (var i = 0; i < pathToTarget.length; i++) {
			this.path.push(pathLine[i])
		}

		for (var i = 0; i < pathToTarget.length; i++) {
			this.path.push(pathToTarget[i]);
		}

		for (var i = 0; i < pathTarget.length; i++) {
			this.path.push(pathTarget[i]);
		}
		// this.path = pathLine.concat(pathTarget, pathToTarget);

		// console.log(this.path.length, pathLine.length, pathToTarget.length, pathTarget.length);
		this.nbToAdd = this.path.length - pathToTarget.length - pathTarget.length;

		// console.log("-----------------");
		// console.log(this.line.points.length);

		this.newPoints(this.line)
	}

	pause() {
		this.isPaused = !this.isPaused;
	}
	render() {

		if(!this.ready) return;

		Easings.instance.update();



		this.shader.bind();
    this.shader.uniform("texture", "uniform1i", 0);

		this.shader.uniform("alpha", "float", this.alpha);
    this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

		this.update();

		if(this.isPaused){
			GL.draw(this.line);

			return;
		}
		if(this.state === STATES.wandering){
			var pts = this.newPoints(this.line);

			if(pts){
				this.line.render(pts, this.needsUpdate);
			}
		}
		else {

			for (var i = 0; i < this.objectsToTween.length; i++) {

				let o = this.objectsToTween[i]


				if(!o.delete){

					for (var k = 0; k < o.props.length; k++) {
						var e = o.props[k];

						o.obj[e.var] = this.easeOutCubic(o.currentIteration, e.value, e.toValue - e.value, o.duration);


						let indexFloor = Math.floor(o.obj[e.var]);
						this.line.vert[o.point][0] = this.path[indexFloor][0];
						this.line.vert[o.point][1] = this.path[indexFloor][1];
						this.line.vert[o.point][2] = this.path[indexFloor][2];

						if(i === 0){
							// console.log(o.obj[e.var]);
						}

						// console.log(o.point);
						// console.log(this.path);
					}

					// update
					// if(o.vars.onUpdate){
					// 	o.vars.onUpdate.apply(this, o.vars.onUpdateParams);
					// }

					o.currentIteration += 1;// do something here
					if(o.currentIteration > o.duration){
						// if(o.vars.onComplete){
						// 	o.vars.onComplete.apply(this, o.vars.onCompleteParams);
						// }

						// console.log("here");
						o.delete = true;
					}
				}

			}

			// for (var i = 0; i < this.objectsToTween.length; i++) {
      //   var o = this.objectsToTween[i];
      //   if(o.delete){
      //     o = null;
      //     this.objectsToTween.splice(i, 1);
      //     i--;
      //   }
      // }


			// var pts = this.getPoints(this.line.points);

			// if(pts){
				// console.log(pts);
				this.line.render(this.line.vert, this.needsUpdate);
			// }
		}



		GL.draw(this.line);

		if(this.needsUpdate){
			this.needsUpdate = false;
		}
	}

	easeOutSine(t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	};

	easeLinear(t, b, c, d) {
		t /= d;
		return c*t + b;
	};

	easeOutCubic(t, b, c, d) {
		t /= d;
		t--;
		return c*(t*t*t + 1) + b;
	};


}

export default ViewLine;
