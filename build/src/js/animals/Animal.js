import glmatrix from 'gl-matrix';

class Animal {
  constructor(vertices, pos, eyes, offsetEyes){

    this.eyes = eyes || [];

    this.vertices = vertices || []

    this.position = pos || [0, 0, 0];
    this.m = glmatrix.mat4.create();
    this.mRX = glmatrix.mat4.create();
    this.mRY = glmatrix.mat4.create();
    this.mT = glmatrix.mat4.create();
    this.mTAnchor = glmatrix.mat4.create();

    this.offsetEyes = offsetEyes || [0, 0, 0];

    this.positionedEyes = []

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

    this.wX = maxX - minX;
    this.wY = maxY - minY;
    let w = Math.max(this.wX, this.wY)

    this.tick = 0;

    let xMin = null;
    let xMax = null;
    let yMin = null;
    let yMax = null;
    let zMin = null;
    let zMax = null;

    for (var i = 0; i < this.eyes.length; i++) {
      this.eyes[i][0] /= (w/2);
			this.eyes[i][1] /= (w/2);
			this.eyes[i][2] = this.offsetEyes[2];

      // console.log(this.eyes[i]);
    }

    for (var i = 0; i < this.vertices.length; i++) {

			this.tick++;

			this.vertices[i][0] /= (w/2);
			this.vertices[i][1] /= (w/2);
			this.vertices[i][2] = Math.cos(this.tick/10) * .4;


      if(this.vertices[i][0] < xMin || xMin === null) xMin = this.vertices[i][0];
      if(this.vertices[i][0] > xMax || xMax === null) xMax = this.vertices[i][0];

      if(this.vertices[i][1] < yMin || yMin === null) yMin = this.vertices[i][1];
      if(this.vertices[i][1] > yMax || yMax === null) yMax = this.vertices[i][1];

      if(this.vertices[i][2] < zMin || zMin === null) zMin = this.vertices[i][2];
      if(this.vertices[i][2] > zMax || zMax === null) zMax = this.vertices[i][2];
		}


    this.centerX = (xMax + xMin) /2;
    this.centerY = (yMax + yMin) /2;
    this.centerZ = (zMax + zMin) /2;

    var translation = [
      this.position[0] ,
      this.position[1],
      this.position[2]
    ]

    this.translationAnchor = [
      -this.centerX,
      -this.centerY,
      -this.centerZ
    ]

    mat4.identity(this.mT, this.mT);
    mat4.identity(this.mTAnchor, this.mTAnchor);

    mat4.translate(this.mTAnchor, this.mTAnchor, this.translationAnchor);
    mat4.translate(this.mT, this.mT, translation);
  }

  rotateX(rx){
    glmatrix.mat4.fromXRotation(this.mRX, rx);
		// glmatrix.mat4.rotateX(this.mRX, this.mRX, rx + Math.PI/2)
	}

	rotateY(ry){
    console.log('rotate Y ');
    glmatrix.mat4.identity(this.mRY);
    glmatrix.mat4.fromYRotation(this.mRY, ry);
		// glmatrix.mat4.rotateY(this.mRY, this.mRY, ry - Math.PI/2)
	}

  // getEyes(){
  //   let v = this.eyes.slice();
  //
  //   // console.log(v);
  //   mat4.identity(this.m);
  //
  //   mat4.multiply(this.m, this.m, this.mT);
  //   mat4.multiply(this.m, this.m, this.mRY);
  //   mat4.multiply(this.m, this.m, this.mTAnchor);
  //
  //
  //   let eyes = [];
  //
  //   for (var i = 0; i < v.length; i++) {
  //     let vect = [];
  //     let vect2 = [];
  //     vect[0] = v[i][0];
  //     vect[1] = v[i][1];
  //     vect[2] = v[i][2];
  //
  //     vec3.transformMat4(vect2, vect, this.m);
  //     eyes.push(vect2);
  //   }
  //
  //   return eyes;
  // }

  getPoints(){
    let v = this.vertices.slice();

    // console.log(v);
    mat4.identity(this.m);

    mat4.multiply(this.m, this.m, this.mT);
    mat4.multiply(this.m, this.m, this.mRY);
    mat4.multiply(this.m, this.m, this.mTAnchor);




    let verts = [];

    for (var i = 0; i < v.length; i++) {
      // let vect = [];
      // let vect2 = [];
      // vect[0] = v[i][0];
      // vect[1] = v[i][1];
      // vect[2] = v[i][2];

      vec3.transformMat4(v[i], v[i], this.m);
      // verts.push(v[i]);
    }

    this.positionedEyes = []
    for (var i = 0; i < this.eyes.length; i++) {
      // let vect = [];
      // let vect2 = [];
      // vect[0] = this.eyes[i][0];
      // vect[1] = this.eyes[i][1];
      // vect[2] = this.eyes[i][2];

      vec3.transformMat4(this.eyes[i], this.eyes[i], this.m);
      // this.positionedEyes.push(this.eyes[i]);
    }

    return v;
  }
}

export default Animal;
