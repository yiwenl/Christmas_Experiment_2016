// ViewWolf.js

import ViewAnimal from './ViewAnimal'
import Wolf from '../../animals/Wolf'

import vs from '../../../shaders/line.vert';
import fs from '../../../shaders/line.frag';

class ViewWolf extends ViewAnimal {

	constructor(pos) {
		super(vs, fs, pos);
	}

	reset(pos, rx, ry){
		this.shape = new Wolf(pos);
		super.reset(pos, rx, ry);
	}
	// _init(){
	//
	// }
}

export default ViewWolf;
