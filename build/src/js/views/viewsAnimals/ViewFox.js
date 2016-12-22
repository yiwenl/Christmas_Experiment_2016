// ViewFox.js

import ViewAnimal from './ViewAnimal'
import Fox from '../../animals/Fox'

import vs from '../../../shaders/line.vert';
import fs from '../../../shaders/line.frag';

class ViewFox extends ViewAnimal {

	constructor(pos) {
		super(vs, fs, pos);
	}

	reset(pos, rx, ry){
		this.shape = new Fox(pos);
		super.reset(pos, rx, ry);
	}
	// _init(){
	//
	// }
}

export default ViewFox;
