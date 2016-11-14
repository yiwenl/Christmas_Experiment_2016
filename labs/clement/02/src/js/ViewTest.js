// ViewTest.js


import alfrid, { GL } from 'alfrid';

import vs from '../shaders/test.vert';
import fs from '../shaders/test.frag';

class ViewTest extends alfrid.View {

	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.mesh = new alfrid.Mesh();

		const positions = [];
		const normals = [];
		const uv = [];
		const color = [];
		const indices = [0, 1, 2, 0, 2, 3];


		const size = 1;

		positions.push([-size, -size, 0]);
		positions.push([ size, -size, 0]);
		positions.push([ size,  size, 0]);
		positions.push([-size,  size, 0]);

		normals.push([0, 0, 0]);
		normals.push([0, 1, 0]);
		normals.push([0, 1, 1]);
		normals.push([0, 0, 1]);

		color.push([0, 0, 0]);
		color.push([1, 0, 0]);
		color.push([1, 0, 1]);
		color.push([1, 1, 1]);

		uv.push([0, 0]);
		uv.push([1, 0]);
		uv.push([1, 1]);
		uv.push([0, 1]);

		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uv);
		this.mesh.bufferIndex(indices);
		// this.mesh.bufferNormal(normals);

		this.mesh.bufferData(color, 'aColor', 3);
	}


	update(points) {
		const positions = [];
		/*
		for ...



		*/

		this.mesh.bufferVertex(positions);
	}


	render() {

		this.time += 0.01;
		// GL.disable(GL.CULL_FACE);
		this.shader.bind();
		this.shader.uniform("time", "float", this.time);
		// this.shader.uniform("texture", "uniform1i", 0);
		// texture.bind(0);

		//	float , vec2 , vec3 , vec4
		GL.draw(this.mesh);
	}


}

export default ViewTest;
