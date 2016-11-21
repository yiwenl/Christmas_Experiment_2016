import alfrid, { GL } from 'alfrid';

let gl, pivotX, pivotY, axis;

let tempArray1 = [];
let tempArray2 = [];
let tempArray3 = [];
class Line extends alfrid.Mesh {
  constructor(vertices, drawMode = GL.TRIANGLES){

    gl = GL;
      super(drawMode)

    // indices = [];
    let vert = [
      [0, 0, 0],
      [100/800, 250/800, 0],
      [50/800, 200/800 ,0],
      [0, 200/800 ,0],
      [-100/800, 220/800 ,0],
      [-70/800, 300/800 ,0]
    ];


    this.positions = [];
    this.directions = [];
    this.indicesArray = [];
    this.counters = [];
    this.uvs = [];
    this.previous = [];
  	this.next = [];


    this.vert = vertices || vert;


    this.line();

  }

  line(needsUpdate = true){

    let v = this.vert;

    this.positions.length = v.length * 2;
    this.counters.length = v.length * 2;

    var index = 0;
    var indexC = 0;
    for (var i = 0; i < v.length; i++) {


      if(needsUpdate){
        var c = i/v.length;
        this.counters[indexC++] = c;
        this.counters[indexC++] = c;
      }

      // console.log(this.positions.length);
      this.positions[index++] = v[i][0];
      this.positions[index++] = v[i][1];
      this.positions[index++] = v[i][2];

      this.positions[index++] = v[i][0];
      this.positions[index++] = v[i][1];
      this.positions[index++] = v[i][2];


    }

    this.process(needsUpdate);
  }

  compareV3 = function( a, b ) {
  	var aa = a * 6;
  	var ab = b * 6;
    // console.log(this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );
  	return ( this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );
  }

  copyV3 = function( a ) {
	  var aa = a * 6;
    // console.log(this.positions[ aa ], this.positions[ aa + 1 ], this.positions[ aa + 2 ]);

    tempArray1[0] = this.positions[ aa ];
    tempArray1[1] = this.positions[ aa + 1 ];
    tempArray1[2] = this.positions[ aa + 2 ];

  }

  process(needsUpdate){

    var l = this.positions.length / 6;

    var v, index = 0;

    // this.next = [];

    this.previous.length = this.positions.length;
    this.previous.length = this.positions.length;


    if( this.compareV3( 0, l - 1 ) ){
      this.copyV3( l - 2 );
    } else {
      this.copyV3( 0 );
    }

    this.previous[index++] = tempArray1[0];
    this.previous[index++] = tempArray1[1];
    this.previous[index++] = tempArray1[2];

    this.previous[index++] = tempArray1[0];
    this.previous[index++] = tempArray1[1];
    this.previous[index++] = tempArray1[2];


    for( var j = 0; j < l - 1; j++ ) {
      this.copyV3( j );

      this.previous[index++] = tempArray1[0];
      this.previous[index++] = tempArray1[1];
      this.previous[index++] = tempArray1[2];

      this.previous[index++] = tempArray1[0];
      this.previous[index++] = tempArray1[1];
      this.previous[index++] = tempArray1[2];


    }

    index = 0;

    for( var j = 1; j < l; j++ ) {
      this.copyV3( j );

      this.next[index++] = tempArray1[0];
      this.next[index++] = tempArray1[1];
      this.next[index++] = tempArray1[2];

      this.next[index++] = tempArray1[0];
      this.next[index++] = tempArray1[1];
      this.next[index++] = tempArray1[2];
    }

    if( this.compareV3( l - 1, 0 ) ){
      this.copyV3( 1 );
    } else {
      this.copyV3( l - 1 );
    }

    this.next[index++] = this.positions[ this.positions.length-3 ];
    this.next[index++] = this.positions[ this.positions.length-2 ];
    this.next[index++] = this.positions[ this.positions.length-1 ];

    this.next[index++] = this.positions[ this.positions.length-3 ];
    this.next[index++] = this.positions[ this.positions.length-2 ];
    this.next[index++] = this.positions[ this.positions.length-1 ];

    // this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
    // this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
    this.bufferVertex(this.positions, false);
    this.bufferData(this.next, 'aNext', 3, false);
    this.bufferData(this.previous, 'aPrevious', 3, false);

    if(needsUpdate){
      index = 0;
      this.uvs = [];
      for( var j = 0; j < l; j++ ) {
        this.uvs[index++] = j / ( l - 1 );
        this.uvs[index++] = 0;

        this.uvs[index++] = j / ( l - 1 );
        this.uvs[index++] = 1;
      }

      index = 0;
      this.indicesArray = [];
      for( var j = 0; j < l - 1; j++ ) {
        var n = j * 2;

        this.indicesArray[index++] = n;
        this.indicesArray[index++] = n+1;
        this.indicesArray[index++] = n+2;

        this.indicesArray[index++] = n+2;
        this.indicesArray[index++] = n+1;
        this.indicesArray[index++] = n+3;
      }

      index = 0;
      this.directions = [];
      for (var i = 0; i < this.positions.length; i+=3) {
        if(i % 2 === 0){
          this.directions[index++] = 1;
        }
        else {
          this.directions[index++] = -1;
        }
      }

      this.bufferIndex(this.indicesArray, false);
      this.bufferData(this.directions, 'direction', 1, false);
      this.bufferTexCoord(this.uvs, false);
      this.bufferData(this.counters, 'aCounters', 1, false);
    }

  }

  render(points, needsUpdate = false){

    this.vert = points;

    this.line(needsUpdate);
  }
}

export default Line;
