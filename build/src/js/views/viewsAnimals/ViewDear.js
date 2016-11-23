// ViewDear.js

import ViewAnimal from './ViewAnimal'
import Dear from '../../animals/Dear'

import vs from '../../../shaders/line.vert';
import fs from '../../../shaders/line.frag';

class ViewDear extends ViewAnimal {

	constructor() {
		super(vs, fs);
	}

	_init(){
		this.shape = new Dear();
		super._init();
	}
}

export default ViewDear;
