
// import Spline from './libs/Spline';
import glmatrix from 'gl-matrix';

class Test {
  constructor(pos){
    this.vertices = [
    ];

    this.tick = 0;

    for (var i = 0; i < this.vertices.length; i++) {

			this.tick++;

			this.vertices[i][0] /= 300;
			this.vertices[i][1] /= 300;
			this.vertices[i][2] = Math.cos(this.tick/2) * .4;
			this.vertices[i][0] -= 2;
			this.vertices[i][1] -= 2;
		}




    this.position = pos || [0,-1, 2];
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

export default Test;
