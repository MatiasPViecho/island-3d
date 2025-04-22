/**
Inspiration from https://www.shadertoy.com/view/ssV3zh and https://discourse.threejs.org/t/how-to-render-fog-on-top-of-ssao/35441/4
*/
uniform sampler2D tDiffuse;
varying vec2 vUv;
varying float vFogDepth;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl

vec3 ACESFilm(vec3 x)
{
    float a = 2.51f;
    float b = 0.03f;
    float c = 2.43f;
    float d = 0.59f;
    float e = 0.14f;
    return clamp((x*(a*x + b)) / (x*(c*x + d) + e), 0.0f, 1.0f);
}

void main(){
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec4 mainScene = texture2D(tDiffuse, vUv);
  vec3 light = vec3(0.0);
  light += ambientLight( 
    vec3(1.0),
    0.01);
  vec3 col = mainScene.rgb;
  col += light;
  //col = ACESFilm(col);
  col = pow(col, vec3(1.0/1.8));
  gl_FragColor = vec4(col, 1.0);
}