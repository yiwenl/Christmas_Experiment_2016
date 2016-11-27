precision mediump float;


uniform float alpha;
// uniform sampler2D texture;
// varying vec3 vPosition;
// varying vec3 vColor;
// uniform vec2 resolutions;


void main() {

  vec4 color = vec4(alpha);
  // vec4 color = vec4(1.0);
  // vec4 colorEnd = color;

  // if(colorEnd.a < .01){
  //   discard;
  // }

  // colorEnd.a = 1.0;
  // color *= texture2D( texture, vUV );

  gl_FragColor = color;
  // gl_FragColor.a *= step(vCounters, 1.0);

}
