// ViewRabbit.js

import ViewAnimal from './ViewAnimal'
import Weasel from '../../animals/Weasel'

import vs from '../../../shaders/line.vert';
import fs from '../../../shaders/line.frag';

class ViewRabbit extends ViewAnimal {

	constructor(pos) {
		super(vs, fs, pos);
	}

	reset(pos, rx, ry){
		this.shape = new Weasel(pos);
		super.reset(pos, rx, ry);
	}
	// _init(){
	//
	// }
}

export default ViewRabbit;
