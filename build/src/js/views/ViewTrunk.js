// ViewTrunk.js

import alfrid, { GL } from 'alfrid';

import vs from '../../shaders/trunk.vert';
import fs from '../../shaders/trunk.frag';

class ViewTrunk extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		let strObj = getAsset('objTrunk');
		this.mesh = alfrid.ObjLoader.parse(strObj);
		this.position = [0, 0.5, 0];
		const s = 0.35;
		this.scale = [s, s, s];
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uScale", "vec3", this.scale);
		this.shader.uniform("uPosition", "vec3", this.position);
		GL.draw(this.mesh);
	}


}

export default ViewTrunk;