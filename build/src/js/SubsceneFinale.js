// SubsceneFinale.js
import alfrid, { GL } from 'alfrid';
import ViewLineFinale from './views/ViewLineFinale'
import Owl from './animals/Owl'
import ViewOwl from './views/ViewOwl'
// import Controller from './controller/controller'

class SubsceneFinale {
	constructor(mScene) {
		this._scene = mScene;
		this._initTextures();
		this._initViews();


	}

	_initTextures() {

	}

	_initViews() {

		this.viewOwl = new ViewOwl(this._scene);
		// let owl = new Owl();

		this.isReady = false;
		this.ratio = 0;
		this.alpha = 0;
		this.tickSpace = 0;
		// this.controller = new Controller(this);

		let methods = [this.firstLine.bind(this), this.secondLine.bind(this)]
		this.lines = [];
		this.linesOwl = [];
		let index = 0;
		for (var i = 0; i < (GL.isMobile ? 3 : 6); i++) {
			let data = methods[i % methods.length]();
			// console.log(data);
			data.alpha = Math.random() * .8 + .2;

			if(data.id === 2){
				data.thickness = Math.random() * .01 + .01;
			}
			else {
				data.thickness = Math.random() * .02 + .02;
			}
			let l = new ViewLineFinale(this)
			l.reset(data);
			this.lines[index++] = l;
		}


		// for (var i = 0; i < owl.finalLines.length; i++) {
		// 	let data = {points: owl.finalLines[i], division: 10, deltaTime: -.06}
		// 	data.alpha = 1;
		// 	data.thickness = .05;
		//
		// 	let l = new ViewLineFinale(this)
		// 	l.reset(data);
		// 	this.lines[index++] = l;
		//
		// 	this.linesOwl[this.linesOwl.length] = l;
		//
		// }

		// setTimeout(()=>{
		// 	this.appear();
		//
		// 	setTimeout(()=>{
		// 		this.hide();
		// 	}, 4000);
		// }, 2000);

		// [[539, 708, 0],[552, 699, 0],[552, 690, 0],[538, 684, 0],[524, 672, 0],[518, 658, 0],[525, 647, 0],[536, 640, 0],[551, 632, 0],[569, 627, 0],[586, 613, 0],[591, 598, 0],[579, 582, 0],[561, 574, 0],[542, 567, 0],[529, 559, 0],[525, 547, 0],[532, 536, 0],[550, 523, 0],[564, 508, 0],[577, 489, 0],[585, 464, 0],[587, 433, 0],[583, 399, 0],[576, 392, 0],[565, 398, 0],[555, 412, 0],[542, 424, 0],[530, 419, 0],[525, 402, 0],[524, 383, 0],[527, 372, 0],[512, 381, 0],[496, 381, 0],[496, 374, 0],[499, 367, 0],[491, 365, 0],[484, 369, 0],[488, 374, 0],[482, 368, 0],[483, 362, 0],[482, 355, 0],[486, 351, 0],[494, 352, 0],[497, 354, 0],[501, 352, 0],[514, 367, 0],[530, 358, 0],[547, 356, 0],[558, 362, 0],[564, 359, 0],[567, 367, 0],[557, 374, 0],[559, 359, 0],[565, 358, 0],[568, 366, 0],[573, 370, 0],[565, 378, 0],[559, 378, 0],[561, 372, 0],[568, 366, 0],[574, 369, 0],[556, 387, 0],[546, 387, 0],[551, 377, 0],[554, 384, 0],[546, 384, 0],[553, 376, 0],[550, 368, 0],[546, 373, 0],[546, 362, 0],[555, 353, 0],[562, 357, 0],[567, 360, 0],[574, 356, 0],[580, 324, 0],[567, 274, 0],[537, 226, 0],[509, 184, 0],[490, 122, 0],[501, 75, 0],[527, 52, 0],[561, 24, 0],[570, 8, 0],[550, -6, 0],[515, -22, 0],[486, -42, 0],[488, -64, 0]]
		// [[532, 701, 0],[519, 696, 0],[522, 684, 0],[533, 671, 0],[547, 655, 0],[566, 633, 0],[568, 610, 0],[542, 1000, 0],[502, 598, 0],[489, 606, 0],[494, 613, 0],[524, 609, 0],[558, 590, 0],[561, 571, 0],[555, 548, 0],[534, 523, 0],[514, 496, 0],[502, 454, 0],[507, 424, 0],[518, 397, 0],[528, 380, 0],[523, 358, 0],[508, 334, 0],[501, 301, 0],[499, 281, 0],[502, 254, 0],[514, 238, 0],[533, 237, 0],[555, 248, 0],[559, 265, 0],[555, 283, 0],[541, 293, 0],[517, 296, 0],[499, 286, 0],[489, 264, 0],[486, 238, 0],[479, 218, 0],[457, 200, 0],[426, 184, 0],[387, 167, 0],[354, 154, 0],[332, 151, 0],[331, 154, 0],[338, 160, 0],[327, 155, 0],[319, 155, 0],[319, 161, 0],[331, 174, 0],[325, 178, 0],[325, 194, 0],[340, 237, 0],[361, 275, 0],[382, 302, 0],[411, 330, 0],[439, 348, 0],[490, 371, 0],[533, 384, 0],[577, 388, 0],[611, 380, 0],[633, 361, 0],[640, 334, 0],[638, 300, 0],[630, 268, 0],[615, 236, 0],[595, 209, 0],[574, 187, 0],[548, 167, 0],[528, 154, 0],[514, 143, 0],[511, 144, 0],[514, 158, 0],[525, 176, 0],[524, 176, 0],[516, 173, 0],[514, 176, 0],[528, 198, 0],[525, 198, 0],[522, 197, 0],[555, 257, 0],[587, 302, 0],[623, 334, 0],[650, 340, 0],[664, 336, 0],[672, 319, 0],[670, 295, 0],[650, 262, 0],[615, 219, 0],[554, 150, 0],[528, 115, 0],[513, 85, 0],[510, 63, 0],[524, 28, 0],[546, -6, 0],[559, -47, 0]]
		// [[849, 148, 0],[855, 172, 0],[852, 200, 0],[839, 229, 0],[822, 243, 0],[798, 240, 0],[768, 225, 0],[741, 217, 0],[718, 220, 0],[701, 231, 0],[693, 249, 0],[696, 261, 0],[715, 267, 0],[731, 257, 0],[731, 234, 0],[709, 196, 0],[683, 173, 0],[659, 164, 0],[628, 170, 0],[602, 184, 0],[576, 206, 0],[559, 234, 0],[548, 246, 0],[535, 251, 0],[527, 258, 0],[525, 269, 0],[527, 278, 0],[527, 272, 0],[529, 261, 0],[538, 259, 0],[542, 265, 0],[542, 271, 0],[538, 275, 0],[532, 273, 0],[526, 266, 0],[531, 260, 0],[540, 259, 0],[543, 265, 0],[542, 273, 0],[535, 280, 0],[529, 283, 0],[520, 286, 0],[520, 288, 0],[522, 292, 0],[527, 281, 0],[523, 277, 0],[518, 277, 0],[516, 281, 0],[516, 286, 0],[520, 292, 0],[506, 287, 0],[499, 277, 0],[500, 265, 0],[503, 258, 0],[508, 258, 0],[512, 266, 0],[514, 271, 0],[514, 274, 0],[509, 270, 0],[509, 264, 0],[507, 257, 0],[500, 252, 0],[499, 243, 0],[506, 231, 0],[543, 188, 0],[557, 158, 0],[559, 124, 0],[549, 95, 0],[531, 74, 0],[516, 47, 0],[518, 21, 0],[535, 0, 0],[562, -17, 0],[575, -34, 0]]
	}

	appear(){
		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i].appear(i * .05)
		}
	}

	hide(){
		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i].hide(i * .05)
		}
	}

	firstLine(){
		// console.log("here");
		let x, y= -0.3, z, t= Math.random() * Math.PI * 2, r = 0, index = 0;
		let points = []
		let rand = Math.random() > .49 ? true:false;
		let rand2 = Math.random() > .49 ? true:false;
		let tR = Math.random() * .06 + 0.05;
		for (var i = 0; i < 30; i++) {

			t+= rand2 ? 1 : -1;
			if(rand){
				x = Math.cos(t) * r;
			  z = Math.sin(t) * r;
			}
			else {
				x = Math.sin(t) * r;
			  z = Math.cos(t) * r;
			};

		  y -= .1;
		  r+= tR;

		  if(r > 2) r = 2;

		  points[index++] = [x,y,z];
		}

		return  {points: points, division: Math.floor(Math.random() * 10 - 10/2 + 40), deltaTime: -(Math.random() * .05 + .05)}
	}

	secondLine(){
		let index = 0;
		let x, y=-.3, z, r = .05, pt = [], t = Math.random() * Math.PI * 2;
		let tR = Math.random() * .03 + 0.05;
		let points = [] ;
		let rand = Math.random() > .49 ? true:false;
		let rand2 = Math.random() > .49 ? true:false;
		for (var i = 0; i < 15; i++) {
			t+= rand2 ? 1 : -1;
			if(rand){
				x = Math.sin(t * 1.3) * r;
				z = Math.cos(t * 1.3) * r;
			}
			else {
				x = Math.cos(t * 1.3) * r;
				z = Math.sin(t * 1.3) * r;
			}
			y -= .3;
			r+= tR;

			if(r > 2) r = 2;

			// console.log(y);
			//

			// this.points[index++] = [0,0,0];
			// pt = [x,y,z]
			points[index++] = [x,y,z];

		}

		return  {points: points, division: Math.floor(Math.random() * 4 - 4/2 + 20), deltaTime: -(Math.random() * .05 + .01), id:2}
	}

	pause(){

	}

	onClick(pt){

  }

	update() {


	}

	render() {
		// this.controller.update();

		if(!this.didFinalDrawing && this.isReady){
		// if(!this.didFinalDrawing && this.isReady){

			if(this._scene._spacePressed){

				this.isIncreasing = true;
				// console.log(this.isIncreasing);
				this.tickSpace++;


				if(this.tickSpace <= 1000){
					this.ratio = this.easeInSine(this.tickSpace, 0, 1, 800);
					this.ratioOwl = this.easeInOutCirc(this.tickSpace, 0, 1, 800);

					// console.log(this.tickSpace);
					if(this.tickSpace <= 800){
						// console.log("changealpha");
						this.alpha = this.easeOutCirc(this.tickSpace, 0, 1, 800);
					}
				}
				else {
					// this.alpha = 1;
					// this.ratio = 1;
					this.didFinalDrawing = true;

					this.viewOwl.drawEyes();
					// for (var i = 0; i < this.linesOwl.length; i++) {
					// 	this.linesOwl[i].finishDraw();
					// }
				}
			}
			else {
				this.isIncreasing = false;
				if(this.tickSpace > 1){
					this.tickSpace-=2;
				}

				if(this.alpha > 0.01){
					this.alpha *= .98;
				}
				else {
					this.tickSpace = 0;
				}

				if(this.tickSpace <= 800){
					this.ratio = this.easeInSine(this.tickSpace, 0, 1, 800);
					this.ratioOwl = this.easeInOutCirc(this.tickSpace, 0, 1, 800);

					// if(this.tickSpace <= 100){
						// this.alpha = this.easeInCirc(this.tickSpace, 0, 1, 100);
					// }
				}
			}

			for (var i = 0; i < this.lines.length; i++) {
				this.lines[i].ratio = this.ratio;
				this.lines[i].alpha = this.alpha;
				this.lines[i].hide = !this.isIncreasing;
			}

			this.viewOwl.ratio = this.ratioOwl;
			this.viewOwl.alpha = this.alpha;
			// console.log(this.alpha);

		}

		if(this.isReady){

			if(this.didFinalDrawing){
				this._scene.pressAndHold(1);
			}
			else {
				this._scene.pressAndHold(Math.min(this.tickSpace/800, 1));
			}
			this.viewOwl.render();

			for (var i = 0; i < this.lines.length; i++) {
				this.lines[i].render();
			}
		}


	}

	easeInSine (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	}

	easeInCirc (t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	}

	easeOutCubic(t, b, c, d) {
		t /= d;
		t--;
		return c*(t*t*t + 1) + b;
	}

	easeInExpo (t, b, c, d) {
		return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
	};

	easeOutCirc(t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  }

	easeInOutCirc(t, b, c, d) {
		t /= d/2;
		if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		t -= 2;
		return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
	}


}

export default SubsceneFinale;
