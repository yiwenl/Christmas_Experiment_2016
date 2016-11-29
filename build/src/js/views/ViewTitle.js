// ViewTitle.js

import alfrid, { GL } from 'alfrid';
import vs from '../../shaders/eye.vert';
import fs from '../../shaders/title.frag';

class ViewTitle extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.opacity = new alfrid.TweenNumber(0, 'expIn', 0.005);
		alfrid.Scheduler.delay(()=> {
			this.opacity.value = 1;
		}, null, 1500);
	}


	_init() {
		const ratio = 1280/720;
		const size = 4;
		this.mesh = alfrid.Geom.plane(size * ratio, size, 1);

		this._texture = new alfrid.GLTexture(getAsset('title'));
		this.position = [0, 0, 0];
		this.finalPosition = vec3.create();
	}

	close() {
		this.opacity.value = 0;
		this.opacity.easing = 'expInOut';
	}

	setPosition(pos) {
		vec3.add(this.finalPosition, pos, this.position);
	}


	render() {
		if(this.opacity.value < 0.01) {
			return;
		}
		GL.disable(GL.DEPTH_TEST);
		this.shader.bind();
		this.shader.uniform("uPosition", "vec3", this.finalPosition);
		this.shader.uniform("texture", "uniform1i", 0);
		this.shader.uniform("uOpacity", "float", this.opacity.value);
		this._texture.bind(0);
		GL.draw(this.mesh);
		GL.enable(GL.DEPTH_TEST);
	}


}

export default ViewTitle;