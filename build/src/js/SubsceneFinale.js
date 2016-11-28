// SubsceneFinale.js
import ViewLineFinale from './views/ViewLineFinale'
import Controller from './controller/controller'

class SubsceneFinale {
	constructor(mScene) {
		this._scene = mScene;
		this._initTextures();
		this._initViews();


	}

	_initTextures() {

	}

	_initViews() {

		this.ratio = 0;
		this.tickSpace = 0;
		this.controller = new Controller(this);

		let methods = [this.firstLine.bind(this), this.secondLine.bind(this)]
		this.lines = [];
		let index = 0;
		for (var i = 0; i < 4; i++) {
			let data = methods[i % methods.length]();
			// console.log(data);
			data.alpha = Math.random() * .8 + .2;
			data.thickness = Math.random() * .05 + .02;
			let l = new ViewLineFinale(this)
			l.reset(data);
			this.lines[index++] = l;
		}

		// setTimeout(()=>{
		// 	this.appear();
		//
		// 	setTimeout(()=>{
		// 		this.hide();
		// 	}, 4000);
		// }, 2000);
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

		return  {points: points, division: Math.floor(Math.random() * 4 - 4/2 + 20), deltaTime: -(Math.random() * .05 + .01)}
	}

	pause(){

	}

	onClick(pt){

  }

	update() {
		this.controller.update();

		if(!this.didFinalDrawing){

			if(this.controller.spacePressed){
				this.tickSpace++;


				if(this.tickSpace <= 200){
					this.ratio = this.easeInCirc(this.tickSpace, 0, 1, 200);
				}
				else {
					this.didFinalDrawing = true;
				}
			}
			else if(this.tickSpace > 0 || this.ratio > 0){
				if(this.tickSpace > 0){
					this.tickSpace--;
				}
				this.ratio *= .98;
			}

			for (var i = 0; i < this.lines.length; i++) {
				this.lines[i].ratio = this.ratio;
			}

			console.log(this.ratio);
		}

	}

	render() {
    for (var i = 0; i < this.lines.length; i++) {
    	this.lines[i].render();
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

	easeOutCirc(t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  }
}

export default SubsceneFinale;
