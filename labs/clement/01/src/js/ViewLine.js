// ViewLine.js


import alfrid, { GL } from 'alfrid';

import Line from './geom/Line'
import Spline from './libs/Spline';
import vs from '../shaders/line.vert';
import fs from '../shaders/line.frag';

let tempArray = [];
class ViewLine extends alfrid.View {

	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {

    this.points = []
    this.spline = new Spline([]);
    for (var i = 0; i < 25; i++) {
      this.points.push([Math.random()-.5 , Math.random()-.5,Math.random()-.5]);
    }


    var image = new Image();
    image.src = "./assets/img/stroke2.png";
    image.onload = ()=> {
      var texture = GL.gl.createTexture();
      GL.gl.bindTexture(GL.gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_S, GL.gl.CLAMP_TO_EDGE);
      GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_T, GL.gl.CLAMP_TO_EDGE);
      GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MIN_FILTER, GL.gl.NEAREST);
      GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MAG_FILTER, GL.gl.NEAREST);

      // Upload the image into the texture.
      GL.gl.texImage2D(GL.gl.TEXTURE_2D, 0, GL.gl.RGBA, GL.gl.RGBA, GL.gl.UNSIGNED_BYTE, image);

      this.finalP = this.getPoints(this.points);
      this.line = new Line(this.finalP);

      this.isReady = true;
    }


	}

  getPoints(pts){
    this.spline.points = pts;
    tempArray.length = 0;
    let index, n_sub = 10;

    var array = []
    for (let i = 0; i < pts.length * n_sub; i ++ ) {
			index = i / ( pts.length * n_sub );
      array.push(this.spline.getPoint( index ));
		}

    return array;
  }


	update(points) {
		// const positions = [];

		// this.line.bufferVertex(positions);
	}


	render() {

    if(!this.isReady) return;

    GL.gl.enable(GL.gl.DEPTH_TEST);
    GL.gl.enable(GL.gl.BLEND);
    GL.gl.blendFunc(GL.gl.SRC_ALPHA, GL.gl.ONE_MINUS_SRC_ALPHA);

		this.time += 0.01;
		// GL.disable(GL.CULL_FACE);
		this.shader.bind();
    this.shader.uniform("texture", "uniform1i", 0);
		// Gl.gl.texture.bind(0);

    this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

		// this.shader.uniform("texture", "uniform1i", 0);
		// texture.bind(0);

		//	float , vec2 , vec3 , vec4
		GL.draw(this.line);
	}


}

export default ViewLine;
