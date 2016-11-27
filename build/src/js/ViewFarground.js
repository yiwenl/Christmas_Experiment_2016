// ViewFarground.js

import alfrid, { GL, GLTexture } from 'alfrid';

class ViewFarground extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.skyboxVert, alfrid.ShaderLibs.copyFrag);
		// super();
	}


	_init() {
		const positions = [];
		const uvs = [];
		const indices = [];
		let index = 0;

		const height = 70;
		const radius = 70;
		const num = 36;

		const getPosition = (i, j) => {
			const angle = i / num * Math.PI * 2.0;
			const y = -height/2 + j/num * height + 3;
			const r = radius - j/num * .01;
			const x = Math.cos(angle) * r;
			const z = Math.sin(angle) * r;
			
			return [x, y, z];
		}

		for(let i=0; i<num; i++) {
			for(let j=0; j<num; j++) {
				positions.push(getPosition(i, j));
				positions.push(getPosition(i+1, j));
				positions.push(getPosition(i+1, j+1));
				positions.push(getPosition(i, j+1));

				uvs.push([i/num, j/num]);
				uvs.push([(i+1)/num, j/num]);
				uvs.push([(i+1)/num, (j+1)/num]);
				uvs.push([i/num, (j+1)/num]);


				indices.push(index*4 + 0);
				indices.push(index*4 + 1);
				indices.push(index*4 + 2);
				indices.push(index*4 + 0);
				indices.push(index*4 + 2);
				indices.push(index*4 + 3);

				index ++;
			}
		}

		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferIndex(indices);
		this._textureFg = new GLTexture(getAsset(GL.isMobile ? 'fgMobile' : 'fg'));
	}


	render() {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this._textureFg.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewFarground;