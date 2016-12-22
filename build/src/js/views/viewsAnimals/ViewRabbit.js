// ViewRabbit.js

import ViewAnimal from './ViewAnimal'
import Rabbit from '../../animals/Rabbit'

import vs from '../../../shaders/line.vert';
import fs from '../../../shaders/line.frag';

class ViewRabbit extends ViewAnimal {

	constructor(pos) {
		super(vs, fs, pos);
	}

	reset(pos, rx, ry){
		this.shape = new Rabbit(pos);
		super.reset(pos, rx, ry);
	}
	// _init(){
	//
	// }
}

export default ViewRabbit;
