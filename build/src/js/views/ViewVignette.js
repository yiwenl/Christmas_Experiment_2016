// ViewVignette.js

import alfrid, { GL } from 'alfrid';

class ViewVignette extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, alfrid.ShaderLibs.copyFrag);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
		this._texture = new alfrid.GLTexture(getAsset('vignette'));
	}


	render() {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this._texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewVignette;