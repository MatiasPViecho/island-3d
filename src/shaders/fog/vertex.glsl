varying vec2 vUv;
varying float vFogDepth;
varying vec3 vPosition;
varying vec3 vNormal;
void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
  // varyings
  vUv = uv;
  vNormal = modelNormal.xyz;
  vPosition = modelPosition.xyz;
}