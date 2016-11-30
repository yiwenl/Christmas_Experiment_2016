// ViewPressHold.js

import alfrid, { GL } from 'alfrid';

import vs from '../../shaders/press.vert';
import fs from '../../shaders/press.frag';

class ViewPressHold extends alfrid.View {
	
	constructor() {
		// super(vs, fs);
		super(vs, fs);

		this.opacity = new alfrid.TweenNumber(0, 'expIn', 0.005);
		// this.open();
	}

	_init() {
		// const ratio = 1;
		const size = 1;
		this.mesh = alfrid.Geom.plane(size, size, 1);

		
		// this.position = [0, -0.5, 0];
		// this.finalPosition = vec3.create();

		// this.mesh = alfrid.Geom.bigTriangle();
		this._texture = new alfrid.GLTexture(getAsset('presshold'), false, {
			wrapS:GL.gl.CLAMP_TO_EDGE,
			wrapT:GL.gl.CLAMP_TO_EDGE
		});
	}

	open() {
		this.opacity.value = 1;
	}

	close() {
		this.opacity.value = 0;
		this.opacity.easing = 'expInOut';
	}


	render() {
		if(this.opacity.value < 0.01) {
			return;
		}
		GL.disable(GL.DEPTH_TEST);
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.shader.uniform("uOpacity", "float", this.opacity.value);
		this.shader.uniform("uRatio", "float", GL.aspectRatio);
		this._texture.bind(0);
		GL.draw(this.mesh);
		GL.enable(GL.DEPTH_TEST);
	}


}

export default ViewPressHold;