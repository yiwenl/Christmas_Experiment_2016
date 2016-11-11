// ViewTerrain.js


import alfrid, { GL } from 'alfrid';
import vs from '../shaders/terrain.vert';
import fs from '../shaders/terrain.frag';

class ViewTerrain extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.plane(5, 5, 100, 'xz');
	}


	render(texture) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewTerrain;