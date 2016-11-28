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
import Motions from '../LinesMotions';

const STATES = {
	wandering: 0,
	muting: 1,
	leaving: 2,
	travelling: 3,
	dying: 4,
	finishing: 5,
}
let tempArray = [];
class ViewLine extends alfrid.View {

	constructor(app) {
		super(vs, fs);

		this.alpha = 1;

		this.isPaused = false;
		this.app = app;
		this._tick = 0;
		this.tickLeaving = 0;
		this.tickRender = 0;

		this.mainSpeed = .6;


	}


	_init() {

		this.delayBeforeNewMotion = Math.random() * 120 + 120;
		this.perlin = new Perlin.Noise(Math.random());
		this.position = [0, 0, 0]
		this.spline = new Spline([]);
		this.points = []
		this.sub = 3//GL.isMobile ? 3 : 5;
		this.thickness = Math.random() * .4 + .1;
		this.isMobile = GL.isMobile;
		const max = (this.isMobile ? 12:20);

		let index = 0;
		for (var i = 0; i < max; i++) {
			this.points[index++] = [0,0,0];
		}

		let division = 4;
		this.line = new Line(this.getPoints(this.points));
		this.line.points = this.points;

		// properties for wandering animation
		this.willDraw = false; // sorry, will change that, used to know if the line is supposed to draw after travelling
		// this.posToDraw = null; // sorry, will change that, used to know if the line is supposed to draw after travelling

		this.tick = Math.random() * Math.PI*2 * 100;

		this.speed = .5 + Math.random();
		this.mainSpeed = .6;

		this.targetPoint = [0,0,0];

		this.motionOptions = {
			perlin:  this.perlin,
			time:  Math.random() * 0xFF,
			startAngle:  Math.random() * Math.PI*2,
			radius:  Math.floor(Math.random() * 3) + 2,
			targetPoint:  this.targetPoint,
			position:  this.position,
			xoff:  Math.random() * 100,
			yoff:  Math.random() * 100
		}

		this.motion = null;

		this.motions = {
			0: [Motions.circle.bind(Motions), Motions.snake.bind(Motions)],
			2: [Motions.disappear1.bind(Motions)],
			3: [Motions.travel1.bind(Motions), Motions.travel2.bind(Motions), Motions.travel3.bind(Motions), Motions.travelPair1.bind(Motions), Motions.travelPair2.bind(Motions)],
			5: [Motions.end1.bind(Motions)]
		}

		this.texture = new alfrid.GLTexture(getAsset('stroke'));

		this.wander()

	}

	travel(index){
		if(this.state === STATES.muting){
			for (var i = 0; i < this.line.points.length; i++) {
				this.points[this.points.length - 1- i] = this.line.vert[i*this.sub];
			}

			this._cutExtraPoints(this.isMobile? 12:20);
		}

		this.state = STATES.travelling;

		if(index){
			if(index === 1){
				this.motion = Motions.travelPair1.bind(Motions)
			}
			else {
				this.motion = Motions.travelPair2.bind(Motions)
			}
		}
		else {
			var ix = Math.floor(Math.random() * this.motions[this.state].length)
			this.motion = this.motions[this.state][ix];
		}

	}

	finish(){
		this._cutExtraPoints(this.isMobile? 12:20);

		this.state = STATES.finishing;

		this.mainSpeed = .6;

		this.tick = Math.random() * Math.PI*2 * 100;
		this.motionOptions.startAngle = Math.random() * Math.PI*2;
		this.motionOptions.radius = 10;

		this.speed = .5 + Math.random() * 2;

		if(Math.random() > .5){
			this.speed *= -1;
		}

		this.motion = this.motions[this.state][Math.floor(Math.random() * this.motions[this.state].length)];
	}

	wander(){
		this.state = STATES.wandering;

		this.delayBeforeNewMotion = Math.random() * 120 + 120;
		this.mainSpeed = .6;
		this.tick = Math.random() * Math.PI*2 * 100;
		this.motionOptions.startAngle = Math.random() * Math.PI*2;
		this.motionOptions.radius = Math.floor(Math.random() * 3) + 2;

		this.motionOptions.xoff = Math.random() * 100;
		this.motionOptions.yoff = Math.random() * 100;
		this.speed = .5 + Math.random();

		if(Math.random() > .5){
			this.speed *= -1;
		}

		this.motion = this.motions[this.state][Math.floor(Math.random() * this.motions[this.state].length)];
	}

	newPoints(line, force){

		if(this.state === STATES.muting){
			if(force){
				this.objectsToTween = [];
				let index = 0;

				for (var i = 0; i < line.vert.length; i++) {
					var startIndex = ( (line.vert.length -1 ) - i);
					var endIndex =  (this.path.length - 1) - i;

					var obj = { startIndex: startIndex, endIndex: endIndex, currentIndex: startIndex}
					var o = Easings.instance.returnVariable(obj, 1 + .1, { currentIndex: endIndex }); // fake tween, just to get the info we want for the tween
					o.point = startIndex;
					this.objectsToTween[index++] = o;
				}
			}
		}
		else if (this.state === STATES.wandering || this.state === STATES.travelling || this.state === STATES.finishing) {

			var pt0 = line.points[0];

	    pt0[0] += (this.targetPoint[0] - pt0[0]) * 0.4 * this.mainSpeed;
	    pt0[2] += (this.targetPoint[2] - pt0[2]) * 0.4 * this.mainSpeed;
	    pt0[1] += (this.targetPoint[1] - pt0[1]) * 0.2 * this.mainSpeed;

			let speed;

			if(this.state === STATES.wandering){
				speed = .4;
			}
			else if(this.state === STATES.finishing){
				speed = .3;
			}
			else {
				speed = .6;
			}
			for (var i = 1; i < line.points.length; i++) {
				line.points[i][0] += (line.points[i-1][0] - line.points[i][0]) * speed * this.mainSpeed;
				line.points[i][1] += (line.points[i-1][1] - line.points[i][1]) * speed * this.mainSpeed;
				line.points[i][2] += (line.points[i-1][2] - line.points[i][2]) * speed * this.mainSpeed;
			}

			var pts = this.getPoints(line.points);

			return pts
		}
		else if (this.state === STATES.leaving) {
			if(force){
				this.objectsToTween = [];

				let index = 0;

				// i = 0
				// this.animal.finalP
				//
				// i = line.vert.length - 1
				// this.path.length - 1

				// console.log(this.path.length);

				// for (var i = 0; i < 10; i++) {
				// console.log("newPoints");
				let min = this.path.length - 1 - line.vert.length - 1;

				if(this.path.length - 1 - line.vert.length - 1 < line.vert.length){
					min = line.vert.length - 1;
				}
				let max = this.path.length - 1 - min;

				for (var i = 0; i < line.vert.length; i++) {
					// var startIndex = ( (line.vert.length -1 ) - i)
					// var endIndex =  (this.path.length - 1) -i;

					var startIndex = i;
					var endIndex =  min + Math.floor(i/line.vert.length* max);

					if(i === 0 || i === line.vert.length-1 ) console.log(startIndex, endIndex);
					// var startIndex = i
					// var endIndex =  this.animal.finalP - i

					var obj = { startIndex: startIndex, endIndex: endIndex, currentIndex: startIndex}
					var o = Easings.instance.returnVariable(obj, 2, { currentIndex: endIndex }); // fake tween, just to get the info we want for the tween

					o.point = startIndex;
					this.objectsToTween[index++] = o;
				}
			}
		}

		return false
	}


  getPoints(pts){
		this.spline.points = pts;
		let indexArray, n_sub = this.sub;

		tempArray = [];
		let index = 0;
		for (let i = 0; i < pts.length * n_sub; i ++ ) {
			indexArray = i / ( pts.length * n_sub );
			this.spline.getPoint( indexArray,  tempArray);
		}

		return tempArray;
	}

	stop(){
		this.state = STATES.dying;
	}

	update() {

		if(this.state === STATES.wandering){
			this.delayBeforeNewMotion--;

			if(this.delayBeforeNewMotion < 0){
				this.delayBeforeNewMotion = Math.random() * 120 + 120;
				this.motion = this.motions[this.state][Math.floor(Math.random() * this.motions[this.state].length)];
			}
			this.motionOptions.time += 1 * this.speed * this.mainSpeed;
			this.motion(this.motionOptions);

			if(this.targetPoint[1] >-1) this.targetPoint[1] = -1;
		}
		else if(this.state === STATES.muting){
			this.targetPoint[0] = this.animal.shape.vertices[0][0];
			this.targetPoint[1] = this.animal.shape.vertices[0][1];
			this.targetPoint[2] = this.animal.shape.vertices[0][2];
		}
		else if(this.state === STATES.travelling){
			this.motionOptions.time += 1 * this.speed * this.mainSpeed;

			this.motion(this.motionOptions);
		}
		else if(this.state === STATES.finishing){
			this.motionOptions.time += 1 * this.speed * this.mainSpeed;

			this.motion(this.motionOptions);
		}

	}

	undraw(callback){
		this.callback = callback;
		this.willDraw = false;

		// Easings.instance.to(this, 4, {
		// 	delay: 2,
		// 	alpha: Math.random() * .6 + .2,
		// 	ease: Easings.instance.easeInCubic
		// });

		if(Math.random() > .4){
		// if(false){
			for (var i = 0; i < this.line.points.length; i++) {
				this.points[this.points.length - 1- i] = this.line.vert[i*this.sub];
			}

			if(this.callback){
				this.callback();
			}
			else {
				this.wander();
			}

			return;
		}

		this.state = STATES.leaving;
		this.motion = this.motions[this.state][Math.floor(Math.random() * this.motions[this.state].length)];

		var startPoint = this.line.vert[this.line.vert.length-1];
		var secondPoint = this.line.vert[this.line.vert.length-2];
		this.path = []

		var pathLine = this.animal.getPointsWithPos(this.posToDraw)

		// let pathLine = this.animal.finalP;
		for (var i = 0; i < pathLine.length; i++) {
			this.path[this.path.length] = pathLine[i];
		}

		let rand = Math.random();
		let pathToLeave = [startPoint];

		let sub2 = [];
		glmatrix.vec3.subtract(sub2, secondPoint, startPoint)
		let zaxis = [];
		glmatrix.vec3.normalize(zaxis, sub2);

		let pointJustAfterEntryPoint = [
			startPoint[0] + zaxis[0] * .1,
			startPoint[1] + zaxis[1] * .1,
			startPoint[2] + zaxis[2] * .1,
		]
		pathToLeave[pathToLeave.length] = pointJustAfterEntryPoint;

		let lastPoint = [
			pointJustAfterEntryPoint[0] +  Math.random() * 6 - 3,
			pointJustAfterEntryPoint[1] -  Math.random() * 2 ,
			pointJustAfterEntryPoint[2] +  Math.random() * 6 - 3,
		]

		let dist = glmatrix.vec3.distance(pointJustAfterEntryPoint, lastPoint)

		let up = [0, -1, 0];

		let xaxis = []
		glmatrix.vec3.cross(xaxis, zaxis, up);

		// let yaxis = []
		// glmatrix.vec3.cross(yaxis, zaxis, xaxis);
		let nb = 5
		for (var i = 0; i <= nb; i++) {
			let d = 0;
			if(i===0){
				d = dist / nb * i  + Math.random() * (dist/nb)/2
			}
			else if(i===nb){
				d = dist / nb * i  - Math.random() * (dist/nb)/2
			}
			else {
				d = dist / nb * i  + Math.random() * dist/nb - (dist/nb)/ 2
			}
			let r = .2//Math.random() * 1 - .5;
			let origin = [
				pointJustAfterEntryPoint[0] + zaxis[0] *d,
				pointJustAfterEntryPoint[1] + zaxis[1] *d,
				pointJustAfterEntryPoint[2] + zaxis[2] *d,
			]

			let pos = [
				origin[0] + xaxis[0] * r,
				origin[1] + xaxis[1] * r,
				origin[2] + xaxis[2] * r,
			]

			// console.log("pos",pos);

			let rotPos = [];
			glmatrix.vec3.rotateZ(rotPos, pos, origin, Math.random() * Math.PI * 2)

			// console.log("rotPos",rotPos);

			pathToLeave[pathToLeave.length] = rotPos;
		}

		pathToLeave[pathToLeave.length] = lastPoint;

		// let tick = 0
		// let index = 1;
		// for (var i = 1; i < this.line.points.length; i++) {
		// 	var posAdd = this.motion(this.motionOptions, rand);
		// 	let pt = [
		// 		pathToLeave[i-1][0]  + posAdd[0],
		// 		pathToLeave[i-1][1]  + posAdd[1],
		// 		pathToLeave[i-1][2]  + posAdd[2],
		// 	];
		//
		// 	if(pt[1] > -1) pt[1] = -1;
		// 	pathToLeave[pathToLeave.length] = pt;
		//
		// 	tick++;
		// 	index++;
		// }

		let pathLeaving = this.getPoints(pathToLeave);
		pathToLeave = [];

		for (var i = 0; i < pathLeaving.length; i++) {
			this.path[this.path.length] = pathLeaving[i];
		}

		pathLeaving = false;
		this.newPoints(this.line, true) // set the easings

		this.posToDraw = null;
		// console.log(this.line.vert.length);
		// console.log(this.path.length);

	}

	transformTo(animal){
		Easings.instance.to(this, 4, {
			alpha: .9,
			ease: Easings.instance.easeOutCubic
		});

		this.willDraw = null;


		this.arrayCorrespondance = []
		this.currentPointToFollowIndex = 0;
		this.mainSpeed = .3;
		this.state = STATES.muting;
		let index = 0;


		this.animal = animal;

		var ptsAnimal = this.animal.getPointsWithPos(this.posToDraw)
		// console.log(this.posToDraw);
		let nbPointsTarget = ptsAnimal.length/ this.sub ;

		// if the target has more point, we need to add some
		if(this.line.points.length < nbPointsTarget){

			let diff = nbPointsTarget - this.line.points.length;
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
		this.path = [];

		this.line.vert = this.getPoints(this.line.points)
		let pathLine = this.line.vert.slice();
		// pathLine.reverse();

		let firstPointLine = this.line.points[0];
		let firstPointTarget = ptsAnimal[0];
		let secondPointTarget = ptsAnimal[1];

		// path to target
		let dist = glmatrix.vec3.distance(firstPointLine, firstPointTarget);
		let midPoint = [(firstPointLine[0] + firstPointTarget[0])/2, (firstPointLine[1] + firstPointTarget[1])/2, (firstPointLine[2] + firstPointTarget[2])/2];
		let ptsToTarget = [firstPointLine];
		for (var i = 0; i < 2; i++) {
			let pt = this.getRandomPos(Math.random() * dist/5, Math.random() * Math.PI*2, Math.random() * Math.PI*2)
			pt[0] += midPoint[0];
			pt[1] += midPoint[1];
			pt[2] +=midPoint[2];

			ptsToTarget[ptsToTarget.length] = pt;
		}

		// get a point just before the target entry point, same direction
		let sub2 = [];
		glmatrix.vec3.subtract(sub2, firstPointTarget, secondPointTarget)
		let dir2 = [];
		glmatrix.vec3.normalize(dir2, sub2);

		let pointJustBeforeEntryPoint = [
			firstPointTarget[0] + dir2[0] * dist/5,
			firstPointTarget[1] + dir2[1] * dist/5,
			firstPointTarget[2] + dir2[2] * dist/5,
		]

		ptsToTarget[ptsToTarget.length] = pointJustBeforeEntryPoint;
		ptsToTarget[ptsToTarget.length] = firstPointTarget;

		let pathToTarget = this.getPoints(ptsToTarget);
		// let pathToTarget = this.getPoints([firstPointLine, firstPointTarget]);
		let pathTarget = ptsAnimal;

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

		this.newPoints(this.line, true)
		// this.posToDraw = null;
	}

	getRandomPos(r, s, t){
		let x = r * Math.cos(s) * Math.sin(t)
		let y = r * Math.sin(s) * Math.sin(t)
		let z = r * Math.cos(t)

		return [x, y, z];
	}

	pause() {
		this.isPaused = !this.isPaused;
	}

	render() {
		this._tick+= .1 * (window.hasVR ? .66 : 1);

		let canUpdate = (this.tickRender++ % 2 == 0);

		if(canUpdate){
			if(Easings.instance.tweens.length){
				Easings.instance.update();
			}
			this.update();
		}

		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);

		this.shader.uniform("thickness", "float", this.thickness);
		this.shader.uniform("uTime", "float", this._tick);
		this.shader.uniform("alpha", "float", this.alpha);
		this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
		this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

		// if(this.isPaused){
		// 	GL.draw(this.line);
		//
		// 	return;
		// }

		if(this.state === STATES.wandering || this.state === STATES.travelling || this.state === STATES.finishing){
			var pts = this.newPoints(this.line);
			if(pts && !this.isPaused){
				this.line.render(pts, this.needsUpdate);
			}
		}
		else if(this.state === STATES.muting || this.state === STATES.leaving) {
			if(canUpdate){
				for (var i = 0; i < this.objectsToTween.length; i++) {
					let o = this.objectsToTween[i]
					if(!o.delete){
						for (var k = 0; k < o.props.length; k++) {
							var e = o.props[k];

							if(this.state === STATES.muting){
								o.obj[e.var] = this.easeOutCirc(o.currentIteration, e.value, e.toValue - e.value, o.duration);
							}
							else {
								o.obj[e.var] = this.easeInSine(o.currentIteration, e.value, e.toValue - e.value, o.duration);
							}

							let indexFloor = Math.floor(o.obj[e.var]);
							this.line.vert[o.point][0] = this.path[indexFloor][0];
							this.line.vert[o.point][1] = this.path[indexFloor][1];
							this.line.vert[o.point][2] = this.path[indexFloor][2];
						}

						o.currentIteration += 1 * (window.hasVR ? .66 : 1);// do something here
						if(o.currentIteration > o.duration){
							o.delete = true;
						}
					}
					else {
						this.splice(this.objectsToTween, i);
						i--;
					}
				}

				if(this.objectsToTween.length){
					this.line.render(this.line.vert, this.needsUpdate);
				}
				else if(this.state === STATES.leaving){
					for (var i = 0; i < this.line.points.length; i++) {
						this.points[this.points.length - 1- i] = this.line.vert[i*this.sub];
					}

					this._cutExtraPoints(this.isMobile? 12:20);

					this.line.render(this.line.points, this.needsUpdate)
					if(this.callback){
						this.callback();
						this.callback = null;
					}
					else {
						this.wander();
					}
				}
			}

		}




		GL.draw(this.line);

		if(this.needsUpdate){
			this.needsUpdate = false;
		}
	}

	_cutExtraPoints(max) {

		console.log("this.points.length", this.points.length);
		if(this.points.length > max){
			let nbPtsToSlice = this.points.length - max;

			let offset = Math.ceil(this.points.length / max);

			let arr = [];
			let index = 0;
			for (var i = 0; i < this.points.length; i+=offset) {
				arr[index++] = this.points[i]
			}

			this.points = arr;//this.line.points.slice(0, max);
			this.line.points = this.points;
			this.needsUpdate = true;
		}

		// debbugger;
	}

	splice(arr, index) {
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

	easeOutCirc(t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  }

	easeLinear(t, b, c, d) {
		t /= d;
		return c*t + b;
	};

	easeInCirc (t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	}

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
