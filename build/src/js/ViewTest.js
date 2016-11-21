// ViewTest.js

import alfrid, { GL, GLTexture } from 'alfrid';
import vs from '../shaders/test.vert';
import fs from '../shaders/test.frag';
import Params from './Params';

class Viewtest extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const size = Params.terrainSize;
		this.mesh = alfrid.Geom.plane(size, size, 120, 'xz');

		this._textureHeight = new GLTexture(getAsset('height'));
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uPosition", "vec3", [0, 1.65, 0]);
		this.shader.uniform("textureHeight", "uniform1i", 0);
		this._textureHeight.bind(0);
		GL.draw(this.mesh);
	}


}

export default Viewtest;