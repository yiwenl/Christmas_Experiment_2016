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

  vec4 color = vec4(alpha);
  // vec4 color = vec4(1.0);
  vec4 transparency = texture2D( texture, vUV );

  if(transparency.a < .1){
    discard;
  }

  color *= texture2D( texture, vUV );

  gl_FragColor = color;
  gl_FragColor.a *= step(vCounters, 1.0);
}
