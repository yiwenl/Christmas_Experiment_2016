
// import Spline from './libs/Spline';
import glmatrix from '../libs/gl-matrix';

class Dear {
  constructor(){
    this.vertices = [
      [813, 68, 0],
			[788, 157, 0],
			[725, 167, 0],
			[667, 149, 0],
			[670, 106, 0],
			[709, 66, 0],
			[745, 77, 0],
			[762, 126, 0],
			[743, 214, 0],
			[697, 245, 0],
			[649, 242, 0],
			[607, 197, 0],
			[588, 109, 0],
			[578, 39, 0],
			[572, 39, 0],
			[519, 200, 0],
			[534, 251, 0],
			[764, 386, 0],
			[810, 364, 0],
			[813, 297, 0],
			[752, 292, 0],
			[715, 330, 0],
			[707, 414, 0],
			[709, 595, 0],
			[709, 595, 0],
			[660, 504, 0],
			[575, 453, 0],
			[493, 448, 0],
			[433, 471, 0],
			[394, 561, 0],
			[372, 604, 0],
			[372, 604, 0],
			[347, 438, 0],
			[289, 367, 0],
			[303, 287, 0],
			[350, 249, 0],
			[435, 246, 0],
			[495, 361, 0],
			[473, 481, 0],
			[448, 531, 0],
			[446, 580, 0],
			[456, 607, 0]
    ];

    this.tick = 0;

    for (var i = 0; i < this.vertices.length; i++) {

			this.tick++;

			this.vertices[i][0] /= 300;
			this.vertices[i][1] /= 300;
			this.vertices[i][2] = Math.random()//Math.cos(this.tick);
			this.vertices[i][0] -= 2;
			this.vertices[i][1] -= 2;
		}

    console.log(this.vertices);


    this.position = [0,0, -2];
    this.m = glmatrix.mat4.create();


    // console.log(this.mR);


  }

  getPoints(){
    let v = this.vertices.slice();

    glmatrix.mat4.translate(this.m, this.m,  this.position);
    glmatrix.mat4.scalar.rotateY(this.m, this.m, Math.PI)

    // glmatrix.mat4.multiply(m, this.m, this.mR);

    for (var i = 0; i < v.length; i++) {
      // console.log(v[i]);
      glmatrix.vec3.transformMat4(v[i], v[i], this.m);
      // console.log(v[i]);
    }


    return v;
  }
}

export default Dear;
