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
	travelling: 3,
	dying: 4,
}
let tempArray = [];
class ViewLine extends alfrid.View {

	constructor(app) {
		super(vs, fs);

		this.alpha = 1;

		this.isPaused = false;
		this.app = app;
		this.time = Math.random() * 0xFF;
		this.tickLeaving = 0;

		this.mainSpeed = .6;

		this.perlin = new Perlin.Noise(Math.random());
		this.position = [0, 0, 0]

	}


	_init() {
		this.spline = new Spline([]);
		this.points = []
		const max = 20;

		let index = 0;
		for (var i = 0; i < max; i++) {
			this.points[index++] = [0,0,0];
		}

		this.line = new Line(this.getPoints(this.points));
		this.line.points = this.points;

		// properties for wandering animation
		this.willDraw = false; // sorry, will change that, used to know if the line is supposed to draw after travelling
		this.mainSpeed = .6;
		this.tick = Math.random() * Math.PI*2 * 100;
		this.startAngle = Math.random() * Math.PI*2;
		this.radius = Math.floor(Math.random() * 3) + 2;
		this.targetPoint = [0,0,0];
		this.xoff = Math.random() * 100;
		this.yoff = Math.random() * 100;
		this.speed = .5 + Math.random();

		this.motion = null;

		this.motions = {
			0: [this.circle.bind(this), this.snake.bind(this), this.basic.bind(this)],
			2: [this.disappear1.bind(this), this.disappear2.bind(this)],
			3: [this.travel1.bind(this), this.travel2.bind(this), this.travel3.bind(this)]
		}

		this.texture = new alfrid.GLTexture(getAsset('stroke'));

		this.wander()

	}

	travel(index){
		if(this.state === STATES.muting){
			for (var i = 0; i < this.line.points.length; i++) {
				this.line.points[this.line.points.length - 1- i] = this.line.vert[i*6];
			}
		}

		this.state = STATES.travelling;

		if(index){
			if(index === 1){
				this.motion = this.travelPair1.bind(this)
			}
			else {
				this.motion = this.travelPair2.bind(this)
			}
		}
		else {
			var ix = Math.floor(Math.random() * this.motions[this.state].length)
			console.log(ix);
			this.motion = this.motions[this.state][ix];
		}

	}

	wander(){
		this.state = STATES.wandering;

		this.mainSpeed = .6;
		this.tick = Math.random() * Math.PI*2 * 100;
		this.startAngle = Math.random() * Math.PI*2;
		this.radius = Math.floor(Math.random() * 3) + 2;

		this.xoff = Math.random() * 100;
		this.yoff = Math.random() * 100;
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
		else if (this.state === STATES.wandering || this.state === STATES.travelling) {
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
			if(force){
				this.objectsToTween = [];

				let index = 0;
				for (var i = 0; i < line.vert.length; i++) {
					var startIndex = ( (line.vert.length -1 ) - i)
					var endIndex =  (this.path.length - 1) - i

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
		let indexArray, n_sub = 6;

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

	travel1(){
		this.targetPoint[0] += (this.position[0] - this.targetPoint[0]) * .01;
		this.targetPoint[1] += (this.position[1] - this.targetPoint[1]) * .01;
		this.targetPoint[2] += (this.position[2] - this.targetPoint[2]) * .01;
	}

	travel2(){
		this.targetPoint[0] += (this.position[0] - this.targetPoint[0]) * .01;
		this.targetPoint[1] += (this.position[1] - this.targetPoint[1]) * .01;
		this.targetPoint[2] += (this.position[2] - this.targetPoint[2]) * .01;
		// this.targetPoint[0] += Math.cos(this.time/10 + Math.PI /4) * .08
		this.targetPoint[0] +=  Math.cos(this.time/10 + Math.PI /4) * .08
		// this.targetPoint[1] += 	Math.cos(this.time/10 + Math.PI /4) * .08
		// this.targetPoint[2] += Math.sin(this.time/10 + Math.PI /4) * .08
	}

	travel3(){
		this.targetPoint[0] += (this.position[0] - this.targetPoint[0]) * .1;
		this.targetPoint[1] += (this.position[1] - this.targetPoint[1]) * .06;
		this.targetPoint[2] += (this.position[2] - this.targetPoint[2]) * .1;
		// this.targetPoint[0] += Math.cos(this.time/10 + Math.PI /4) * .08
		// this.targetPoint[0] +=  Math.sin(this.time/10 + Math.PI /4) * .8
		this.targetPoint[1] += 	Math.sin(this.time/10) * .1
		// this.targetPoint[2] += Math.cos(this.time/10 + Math.PI /4) * .08
	}

	travelPair2(){
		this.targetPoint[0] = this.position[0];
		this.targetPoint[1] = this.position[1];
		this.targetPoint[2] = this.position[2];

		let tickLeaving = Math.sin(this.time/10) * 10
		let tickLeaving2 = Math.cos(this.time/10) * 10
		// let tickLeaving3 = Math.sin(this.time/40) * 10
		// this.targetPoint[0] += Math.cos(this.time/10 + Math.PI /4) * .08
		this.targetPoint[0] -= tickLeaving * .1
		// this.targetPoint[1] += tickLeaving2 * .1
		// this.targetPoint[2] += tickLeaving3 * .1
		// this.targetPoint[2] += tickLeaving * .2
		// this.targetPoint[2] += Math.cos(this.time/10 + Math.PI / 4) * .08
	}

	travelPair1(){
		this.targetPoint[0] = this.position[0];
		this.targetPoint[1] = this.position[1];
		this.targetPoint[2] = this.position[2];

		let tickLeaving = Math.sin(this.time/10) * 10
		let tickLeaving2 = Math.sin(this.time/20) * 10
		// let tickLeaving3 = Math.sin(this.time/40) * 10
		// this.targetPoint[0] += Math.cos(this.time/10 + Math.PI /4) * .08
		this.targetPoint[0] += tickLeaving * .1
		// this.targetPoint[1] += tickLeaving2 * .1
		// this.targetPoint[2] += tickLeaving3 * .1
		// this.targetPoint[2] += tickLeaving * .2
		// this.targetPoint[2] += Math.cos(this.time/10 + Math.PI / 4) * .08
	}

	basic(){
		this.targetPoint[0] = this.position[0] + Math.cos(this.time/20 + this.startAngle) * this.radius;
		this.targetPoint[2] = this.position[2] + Math.sin(this.time/20 + this.startAngle) * this.radius;
	}

	circle(){
		this.targetPoint[0] = this.position[0] + Math.cos(this.time/20 + this.startAngle) * this.radius;
		this.targetPoint[2] = this.position[2] + Math.sin(this.time/20 + this.startAngle) * this.radius;

		this.xoff += .01;
		this.yoff += .01;

		var p = this.perlin.perlin2(this.xoff, this.yoff)
		this.targetPoint[1] += p/20;
		this.targetPoint[1] += Math.sin(Math.tan(Math.cos(this.time/80 +this.startAngle) * 1.2)) * .01;
	}

	snake(){
		this.targetPoint[0] = this.position[0] + Math.cos(this.time/40 + this.startAngle) * this.radius;
		this.targetPoint[2] = this.position[2] + Math.sin(this.time/50 + this.startAngle) * this.radius * 1.2 ;

		this.targetPoint[1] = this.position[1] - Math.abs(Math.sin(this.time / 100) * 4) - 2;
		this.targetPoint[0] += Math.cos(Math.pow(8, Math.sin(this.time/40 + this.startAngle))) * .5;
		this.targetPoint[1] += Math.sin(Math.pow(8, Math.sin(this.time/20 + this.startAngle))) * 1;
	}

	update() {
		if(this.state === STATES.wandering){
			this.time += 1 * this.speed * this.mainSpeed;
			this.motion();

			if(this.targetPoint[1] >-1) this.targetPoint[1] = -1;
		}
		else if(this.state === STATES.muting){
			this.targetPoint[0] = this.animal.shape.vertices[0][0];
			this.targetPoint[1] = this.animal.shape.vertices[0][1];
			this.targetPoint[2] = this.animal.shape.vertices[0][2];
		}
		else if(this.state === STATES.travelling){
			this.time += 1 * this.speed * this.mainSpeed;

			// this.travel1()

			this.motion();
		}
	}

	undraw(){
		this.willDraw = false;

		Easings.instance.to(this, 4, {
			delay: 2,
			alpha: Math.random() * .6 + .2,
			ease: Easings.instance.easeInCubic
		});

		if(Math.random() > .5){
			for (var i = 0; i < this.line.points.length; i++) {
				this.line.points[this.line.points.length - 1- i] = this.line.vert[i*6];
			}

			this.wander();

			return;
		}

		this.state = STATES.leaving;
		this.motion = this.motions[this.state][Math.floor(Math.random() * this.motions[this.state].length)];

		var startPoint = this.line.vert[this.line.vert.length-1];
		this.path = []

		let pathLine = this.animal.finalP;
		for (var i = 0; i < pathLine.length; i++) {
			this.path[this.path.length] = pathLine[i];
		}

		let rand = Math.random();
		let pathToLeave = [startPoint];
		let tick = 0
		let index = 1;
		for (var i = 1; i < this.line.points.length; i++) {
			var posAdd = this.motion(tick, rand);
			let pt = [
				pathToLeave[i-1][0]  + posAdd[0],
				pathToLeave[i-1][1]  + posAdd[1],
				pathToLeave[i-1][2]  + posAdd[2],
			];

			if(pt[1] > -1) pt[1] = -1;
			pathToLeave[pathToLeave.length] = pt;

			tick++;
			index++;
		}

		let pathLeaving = this.getPoints(pathToLeave);
		pathToLeave = [];

		for (var i = 0; i < pathLeaving.length; i++) {
			this.path[this.path.length] = pathLeaving[i];
		}

		pathLeaving = false;
		this.newPoints(this.line, true) // set the easings

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

		let nbPointsTarget = this.animal.finalP.length/ 6 ;

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
		this.path = [];

		this.line.vert = this.getPoints(this.line.points)
		let pathLine = this.line.vert.slice();
		// pathLine.reverse();

		let firstPointLine = this.line.points[0];
		let firstPointTarget = this.animal.finalP[0];
		let pathToTarget = this.getPoints([firstPointLine, firstPointTarget]);
		let pathTarget = this.animal.finalP;

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

		if(this.state === STATES.wandering || this.state === STATES.travelling){
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
				for (var i = 0; i < this.line.points.length; i++) {
					this.line.points[this.line.points.length - 1- i] = this.line.vert[i*6];
				}
				this.wander();
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
