// ViewLine.js


import alfrid, { GL } from 'alfrid';
import glmatrix from 'gl-matrix';

import Perlin from '../libs/Perlin'
import Line from '../geom/Line'
import Dear from '../animals/Dear'
import Spline from '../libs/Spline';
import vs from '../../shaders/line.vert';
import fs from '../../shaders/line.frag';
import Easings from '../libs/Easings';

const STATES = {
	wandering: 0,
	muting: 1,
	leaving: 2,
}
let tempArray = [];
class ViewLine extends alfrid.View {

	constructor(app) {
		super(vs, fs);

		this.alpha = 1;

		this.isPaused = false;
		this.app = app;
		this.time = Math.random() * 0xFF;

		this.mainSpeed = .6;

		this.perlin = new Perlin.Noise(Math.random());

	}


	_init() {
		// this.dear = new Dear();
		this.spline = new Spline([]);

		this.state = STATES.wandering;
		this.points = []
		const max = 30//Math.floor(Math.random() * 5) + 10;

		let index = 0;
		for (var i = 0; i < max; i++) {
			this.points[index++] = [0,0,0];
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

		this.texture = new alfrid.GLTexture(getAsset('stroke'));
	}

	newPoints(line){

		if(this.state === STATES.muting){
			if(!this.beenInside){
				this.objectsToTween = [];
				this.beenInside = true;

				let index = 0;

				// console.log(line.vert.length, this.path.length);
				for (var i = 0; i < line.vert.length; i++) {
					var startIndex = ( (line.vert.length -1 ) - i)   // 4 is hardcoded but correspond to the sub points of the dear spline
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
					this.objectsToTween[index++] = o;
				}
			}
		}

		else if (this.state === STATES.wandering) {
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

		else if (this.state === STATES.leaving) {
			if(!this.beenInside){
				this.objectsToTween = [];
				this.beenInside = true;

				// console.log(line.vert.length, this.path.length);
				let index = 0;
				for (var i = 0; i < line.vert.length; i++) {
					var startIndex = ( (line.vert.length -1 ) - i)
					var endIndex =  (this.path.length - 1) - i

					if(i === 0) console.log(startIndex, endIndex);

					var obj = {
						startIndex: startIndex,
						endIndex: endIndex,
						currentIndex: startIndex
					}

					var o = Easings.instance.returnVariable(obj, 2, {
						currentIndex: endIndex
					});

					o.point = startIndex;
					this.objectsToTween[index++] = o;
				}
			}

		}


		return false
		// console.log(pts);
	}


  getPoints(pts){
		this.spline.points = pts;
		let indexArray, n_sub = 6;

		tempArray = [];
		let index = 0;
		for (let i = 0; i < pts.length * n_sub; i ++ ) {
			indexArray = i / ( pts.length * n_sub );
			this.spline.getPoint( indexArray,  tempArray);
		}

		return tempArray;
	}

	basic(){
		this.targetPoint[0] = Math.cos(this.time/20 + this.startAngle) * this.radius;
		this.targetPoint[2] = Math.sin(this.time/20 + this.startAngle) * this.radius;
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
			this.time += 1 * this.speed * this.mainSpeed;
			this.motions[this.indexMotion]();
			// this.basic();

			if(this.targetPoint[1] > 0) this.targetPoint[1] = 0;
		}
		else if(this.state === STATES.muting){
			this.targetPoint[0] = this.target.dear.vertices[0][0];
			this.targetPoint[1] = this.target.dear.vertices[0][1];
			this.targetPoint[2] = this.target.dear.vertices[0][2];
		}
		else if (this.state === STATES.leaving) {
			// this.line.points * 6
		}

	}

	undraw(){
		this.state = STATES.leaving;

		Easings.instance.to(this, 4, {
			delay: 2,
			alpha: Math.random() * .6 + .2,
			ease: Easings.instance.easeInCubic
		});

		// return;
		if(Math.random() > .5){

			return;
		}
		let disappearFunctions = [this.disappear1.bind(this), this.disappear2.bind(this)];
		let rand = Math.random()
		let dFunction;
		if(Math.random() > .49){
			dFunction = 0;
		}
		else {
			dFunction = 1;
		}
		// for (var i = 0; i < this.line.points.length; i++) {
		// 	this.line.points[i] = this.line.vert[i*6];
		// }

		this.nbPointsBeforeWandering = this.line.points * 6;

		// this.mainSpeed = .01
		// get the main direction to place the target on x

		let p1 = this.line.vert[this.line.vert.length -1];
		let p2 = this.line.vert[this.line.vert.length -2];

		let sub = [];
		glmatrix.vec3.subtract(sub, p1, p2)
		let dir = [];
		glmatrix.vec3.normalize(dir, sub);

		// this.targetPoint.dir = dir;

		// tempArray[0] = p1[0] + dir[0] * .5;
		// tempArray[1] = p1[1] - 1 - Math.random() * 1;
		// tempArray[2] = p1[2] + dir[1] * .5;

		var startPoint = this.line.vert[this.line.vert.length-1];
		var endPoint = [Math.random() * 0.01 - 0.01/2, -Math.random(p1[1] * dir[1] * .01), Math.random() * .01 - 0.01/2];
		// var endPoint = [p1[0] + dir[0] * .01, -Math.abs(p1[1] * dir[1] * .01), p1[2] + dir[2] * .01];
		let dist = glmatrix.vec3.distance(startPoint, endPoint)

		// console.log(dist);

		// create some points between these two
		this.path = []

		let pathLine = this.target.finalP;

		// console.log(pathLine.length);
		for (var i = 0; i < pathLine.length; i++) {
			this.path.push(pathLine[i])
		}


		// this.path.push(startPoint)
		let lastPt = null
		let length = this.line.points.length;
		let pathToLeave = [startPoint];
		let tick = 0
		for (var i = 1; i < length; i++) {


			// first way to disappear
			// var angleA = Math.cos(tick/10) * Math.PI * 2;
			// var angleB = Math.cos(tick/20) * Math.PI/2 + Math.PI;
			// var r = Math.random() * .5 + .2;

			// second way to disappear
			// var angleA = Math.cos(tick/20) * Math.random() * Math.PI;
			// var angleB = Math.cos(tick/20) * Math.random() * -Math.PI + Math.PI;
			// var r = Math.random() * .5 + .2;
			//
			// 	var angleA = Math.cos(tick/10) * Math.PI * 2;
			// 	var angleB = Math.cos(tick/20) * Math.PI/2 + Math.PI;
			// 	var r = Math.random() * .5 + .2;
			//
			// 	var posAdd = this.getRandomPos(r, angleA, angleB);

			var posAdd = disappearFunctions[dFunction](tick, rand);

				// console.log(posAdd);
			// let pt = [];


				let pt = [
					pathToLeave[i-1][0]  + posAdd[0],
					pathToLeave[i-1][1]  + posAdd[1],
					pathToLeave[i-1][2]  + posAdd[2],
				];

				if(pt[1] > -1) pt[1] = -1;
			// if(i > 1){
				tick++;
				pathToLeave.push(pt)
			// }

			// lastPt = pt
		}
		// pathToLeave.push(endPoint)

		// console.log("pathToLeave.length", pathToLeave.length);
		let pathLeaving = this.getPoints(pathToLeave);
		// console.log("pathLeaving.length", pathLeaving.length);

		for (var i = 0; i < pathLeaving.length; i++) {
			this.path.push(pathLeaving[i]);
		}

		this.beenInside = false;
		this.newPoints(this.line)

	}

	disappear1(tick,rand){
		var angleA = Math.cos(tick/20) * Math.random() * Math.PI +  Math.PI * 2 * rand;
		var angleB = Math.cos(tick/20) * Math.random() * -Math.PI + Math.PI + Math.PI * 2 * rand;
		var r = Math.random() * .5 + .2;
		var posAdd = this.getRandomPos(r, angleA, angleB);

		return posAdd;
	}

	disappear2(tick,rand){
		var angleA = Math.cos(tick/10) * Math.PI * 2 + Math.PI * 2 * rand;
		var angleB = Math.cos(tick/20) * Math.PI/2 + Math.PI + Math.PI * 2 * rand;
		var r = Math.random() * .5 + .2;

		return this.getRandomPos(r, angleA, angleB);
	}
	getRandomPos(r, s, t){
		let x = r * Math.cos(s) * Math.sin(t)
		let y = r * Math.sin(s) * Math.sin(t)
		let z = r * Math.cos(t)

		return [x, y, z];
	}
	transformTo(target){

		Easings.instance.to(this, 4, {
			alpha: .9,
			ease: Easings.instance.easeOutCubic
		});

		this.arrayCorrespondance = []
		this.currentPointToFollowIndex = 0;
		this.mainSpeed = .3;
		this.state = STATES.muting;
		let index = 0;


		this.target = target;

		let nbPointsTarget = this.target.finalP.length/ 6 ; // harcoded for now, 4 the nuber of points between each vertices
		// console.log(nbPointsTarget, this.line.points.length);

		// if the target has more point, we need to add some
		if(this.line.points.length < nbPointsTarget){

			var diff = nbPointsTarget - this.line.points.length;
			let lastP1 = this.line.points[this.line.points.length-1];
			let lastP2 = this.line.points[this.line.points.length-2];


			let sub = [];
			glmatrix.vec3.subtract(sub, lastP2, lastP1)
			let dir = [];
			glmatrix.vec3.normalize(dir, sub);
			let dist = glmatrix.vec3.distance(lastP1, lastP2)

			// console.log("diff", diff);
			for (var i = 0; i < diff; i++) {
				var addPt = [];
				var mult = [];

				var direction = [
					dir[0] * dist/diff * i,
					dir[1] * dist/diff * i,
					dir[2] * dist/diff * i,
				]

				glmatrix.vec3.add(addPt, lastP1, direction);

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

		console.log("HERE");
		this.path = [];

		this.line.vert = this.getPoints(this.line.points)
		let pathLine = this.line.vert.slice();
		// pathLine.reverse();

		// path intermediaire
		let firstPointLine = this.line.points[0];
		let firstPointTarget = this.target.finalP[0];
		let pathToTarget = this.getPoints([firstPointLine, firstPointTarget]);
		let pathTarget = this.target.finalP;

		index = 0;
		for (var i = pathLine.length-1; i > -1; i--) {
			this.path[index++] = pathLine[i];
		}

		for (var i = 0; i < pathToTarget.length; i++) {
			this.path[index++] = pathToTarget[i];
		}

		for (var i = 0; i < pathTarget.length; i++) {
			this.path[index++] = pathTarget[i];
		}

		// this.nbToAdd = this.path.length - pathToTarget.length - pathTarget.length;


		this.newPoints(this.line)
	}

	pause() {
		this.isPaused = !this.isPaused;
	}
	render() {
		if(Easings.instance.tweens.length){
			Easings.instance.update();
		}

		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);

		this.shader.uniform("alpha", "float", this.alpha);
		this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
		this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

		this.update();

		if(this.isPaused){
			GL.draw(this.line);

			return;
		}

		if(this.state === STATES.wandering ){


			var pts = this.newPoints(this.line);
			if(pts){
				this.line.render(pts, this.needsUpdate);
			}
		}
		else if(this.state === STATES.muting || this.state === STATES.leaving) {
			for (var i = 0; i < this.objectsToTween.length; i++) {
				let o = this.objectsToTween[i]
				if(!o.delete){
					for (var k = 0; k < o.props.length; k++) {
						var e = o.props[k];

						if(this.state === STATES.muting){
							o.obj[e.var] = this.easeOutCubic(o.currentIteration, e.value, e.toValue - e.value, o.duration);
						}
						else {
							o.obj[e.var] = this.easeInCubic(o.currentIteration, e.value, e.toValue - e.value, o.duration);
						}

						let indexFloor = Math.floor(o.obj[e.var]);
						this.line.vert[o.point][0] = this.path[indexFloor][0];
						this.line.vert[o.point][1] = this.path[indexFloor][1];
						this.line.vert[o.point][2] = this.path[indexFloor][2];
					}

					o.currentIteration += 1;// do something here
					if(o.currentIteration > o.duration){
						o.delete = true;
					}
				}
				else {
					this.spliceOne(this.objectsToTween, i);
					i--;
				}
			}

			if(this.objectsToTween.length){
				this.line.render(this.line.vert, this.needsUpdate);
			}
			else if(this.state === STATES.leaving){
				this.beenInside = false;
				this.mainSpeed = .6;
				for (var i = 0; i < this.line.points.length; i++) {
					this.line.points[this.line.points.length - 1- i] = this.line.vert[i*6];
				}
				this.state = STATES.wandering;
			}

		}



		GL.draw(this.line);

		if(this.needsUpdate){
			this.needsUpdate = false;
		}
	}

	spliceOne(arr, index) {
     var len=arr.length;
     if (!len) { return }
     while (index<len) {
       arr[index] = arr[index+1];
			 index++
		 }

     arr.length--;
  };

	easeInCubic(t, b, c, d) {
		t /= d;
		return c*t*t*t + b;
	};

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

	easeInSine (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	}

}

export default ViewLine;
