
// import Spline from './libs/Spline';
import glmatrix from 'gl-matrix';

class Dear {
  constructor(pos){
    this.vertices = [
      [499, 446,0],[491, 410,0],[499, 381,0],[513, 354,0],[517, 331,0],[515, 286,0],[545, 219,0],[563, 219,0],[577, 223,0],[595, 216,0],[611, 215,0],[623, 231,0],[625, 255,0],[587, 316,0],[569, 333,0],[562, 369,0],[560, 435,0],[554, 444,0],[545, 441,0],[548, 383,0],[551, 376,0],[552, 337,0],[572, 271,0],[603, 256,0],[630, 263,0],[644, 252,0],[633, 232,0],[609, 225,0],[631, 247,0],[652, 311,0],[666, 332,0],[673, 356,0],[699, 416,0],[701, 425,0],[692, 430,0],[688, 426,0],[661, 363,0],[623, 312,0],[603, 305,0],[605, 331,0],[614, 350,0],[613, 373,0],[599, 403,0],[589, 436,0],[581, 440,0],[575, 436,0],[597, 383,0],[597, 364,0],[589, 351,0],[564, 319,0],[563, 308,0],[572, 306,0],[541, 324,0],[512, 303,0],[507, 260,0],[518, 208,0],[519, 182,0],[515, 171,0],[494, 162,0],[486, 153,0],[491, 153,0],[503, 161,0],[512, 158,0],[504, 149,0],[474, 130,0],[448, 92,0],[447, 62,0],[452, 77,0],[458, 76,0],[474, 52,0],[471, 63,0],[483, 53,0],[484, 56,0],[469, 72,0],[462, 87,0],[472, 119,0],[511, 143,0],[501, 126,0],[491, 109,0],[495, 108,0],[509, 128,0],[528, 141,0],[529, 149,0],[522, 161,0],[521, 171,0],[532, 179,0],[544, 180,0],[550, 198,0],[539, 201,0],[536, 189,0],[545, 184,0],[553, 184,0],[556, 169,0],[555, 155,0],[568, 144,0],[584, 138,0],[574, 157,0],[550, 160,0],[546, 145,0],[554, 131,0],[563, 107,0],[570, 90,0],[573, 91,0],[567, 114,0],[556, 136,0],[558, 140,0],[565, 138,0],[576, 123,0],[581, 119,0],[579, 124,0],[580, 129,0],[599, 98,0],[600, 85,0],[581, 55,0],[589, 58,0],[598, 68,0],[600, 57,0],[601, 58,0],[605, 69,0],[606, 61,0],[606, 61,0],[610, 92,0],[589, 125,0],[589, 129,0]
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
			this.vertices[i][1] -= 1.5;
			this.vertices[i][0] -= 2;
		}




    this.position = pos || [0,-3, 0];
    this.m = glmatrix.mat4.create();
    this.mRX = glmatrix.mat4.create();
    this.mRY = glmatrix.mat4.create();


    // console.log(this.mR);
  }

  rotateX(rx){
    console.log("here", rx);
		glmatrix.mat4.scalar.rotateX(this.mRX, this.mRX, rx)
	}

	rotateY(ry){
    console.log("here", ry);
		glmatrix.mat4.scalar.rotateY(this.mRY, this.mRY, ry)
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

export default Dear;
