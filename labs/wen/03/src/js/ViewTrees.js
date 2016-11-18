// ViewTrees.js

import alfrid, { GL } from 'alfrid';

import vs from '../shaders/trees.vert';
import fs from '../shaders/trees.frag';

class ViewTrees extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh;
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewTrees;