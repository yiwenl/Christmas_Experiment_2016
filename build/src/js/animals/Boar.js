
// import Spline from './libs/Spline';
import glmatrix from 'gl-matrix';

class Boar {
  constructor(pos){
    this.vertices = [
      [366, 531, 0],[359, 483, 0],[365, 460, 0],[394, 439, 0],[408, 415, 0],[392, 400, 0],[373, 402, 0],[369, 424, 0],[382, 417, 0],[383, 379, 0],[374, 347, 0],[383, 324, 0],[390, 308, 0],[386, 299, 0],[370, 314, 0],[357, 346, 0],[341, 396, 0],[340, 398, 0],[326, 394, 0],[326, 387, 0],[336, 363, 0],[343, 306, 0],[344, 257, 0],[368, 192, 0],[409, 141, 0],[462, 113, 0],[517, 109, 0],[571, 123, 0],[604, 146, 0],[615, 167, 0],[617, 188, 0],[615, 203, 0],[606, 213, 0],[608, 228, 0],[619, 260, 0],[623, 289, 0],[622, 317, 0],[613, 327, 0],[599, 321, 0],[582, 295, 0],[575, 271, 0],[568, 233, 0],[557, 216, 0],[547, 209, 0],[544, 216, 0],[554, 225, 0],[559, 219, 0],[557, 195, 0],[546, 162, 0],[531, 135, 0],[511, 119, 0],[500, 119, 0],[495, 130, 0],[497, 151, 0],[503, 172, 0],[512, 191, 0],[519, 192, 0],[531, 179, 0],[555, 158, 0],[581, 149, 0],[608, 145, 0],[623, 144, 0],[631, 154, 0],[631, 171, 0],[623, 190, 0],[619, 177, 0],[607, 144, 0],[585, 124, 0],[548, 109, 0],[516, 102, 0],[486, 102, 0],[464, 112, 0],[443, 129, 0],[420, 145, 0],[390, 156, 0],[365, 176, 0],[354, 198, 0],[346, 232, 0],[350, 267, 0],[366, 292, 0],[388, 310, 0],[417, 326, 0],[454, 324, 0],[506, 318, 0],[534, 324, 0],[546, 348, 0],[546, 370, 0],[546, 400, 0],[551, 418, 0],[558, 429, 0],[553, 432, 0],[522, 423, 0],[512, 405, 0],[508, 354, 0],[500, 324, 0],[489, 298, 0],[480, 280, 0],[460, 267, 0],[447, 270, 0],[443, 290, 0],[449, 314, 0],[456, 337, 0],[459, 361, 0],[458, 389, 0],[457, 413, 0],[457, 423, 0],[465, 427, 0],[482, 425, 0],[482, 415, 0],[479, 393, 0],[489, 372, 0],[489, 348, 0],[488, 318, 0],[500, 316, 0],[506, 331, 0],[519, 346, 0],[533, 345, 0],[553, 334, 0],[557, 319, 0],[554, 307, 0],[568, 318, 0],[566, 310, 0],[564, 288, 0],[567, 282, 0],[575, 295, 0],[575, 322, 0],[569, 341, 0],[555, 347, 0],[533, 338, 0],[513, 320, 0],[504, 297, 0],[504, 265, 0],[517, 245, 0],[548, 233, 0],[576, 235, 0],[600, 245, 0],[624, 272, 0],[634, 296, 0],[636, 328, 0],[627, 353, 0],[613, 362, 0],[591, 362, 0],[572, 352, 0],[563, 335, 0],[575, 320, 0],[596, 318, 0],[618, 318, 0],[638, 328, 0],[641, 340, 0],[629, 356, 0],[605, 362, 0],[588, 356, 0],[593, 340, 0],[614, 334, 0],[632, 336, 0],[637, 345, 0],[608, 360, 0],[598, 354, 0],[602, 351, 0],[612, 350, 0],[615, 352, 0],[610, 360, 0],[583, 376, 0],[570, 390, 0],[591, 405, 0],[626, 404, 0],[686, 397, 0],[715, 384, 0],[705, 371, 0],[679, 372, 0],[648, 383, 0],[634, 401, 0],[635, 425, 0],[668, 443, 0],[714, 441, 0],[748, 427, 0],[788, 391, 0],[795, 353, 0],[799, 305, 0],[837, 267, 0]
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

export default Boar;