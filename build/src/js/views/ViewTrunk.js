// ViewTrunk.js

import alfrid, { GL } from 'alfrid';
import Params from '../Params';
import vs from '../../shaders/trunk.vert';
import fs from '../../shaders/trunk.frag';
import fsFallback from '../../shaders/trunkFallback.frag';

import ShaderUtils from '../ShaderUtils';

const grey = 0.5;
const oUniforms = {
	roughness:1,
	specular:.25,
	metallic:0,
	baseColor:[grey, grey, grey]
}

class ViewTrunk extends alfrid.View {
	
	constructor() {
		const useFallback = !GL.getExtension('EXT_shader_texture_lod') || GL.isMobile;
		const _fs = ShaderUtils.addUniforms(useFallback ? fsFallback : fs, oUniforms);

		super(vs, _fs);
		this.useFallback = useFallback;
		this.setupUniforms();
	}


	_init() {
		let strObj = getAsset('objTrunk');
		this.mesh = alfrid.ObjLoader.parse(strObj);
		this.position = [0, 0.5, 0];
		const s = 0.35;
		this.scale = [s, s, s];

		this._textureAO = new alfrid.GLTexture(getAsset('ao'));
	}

	setupUniforms() {
		this.shader.bind();
		this.shader.uniform("textureAO", "uniform1i", 1);

		if(this.useFallback) {
			this.shader.uniform("textureEnv", "uniform1i", 3);
		} else {
			this.shader.uniform('uRadianceMap', 'uniform1i', 3);
			this.shader.uniform('uIrradianceMap', 'uniform1i', 4);
		}

		this.shader.uniform('uExposure', 'float', Params.exposure);
		this.shader.uniform('uGamma', 'float', Params.gamma);
		
		this.shader.uniform('uFogDensity', 'float', Params.fogDensity);
		this.shader.uniform('uFogColor', 'vec3', Params.fogColor);

		this.shader.uniform("uPosition", "vec3", this.position);
		this.shader.uniform("uScale", "vec3", this.scale);

		ShaderUtils.bindUniforms(this.shader, oUniforms);
	}


	render(textureRad, textureIrr, textureEnv) {
		this.shader.bind();

		this._textureAO.bind(1);

		if(this.useFallback) {
			textureEnv.bind(3);
		} else {
			textureRad.bind(3);
			textureIrr.bind(4);	
		}

		this.shader.uniform("uClipY", "float", Params.clipY);
		this.shader.uniform("uDir", "float", Params.clipDir);
		GL.draw(this.mesh);
	}


}

export default ViewTrunk;