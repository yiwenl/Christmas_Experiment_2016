
// import Spline from './libs/Spline';
import glmatrix from 'gl-matrix';

class Wolf {
  constructor(pos){
    this.vertices = [
      [426, 491, 0],[416, 473, 0],[430, 448, 0],[478, 417, 0],[488, 406, 0],[492, 379, 0],[498, 345, 0],[507, 312, 0],[503, 290, 0],[479, 295, 0],[477, 311, 0],[478, 348, 0],[480, 384, 0],[475, 401, 0],[460, 414, 0],[473, 417, 0],[491, 406, 0],[502, 373, 0],[511, 348, 0],[515, 334, 0],[505, 324, 0],[484, 305, 0],[470, 273, 0],[460, 193, 0],[471, 157, 0],[485, 132, 0],[493, 116, 0],[494, 97, 0],[499, 91, 0],[500, 98, 0],[501, 110, 0],[505, 108, 0],[507, 95, 0],[512, 82, 0],[526, 76, 0],[530, 80, 0],[524, 83, 0],[523, 78, 0],[529, 78, 0],[526, 114, 0],[530, 127, 0],[532, 138, 0],[524, 159, 0],[525, 175, 0],[532, 185, 0],[532, 192, 0],[520, 188, 0],[508, 173, 0],[512, 140, 0],[520, 125, 0],[533, 129, 0],[541, 145, 0],[541, 159, 0],[555, 175, 0],[556, 182, 0],[540, 184, 0],[530, 178, 0],[531, 171, 0],[539, 180, 0],[550, 198, 0],[588, 234, 0],[632, 300, 0],[645, 359, 0],[655, 448, 0],[658, 460, 0],[639, 459, 0],[640, 448, 0],[630, 403, 0],[608, 360, 0],[578, 334, 0],[540, 329, 0],[505, 320, 0],[487, 297, 0],[489, 274, 0],[502, 268, 0],[517, 273, 0],[551, 315, 0],[563, 354, 0],[575, 384, 0],[603, 414, 0],[601, 442, 0],[592, 458, 0],[578, 465, 0],[577, 469, 0],[598, 473, 0],[620, 438, 0],[625, 418, 0],[615, 401, 0],[607, 358, 0],[609, 324, 0],[621, 298, 0],[632, 301, 0],[649, 358, 0],[662, 404, 0],[659, 415, 0],[649, 422, 0],[632, 418, 0],[623, 407, 0],[628, 403, 0],[645, 416, 0],[674, 445, 0],[709, 467, 0]
    ]

    let minX = 10000;
    let maxX = 0;

    let minY = 10000;
    let maxY = 0;

    for (var i = 0; i < this.vertices.length; i++) {
      let v = this.vertices[i];
      if(v[0] < minX) minX = v[0]
      if(v[0] > maxX) maxX = v[0]

      if(v[1] < minY) minY = v[1]
      if(v[1] > maxY) maxY = v[1]
    }

    let wX = maxX - minX;
    let wY = maxY - minY;
    let w = Math.max(wX, wY)

    this.tick = 0;

    for (var i = 0; i < this.vertices.length; i++) {

			this.tick++;

			this.vertices[i][0] /= (w / 2);
			// this.vertices[i][0] *= 2;
			this.vertices[i][1] /= (w/2);
			// this.vertices[i][1] *= 2;
			this.vertices[i][2] = Math.cos(this.tick/10) * .4;
			// this.vertices[i][0] -= 2;
			this.vertices[i][1] -= 1.8;
			this.vertices[i][0] -= 1;
		}




    this.position = pos || [0,-3, 0];
    this.m = glmatrix.mat4.create();
    this.mRX = glmatrix.mat4.create();
    this.mRY = glmatrix.mat4.create();


    // console.log(this.mR);
  }

  rotateX(rx){
    // console.log("here", rx);
		glmatrix.mat4.scalar.rotateX(this.mRX, this.mRX, rx + Math.PI/2)
	}

	rotateY(ry){
    // console.log("here", ry);
		glmatrix.mat4.scalar.rotateY(this.mRY, this.mRY, ry - Math.PI/2)
	}

  getPoints(){
    let v = this.vertices.slice();

    // glmatrix.mat4.translate(this.m, this.m,  this.position);
    // glmatrix.mat4.scalar.rotateY(this.m, this.m, Math.PI)

    glmatrix.mat4.multiply(this.m, this.mRX, this.mRY);

    for (var i = 0; i < v.length; i++) {
      // console.log(v[i]);
      glmatrix.vec3.transformMat4(v[i], v[i], this.m);
      // console.log(v[i]);
    }


    return v;
  }
}

export default Wolf;
