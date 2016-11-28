
// import Spline from './libs/Spline';
import glmatrix from 'gl-matrix';

class Bat {
  constructor(pos){
    this.vertices = [
      [581,654,0],[559,631,0],[541,582,0],[537,514,0],[545,466,0],[560,417,0],[559,398,0],[544,392,0],[524,402,0],[516,414,0],[532,412,0],[558,386,0],[568,350,0],[559,318,0],[545,304,0],[533,299,0],[529,279,0],[515,259,0],[497,244,0],[488,220,0],[470,207,0],[448,197,0],[435,175,0],[414,163,0],[404,160,0],[412,147,0],[454,136,0],[497,146,0],[529,168,0],[553,202,0],[571,234,0],[581,263,0],[588,286,0],[606,300,0],[613,300,0],[616,291,0],[615,285,0],[607,283,0],[599,285,0],[601,294,0],[609,296,0],[615,289,0],[612,286,0],[608,290,0],[613,290,0],[617,288,0],[622,285,0],[608,279,0],[592,280,0],[579,287,0],[572,303,0],[575,318,0],[589,324,0],[606,321,0],[615,310,0],[617,296,0],[616,282,0],[610,278,0],[607,257,0],[596,234,0],[586,246,0],[587,265,0],[589,282,0],[580,323,0],[573,352,0],[598,336,0],[606,335,0],[621,324,0],[637,326,0],[648,318,0],[661,325,0],[672,328,0],[682,322,0],[698,318,0],[709,310,0],[718,314,0],[735,314,0],[743,315,0],[746,285,0],[730,254,0],[699,241,0],[670,248,0],[645,265,0],[629,280,0],[621,285,0],[607,277,0],[614,263,0],[627,246,0],[631,245,0],[632,260,0],[626,274,0],[618,283,0],[612,279,0],[616,262,0],[623,213,0],[648,179,0],[686,155,0],[718,129,0],[735,95,0],[735,75,0],[723,51,0],[690,22,0],[631,-2,0],[604,-9,0]
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

export default Bat;
