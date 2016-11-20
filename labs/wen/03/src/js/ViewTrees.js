// ViewTrees.js

import alfrid, { GL, GLTexture } from 'alfrid';
import { Noise } from './libs/perlin';
import ShaderUtils from './ShaderUtils';
import Params from './Params';

import vs from '../shaders/trees.vert';
import fs from '../shaders/trees.frag';

const random = function(min, max) { return min + Math.random() * (max - min);	}

const grey = 0.25;
const oUniforms = {
	roughness:1,
	specular:.25,
	metallic:0,
	baseColor:[grey, grey, grey]
}

class ViewTrees extends alfrid.View {
	
	constructor() {
		const _fs = ShaderUtils.addUniforms(fs, oUniforms);

		super(vs, _fs);
	}


	_init() {
		const perlin = new Noise(Math.random() * 0xFFFF);

		const positions = [];
		const uvs = [];
		const indices = [];
		let index = 0;

		const height = 100;
		const radius = .2;
		const num = 24 * 3;
		const noiseScale = 0.5;
		const noiseSize = 0.5;

		const getPosition = (i, j) => {
			const angle = i / num * Math.PI * 2.0;
			let x = Math.cos(-angle) * radius;
			let z = Math.sin(-angle) * radius;
			const y = j/num * height;
			const noise = perlin.simplex3(x*noiseScale, y*noiseScale, z*noiseScale) * noiseSize;
			x *= 1.0 + noise;
			z *= 1.0 + noise;

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



		const NUM_TREES = 100;
		const positionOffsets = [];
		const rotations = [];
		const { terrainSize } = Params;
		const rz = .1;

		const getTreePosition = () => {
			return [random(-terrainSize, terrainSize), 0, random(-terrainSize, terrainSize)]
		}

		for(let i=0; i<NUM_TREES; i++) {
			positionOffsets.push(getTreePosition());
			rotations.push([random(-rz, rz), random(-1, 1), random(1, 2)]);
		}


		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferIndex(indices);
		this.mesh.bufferInstance(positionOffsets, 'aPosOffset');
		this.mesh.bufferInstance(rotations, 'aExtra');


		this._textureTree = new alfrid.GLTexture(getAsset('tree'));

		const f = gui.addFolder('tree');
		f.add(oUniforms, 'roughness', 0, 1);
		f.add(oUniforms, 'specular', 0, 1);
		f.add(oUniforms, 'metallic', 0, 1);
	}


	render(textureRad, textureIrr, textureNoise) {
		this.shader.bind();

		this.shader.uniform("textureTree", "uniform1i", 1);
		this._textureTree.bind(1);

		this.shader.uniform("textureNoise", "uniform1i", 2);
		textureNoise.bind(2);

		this.shader.uniform('uRadianceMap', 'uniform1i', 3);
		textureRad.bind(3);

		this.shader.uniform('uIrradianceMap', 'uniform1i', 4);
		textureIrr.bind(4);

		this.shader.uniform('uExposure', 'float', Params.exposure);
		this.shader.uniform('uGamma', 'float', Params.gamma);
		this.shader.uniform('uFogDensity', 'float', Params.fogDensity);
		this.shader.uniform('uFogColor', 'vec3', Params.fogColor);

		ShaderUtils.bindUniforms(this.shader, oUniforms);

		this.shader.uniform("uClipY", "float", Params.clipY);
		this.shader.uniform("uDir", "float", Params.clipDir);
		GL.draw(this.mesh);
	}


}

export default ViewTrees;