// ViewDear.js


import alfrid, { GL } from 'alfrid';


import Line from './geom/Line'
import Dear from './animals/Dear'
import Spline from './libs/Spline';
import vs from '../shaders/line.vert';
import fs from '../shaders/line.frag';

let tempArray = [];
class ViewDear extends alfrid.View {

	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;

    this.totalPts = [];

    this.ready = false;

		var image = new Image();
	  image.src = "./assets/img/stroke3.png";
	  image.onload = function() {
			this.ready = true;

			this.texture = GL.gl.createTexture();
			GL.gl.bindTexture(GL.gl.TEXTURE_2D, this.texture);

			// Set the parameters so we can render any size image.
			GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_S, GL.gl.CLAMP_TO_EDGE);
			GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_T, GL.gl.CLAMP_TO_EDGE);
			GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MIN_FILTER, GL.gl.NEAREST);
			GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MAG_FILTER, GL.gl.NEAREST);

			// Upload the image into the this.texture.
			GL.gl.texImage2D(GL.gl.TEXTURE_2D, 0, GL.gl.RGBA, GL.gl.RGBA, GL.gl.UNSIGNED_BYTE, image);
	  }.bind(this)
	}


	_init() {
		this.dear = new Dear();

    this.points = []
    this.spline = new Spline([]);



		this.tick = 0;



    this.finalP = this.getPoints(this.dear.getPoints());
    this.line = new Line(this.finalP);





	}



  getPoints(pts){
    this.spline.points = pts;
    tempArray.length = 0;
    let index, n_sub = 4;

    var array = []
    for (let i = 0; i < pts.length * n_sub; i ++ ) {
			index = i / ( pts.length * n_sub );
      array.push(this.spline.getPoint( index ));
		}

    this.totalPts = array;
    // console.log(this.totalPts);
    return array;
  }


	update(points) {
	}


	render() {
    // this.update();

    if(!this.ready) return;

		this.time += 0.01;

		this.shader.bind();
    // this.texture.bind();
    this.shader.uniform("texture", "uniform1i", 0);

    this.shader.uniform("alpha", "float", .4);
    this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);
		GL.draw(this.line);
	}


}

export default ViewDear;
