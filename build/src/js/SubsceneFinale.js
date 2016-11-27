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

		this._vLineF = new ViewLineFinale(this);

    // setTimeout(()=>{
    //   this._vLineF.pause();
    // }, .01)
		// this._vLine.alpha = .3 + Math.random() * .5

	}

	pause(){

	}

	onClick(pt){

  }

	update() {

	}

	render() {
    this._vLineF.render();
	}
}

export default SubsceneFinale;
