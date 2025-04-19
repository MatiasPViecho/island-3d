uniform sampler2D map;
uniform float uTime;
uniform float uShowcaseBrightness;

varying vec2 vUv;
varying vec3 vPosition;

void main(){
  
  vec4 color = texture2D(map, vUv);
  color *= 1.0 + uShowcaseBrightness;
  gl_FragColor = color;
  //gl_FragColor = vec4(uShowcaseBrightness, 0.0, 0.0, 1.0);
}