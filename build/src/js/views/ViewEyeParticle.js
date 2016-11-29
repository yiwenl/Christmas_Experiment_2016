// ViewEyeParticle.js

import alfrid, { GL } from 'alfrid';
import vs from '../../shaders/eye.vert';
import fs from '../../shaders/eye.frag';

class ViewEyeParticle extends alfrid.View {

	constructor() {
		super(vs, fs);
		// this.opacity = new alfrid.TweenNumber(1.0, 'cubicIn');
		this.opacity = 0;
		this._finalPosition = vec3.create();

		this.tick = 0;
		this.delay = 0;
	}


	_init() {
		const size = .1;
		this.mesh = alfrid.Geom.plane(size, size, 1);
	}

	// call prepare from the line drawing (where we get the eyes)
	// we want to make them blink (or not) later when the camera arrives
	prepare(visible = false) {
		this.shouldAppear = visible;
	}

	show() {
		if(!this.shouldAppear) return;

		this.delay = 0;
		this.appearing = true;
		this.hidding = false; // should already set automatically to false but better be sure
		// this.opacity.value = 1;
	}


	hide() {
		this.delay = 0;
		this.appearing = false; // should already set automatically to false but better be sure
		this.hidding = true;
		// this.opacity.value = 0;
	}


	render(pos, pointTarget) {
		this.tick++;

		if(this.appearing){
			this.opacity = Math.sin(Math.tan(this.tick/10) * Math.pow(Math.sin(this.tick/20), 10));
			this.delay++;
			if(this.delay > 120){
				this.appearing = false;
				this.opacity = 1;
			}

		}
		else if(this.hidding) {
			this.opacity = Math.sin(Math.tan(this.tick/20) * Math.pow(Math.sin(this.tick/20), 10));
			this.delay++;
			if(this.delay > 60){
				this.hidding = false;
				this.opacity = 0;
			}
		}

		// vec3.add(this._finalPosition, pos, pointTarget);
		// this.opacity = 1;
		this.shader.bind();
		// this.shader.uniform("float", "uOpacity", 1);
		this.shader.uniform("uOpacity", "float", this.opacity);
		// this.shader.uniform("float", "uOpacity", this.opacity.value);
		// this.shader.uniform("uPosition", "vec3", [0,-2,0]);
		this.shader.uniform("uPosition", "vec3", this._finalPosition);
		GL.draw(this.mesh);
	}


}

export default ViewEyeParticle;
