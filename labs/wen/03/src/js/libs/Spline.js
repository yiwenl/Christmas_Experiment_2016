// import Matrices from '../scripts/helpers/gl_helpers/Matrices';

class Spline {

  constructor(points){

    this.c = [];

    this.point = 0;
    this.intPoint = 0;
    this.wieght = 0;
    this.pa = 0;
    this.pb = 0;
    this.pc = 0;
    this.pd = 0;
    this.w2 = 0;
    this.w3 = 0;
    this.w4 = 0;
    this.v3 = [];

    this.points = points;

  }

  getPoint(k) {

		this.point = ( this.points.length - 1 ) * k;
		this.intPoint = Math.floor( this.point );
		this.weight = this.point - this.intPoint;

		this.c[ 0 ] = this.intPoint === 0 ? this.intPoint : this.intPoint - 1;
		this.c[ 1 ] = this.intPoint;
		this.c[ 2 ] = this.intPoint > this.points.length - 2 ? this.intPoint : this.intPoint + 1;
		this.c[ 3 ] = this.intPoint > this.points.length - 3 ? this.intPoint : this.intPoint + 2;

    this.pa = this.points[ this.c[ 0 ] ];
    this.pb = this.points[ this.c[ 1 ] ];
    this.pc = this.points[ this.c[ 2 ] ];
    this.pd = this.points[ this.c[ 3 ] ];

		this.w2 = this.weight * this.weight;
		this.w3 = this.weight * this.w2;

		// v3.x = interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );
		// v3.y = interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );
		// v3.z = interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );

    this.v3[0] = this.interpolate( this.pa[0], this.pb[0], this.pc[0], this.pd[0], this.weight, this.w2, this.w3 );
		this.v3[1] = this.interpolate( this.pa[1], this.pb[1], this.pc[1], this.pd[1], this.weight, this.w2, this.w3 );
		this.v3[2] = this.interpolate( this.pa[2], this.pb[2], this.pc[2], this.pd[2], this.weight, this.w2, this.w3 );

    // console.log(this.v3);
		return [this.v3[0], this.v3[1], this.v3[2]];

	};

  interpolate(p0, p1, p2, p3, t, t2, t3 ){
    var v0 = ( p2 - p0 ) * 0.5,
			  v1 = ( p3 - p1 ) * 0.5;

		return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;


    // var v0 = Matrices.multiplyVectorsScalar(0.5, Matrices.subtractVectors( p2, p0 )),
		// 	  v1 = Matrices.multiplyVectorsScalar(0.5, Matrices.subtractVectors( p3, p1 ));
    //
    //
    // let p1minusp2 = Matrices.subtractVectors( p1, p2 ); //( p1 - p2 )
    //
    // // ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3
    // let aExpr = Matrices.multiplyVectorsScalar(2, p1minusp2);
    // let bExpr = Matrices.addVectors(aExpr, Matrices.addVectors(v0, v1));
    // let firstExpr = Matrices.multiplyVectorsScalar(t3, bExpr);
    //
    // console.log("here");
    // // ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2
    // let cExpr = Matrices.multiplyVectorsScalar(-3, p1minusp2);
    // let dExpr = Matrices.multiplyVectorsScalar(-2, v0);
    // let eExpr = Matrices.addVectors(cExpr, dExpr);
    // let fExpr = Matrices.subtractVectors(eExpr, v1);
    // let secondExpr = Matrices.multiplyVectorsScalar(t2, fExpr);
    //
    // // v0 * t + p1
    // let thirdExpr = Matrices.addVectors(Matrices.multiplyVectorsScalar(t, v0), p1);
    //
    // let finalPoint = Matrices.addVectors(Matrices.addVectors(firstExpr, secondExpr), thirdExpr);
    //
    // return finalPoint;
  }
}

export default Spline;
