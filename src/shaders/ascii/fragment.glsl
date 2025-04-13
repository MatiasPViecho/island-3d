// thanks to https://evanw.github.io/font-texture-generator/ for its font atlas generator

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/directionalLight.glsl
#include ../includes/ambientLight.glsl
void main()
{
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 color = vec3(0.4, 0.0, 0.0);

  // Light Sources
  vec3 light = vec3(0.0);

  light += ambientLight(
    vec3(0.9, 0.5, 0.3),
    0.7
  );
  light += directionalLight(
    vec3(0.3, 0.7, 1.0),
    3.8,
    normal,
    vec3(-4.0, -4.0, -4.0),
    viewDirection,
    60.0
  );

  color *= light;
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}