varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
  // varyings
  vUv = uv;
  vPosition = modelPosition.xyz;
  vNormal = modelNormal.xyz;
}