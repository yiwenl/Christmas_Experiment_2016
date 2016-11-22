// SubsceneParticles.js

import alfrid, { Scene, GL, GLTexture } from 'alfrid';

import Params from './Params';
import ViewRender from './views/ViewRender';
import ViewSim from './views/ViewSim';
import ViewSave from './views/ViewSave';

class SubsceneParticles {
	constructor(mScene) {
		this._scene = mScene;
		this._enabled = !GL.isMobile;
		this._count = 0;
		this._initTextures();
		this._initViews();
	}

	_initTextures() {
		if(!this._enabled) {	return; }
		const numParticles = Params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.HALF_FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
	}

	_initViews() {
		if(!this._enabled) {	return; }

		this._vRender = new ViewRender();
		this._vSim 	  = new ViewSim();

		this._vSave = new ViewSave();
		GL.setMatrices(this._scene.cameraOrtho);


		this._fboCurrent.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboCurrent.unbind();

		this._fboTarget.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboTarget.unbind();

		GL.setMatrices(this._scene.camera);
	}


	updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2));
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;
	}


	update() {
		if(!this._enabled) {	return; }

		this._count ++;
		if(this._count % Params.skipCount == 0) {
			this._count = 0;
			if(!GL.isMobile) {
				this.updateFbo();	
			}
		}
	}


	render() {
		if(!this._enabled) {	return; }

		let p = this._count / Params.skipCount;
		GL.enableAdditiveBlending();
		this._vRender.render(this._fboTarget.getTexture(0), this._fboCurrent.getTexture(0), p, this._fboCurrent.getTexture(2));
		GL.enableAlphaBlending();
	}
}

export default SubsceneParticles;