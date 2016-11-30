// ViewEyeParticle.js

import alfrid, { GL } from 'alfrid';
import Easings from '../libs/Easings';
import vs from '../../shaders/eye.vert';
import fs from '../../shaders/eye.frag';

class ViewEyeParticle extends alfrid.View {

	constructor() {
		super(vs, fs);
		// this.opacity = new alfrid.TweenNumber(1.0, 'cubicIn');
		this.opacity = 0;
		this._finalPosition = vec3.create();

		this.tick = Math.random() * Math.PI * 2;
		this.delay = 0;

		this.easings = new Easings();
	}


	_init() {
		this.isVisible = false;
		const size = .2;
		this.mesh = alfrid.Geom.plane(size, size, 1);
		this.scale = 1;
	}

	reset() {
		this.opacity = 0;
		this.shouldAppear = false;
		this.isSlowMode = false;
		this.isVisible = false;
	}

	// call prepare from the line drawing (where we get the eyes)
	// we want to make them blink (or not) later when the camera arrives
	prepare(visible = false) {
		this.shouldAppear = visible;
	}

	slowMode() {
		this.isSlowMode = true;
	}
	//
	normalMode() {
		this.isSlowMode = false;
	}

	show() {
		if(!this.shouldAppear) return;
		this.isVisible = false;

		this.easings.killTweensOf(this)

		this.scale = 1;
		// this.easings.to(this, 10, {

		this.easings.to(this, 4, {
			scale: 2,
			ease: this.easings.easeOutCirc,
			onComplete: ()=>{

				this.easings.to(this, 3, {
					scale: 1,
					ease: this.easings.easeOutBack,
					onComplete: ()=>{

					}
				});

			}
		});


		this.easings.to(this, 4, {
			opacity: 1,
			ease: this.easings.easeOutSine,
			onComplete: ()=> {
				console.log("here");
				this.tick = 0;
				this.isVisible = true;
				this.isSlowMode = false;
			}
		});

		// this.delay = 0;
		// this.appearing = true;
		// this.hidding = false; // should already set automatically to false but better be sure
		// this.opacity.value = 1;
	}


	hide(force) {
		this.normalMode();
		// this.delay = 0;
		// this.appearing = false; // should already set automatically to false but better be sure

		// if(force){
		// 	// this.hidding = false;
		// 	this.isVisible = false;
		// 	this.opacity = 0;
		// }
		// else {

		// console.log("HIDE");
			this.isVisible = false;

			this.easings.killTweensOf(this)
			this.easings.to(this, (force ? .2: 1), {
				opacity: 0,
				ease: this.easings.easeOutCirc,
				onComplete: ()=> {
				}
			});
			// this.hidding = true;
		// }
		// this.opacity.value = 0;
	}


	render(pos, pointTarget) {
		this.easings.update();
		// if(this.isSlowMode){
		// 	this.tick+=.8;
		// }
		// else {
			this.tick+= 1/40;
		// }

		// if(this.appearing){
		// 	this.opacity = Math.sin(Math.tan(this.tick/10) * Math.pow(Math.sin(this.tick/20), 10));
		// 	this.delay++;
		// 	// console.log(this.delay);
		// 	if(this.delay > (this.isSlowMode ? 240 : 120)){
		// 		// console.log("HERE");
		// 		this.appearing = false;
		// 		this.isVisible = true;
		// 		this.opacity = 1;
		// 	}
		//
		// }
		// else if(this.hidding) {
		// 	this.opacity = Math.sin(Math.tan(this.tick/20) * Math.pow(Math.sin(this.tick/20), 10));
		// 	this.delay++;
		// 	if(this.delay > 60){
		// 		this.hidding = false;
		// 		this.isVisible = false;
		// 		this.opacity = 0;
		// 	}
		// }
		if(this.isVisible) {
			this.opacity = Math.cos(this.tick) * .1 + .9;
		}

		// console.log(this.opacity);
		// console.log(this.scale);
		// vec3.add(this._finalPosition, pos, pointTarget);
		// this.opacity = 1;
		this.shader.bind();
		// this.shader.uniform("float", "uOpacity", 1);
		this.shader.uniform("uOpacity", "float", this.opacity);
		this.shader.uniform("uScale", "float", this.scale);
		// this.shader.uniform("float", "uOpacity", this.opacity.value);
		// this.shader.uniform("uPosition", "vec3", [0,-2,0]);
		this.shader.uniform("uPosition", "vec3", this._finalPosition);
		GL.draw(this.mesh);
	}


}

export default ViewEyeParticle;
