// ViewTerrain.js

import alfrid, { GL, GLTexture } from 'alfrid';
import ShaderUtils from './ShaderUtils';
import Params from './Params';

import vs from '../shaders/terrain.vert';
import fs from '../shaders/terrain.frag';

const grey = 0.25;
const oUniforms = {
	maxHeight:3,
	roughness:1,
	specular:.25,
	metallic:0,
	baseColor:[grey, grey, grey]
}

class ViewTerrain extends alfrid.View {
	
	constructor() {
		const _vs = ShaderUtils.addUniforms(vs, oUniforms);
		const _fs = ShaderUtils.addUniforms(fs, oUniforms);

		super(_vs, _fs);
	}


	_init() {
		const size = Params.terrainSize;
		this.mesh = alfrid.Geom.plane(size, size, 120, 'xz');

		this._textureHeight = new GLTexture(getAsset('height'));
		this._textureNormal = new GLTexture(getAsset('normal'));

		gui.add(oUniforms, 'roughness', 0, 1);
		gui.add(oUniforms, 'specular', 0, 1);
		gui.add(oUniforms, 'metallic', 0, 1);
		gui.add(oUniforms, 'maxHeight', 0, 5);
	}


	render(textureRad, textureIrr, textureNoise) {
		this.shader.bind();

		this.shader.uniform("textureHeight", "uniform1i", 0);
		this._textureHeight.bind(0);

		this.shader.uniform("textureNormal", "uniform1i", 1);
		this._textureNormal.bind(1);

		this.shader.uniform("textureNoise", "uniform1i", 2);
		textureNoise.bind(2);

		this.shader.uniform('uRadianceMap', 'uniform1i', 3);
		textureRad.bind(3);

		this.shader.uniform('uIrradianceMap', 'uniform1i', 4);
		textureIrr.bind(4);

		ShaderUtils.bindUniforms(this.shader, oUniforms);

		this.shader.uniform('uExposure', 'float', Params.exposure);
		this.shader.uniform('uGamma', 'float', Params.gamma);
		this.shader.uniform('uFogDensity', 'float', Params.fogDensity);
		this.shader.uniform('uFogColor', 'vec3', Params.fogColor);

		this.shader.uniform("uClipY", "float", Params.clipY);
		this.shader.uniform("uDir", "float", Params.clipDir);

		GL.draw(this.mesh);
	}


}

export default ViewTerrain;