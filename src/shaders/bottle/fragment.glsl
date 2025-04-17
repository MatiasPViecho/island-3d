uniform sampler2D map;
uniform float uTime;
uniform float uDisableGlow;

varying vec2 vUv;
varying vec3 vPosition;

void main(){
  vec4 color = texture2D(map, vUv);
  color.r = mix(color.r, abs(sin(uTime * 0.8) * 2.0), max(0.0, distance(vPosition.yz, vec2((vPosition.y) / 4.0, (vPosition.z - 0.1) / 4.0) * 8.0) - abs(cos(uTime) * 0.8)) * uDisableGlow );
  color.g = mix(color.g, abs(sin(uTime * 0.8) * 2.0), max(0.0, distance(vPosition.yz, vec2((vPosition.y) / 4.0, (vPosition.z - 0.1) / 4.0) * 8.0) - abs(cos(uTime) * 0.8)) * uDisableGlow );
  gl_FragColor = color;

  //gl_FragColor = vec4(distance(vPosition.yz, vec2((vPosition.y) / 4.0, (vPosition.z - 0.1) / 4.0) * 8.0), 0.0, 0.0, 1.0);
}