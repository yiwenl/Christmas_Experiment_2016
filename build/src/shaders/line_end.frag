precision highp float;


uniform float alpha;
uniform float ratio;
uniform float uTime;
// uniform float hide;
// uniform sampler2D texture;
varying vec3 vPosition;
varying float vCounters;
// varying float vCounters;
// varying vec3 vColor;
// uniform vec2 resolutions;


void main() {

  vec4 color = vec4(alpha);

  // color *= smoothstep(vPosition.y,vPosition.y * 1.0, 1.);
	// color *= smoothstep(hide,hide+0.15,1.-vT);
  // vec4 color = vec4(1.0);
  // vec4 colorEnd = color;

  // if(colorEnd.a < .01){
  //   discard;
  // }

  // colorEnd.a = 1.0;
  // color *= texture2D( texture, vUV );

  gl_FragColor = color;
  gl_FragColor.a *= step(vCounters, ratio);

}
