// ViewSim.js

import alfrid, { GL } from 'alfrid';
import Params from '../Params';
const fsSim = require('../../shaders/sim.frag');


class ViewSim extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fsSim);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('textureVel', 'uniform1i', 0);
		this.shader.uniform('texturePos', 'uniform1i', 1);
		this.shader.uniform('textureExtra', 'uniform1i', 2);
		this.shader.uniform('maxRadius', 'float', Params.maxRadius);
	}


	render(textureVel, texturePos, textureExtra) {
		this.time += .01;
		this.shader.bind();
		this.shader.uniform('time', 'float', this.time);
		textureVel.bind(0);
		texturePos.bind(1);
		textureExtra.bind(2);

		GL.draw(this.mesh);
	}


}

export default ViewSim;