// ViewWater.js

import alfrid, { GL } from 'alfrid';
import Params from './Params';
import fs from '../shaders/water.frag';
import vs from '../shaders/water.vert';

class ViewWater extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const size = Params.terrainSize;
		this.mesh = alfrid.Geom.plane(size, size, 120, 'xz');

		this.shader.bind();
		this.shader.uniform("textureReflection", "uniform1i", 0);
		this.shader.uniform("uSeaLevel", "float", Params.seaLevel);
		this.shader.uniform('uFogDensity', 'float', Params.fogDensity);
		this.shader.uniform('uFogColor', 'vec3', Params.fogColor);
	}


	render(textureReflection) {
		this.shader.bind();
		textureReflection.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewWater;