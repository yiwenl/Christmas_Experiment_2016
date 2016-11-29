// ViewEyeParticle.js

import alfrid, { GL } from 'alfrid';
import vs from '../../shaders/eye.vert';
import fs from '../../shaders/eye.frag';

class ViewEyeParticle extends alfrid.View {

	constructor() {
		super(vs, fs);
		this.opacity = new alfrid.TweenNumber(1.0, 'cubicIn');
		this._finalPosition = vec3.create();
	}


	_init() {
		const size = .1;
		this.mesh = alfrid.Geom.plane(size, size, 1);
	}


	show() {
		this.opacity.value = 1;
	}


	hide() {
		this.opacity.value = 0;
	}


	render(pos, pointTarget) {
		// vec3.add(this._finalPosition, pos, pointTarget);
		this.shader.bind();
		// this.shader.uniform("float", "uOpacity", 1);
		this.shader.uniform("float", "uOpacity", this.opacity.value);
		// this.shader.uniform("uPosition", "vec3", [0,-2,0]);
		this.shader.uniform("uPosition", "vec3", this._finalPosition);
		GL.draw(this.mesh);
	}


}

export default ViewEyeParticle;
