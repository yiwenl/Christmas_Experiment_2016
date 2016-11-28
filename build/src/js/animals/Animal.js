import glmatrix from 'gl-matrix';

class Animal {
  constructor(vertices, pos){
    this.vertices = vertices || []


    this.position = pos || [-1, -1, 0];
    this.m = glmatrix.mat4.create();
    this.mRX = glmatrix.mat4.create();
    this.mRY = glmatrix.mat4.create();
    this.mT = glmatrix.mat4.create();

    glmatrix.mat4.translate(this.mT, this.mT, this.position);



    this.remapVertices();
  }

  remapVertices(){
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

			this.vertices[i][0] /= (w/2);
			this.vertices[i][1] /= (w/2);
			this.vertices[i][2] = Math.cos(this.tick/10) * .4;
      // this.vertices[i][0] += this.position[0];
			// this.vertices[i][1] += this.position[1];
			// this.vertices[i][2] += this.position[2];

		}
  }

  rotateX(rx){
    glmatrix.mat4.fromXRotation(this.mRX, rx + Math.PI/2);
		// glmatrix.mat4.rotateX(this.mRX, this.mRX, rx + Math.PI/2)
	}

	rotateY(ry){
    glmatrix.mat4.fromYRotation(this.mRY, ry + Math.PI/2);
		// glmatrix.mat4.rotateY(this.mRY, this.mRY, ry - Math.PI/2)
	}

  getPoints(){
    let v = this.vertices.slice();

    glmatrix.mat4.multiply(this.m, this.mRX, this.mRY);
    glmatrix.mat4.multiply(this.m, this.m, this.mT);

    for (var i = 0; i < v.length; i++) {
      glmatrix.vec3.transformMat4(v[i], v[i], this.m);
    }


    return v;
  }
}

export default Animal;
