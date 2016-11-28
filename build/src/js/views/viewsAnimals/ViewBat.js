// ViewBat.js

import ViewAnimal from './ViewAnimal'
import Bat from '../../animals/Bat'

import vs from '../../../shaders/line.vert';
import fs from '../../../shaders/line.frag';

class ViewBat extends ViewAnimal {

	constructor(pos) {
		super(vs, fs, pos);
	}

	reset(pos, rx, ry){
		this.shape = new Bat(pos);
		super.reset(pos, rx, ry);
	}
	// _init(){
	//
	// }
}

export default ViewBat;
