// SubsceneFinale.js
import ViewLineFinale from './views/ViewLineFinale'

class SubsceneFinale {
	constructor(mScene) {
		this._scene = mScene;
		this._initTextures();
		this._initViews();


	}

	_initTextures() {

	}

	_initViews() {

		let methods = [this.firstLine.bind(this), this.secondLine.bind(this)]
		this.lines = [];
		let index = 0;
		for (var i = 0; i < 4; i++) {
			let data = methods[i % methods.length]();
			// console.log(data);
			data.alpha = Math.random() * .8 + .2;
			data.thickness = Math.random() * .2 + .05;
			let l = new ViewLineFinale(this)
			l.reset(data);
			this.lines[index++] = l;
		}

    // setTimeout(()=>{
    //   this._vLineF.pause();
    // }, .01)
		// this._vLine.alpha = .3 + Math.random() * .5

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

		return  {points: points, division: Math.floor(Math.random() * 10 - 10/2 + 40), deltaTime: -(Math.random() * .1 + .05)}
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

		return  {points: points, division: Math.floor(Math.random() * 5 - 5/2 + 20), deltaTime: -(Math.random() * .05 + .02)}
	}

	pause(){

	}

	onClick(pt){

  }

	update() {

	}

	render() {
    for (var i = 0; i < this.lines.length; i++) {
    	this.lines[i].render();
    }
	}
}

export default SubsceneFinale;
