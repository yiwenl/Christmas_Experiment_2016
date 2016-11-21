// ViewFilmGrain.js

import alfrid, { GL } from 'alfrid';
import fs from '../shaders/filmGrain.frag';

class ViewFilmGrain extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
	}


	render() {
		this.time += 0.01;
		this.shader.bind();
		this.shader.uniform("uResolution", "vec2", [GL.width, GL.height]);
		this.shader.uniform("timer", "float", this.time);
		GL.draw(this.mesh);
	}


}

export default ViewFilmGrain;