precision mediump float;


uniform float alpha;
uniform sampler2D texture;
// varying vec3 vPosition;
// varying vec3 vColor;
// uniform vec2 resolutions;

varying float vCounters;
varying vec2 vUV;

void main() {

  // vec2 st = gl_FragCoord.xy/resolutions;
  // float y = step(st.y, .5);
  // float colorS = y, .5);
  // vec3 color = vec3(y);
  vec4 color = vec4(0.0, 1.0, 1.0, .2);
  // color *= texture2D( texture, vUV );

  gl_FragColor = color;
  gl_FragColor.a *= step(vCounters, 1.0);
}
