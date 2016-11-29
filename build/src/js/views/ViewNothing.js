// ViewNothing.js

import alfrid, { GL } from 'alfrid';

class ViewNothing extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.copyFrag);
	}


	_init() {

		const positions = [];
		const uvs = [];
		const indices = [0, 1, 2, 0, 2, 3];


		const size = 25;
		const y = 50;
		positions.push([-size, y, -size]);
		positions.push([ size, y, -size]);
		positions.push([ size, y,  size]);
		positions.push([-size, y,  size]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferIndex(indices);


		this._texture = new alfrid.GLTexture(getAsset('nothing'));
	}


	render() {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this._texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewNothing;