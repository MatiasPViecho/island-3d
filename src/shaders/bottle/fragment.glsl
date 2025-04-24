uniform sampler2D map;
uniform float uTime;
uniform float uShowcaseBrightness;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/directionalLight.glsl
#include ../includes/ambientLight.glsl

void main(){
  
  vec4 color = texture2D(map, vUv);
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 light = vec3(0.0);
  vec3 normal = normalize(vNormal);

  light += ambientLight(vec3(1.0), 0.7);
  light += directionalLight(
      vec3(1.0, 0.0, 0.0),               // light Color
      80.0,                    // light Intensity
      normal,                 //Normal
      vec3(0.0, 0.0, 0.0),   //Light Position
      viewDirection,          //View Direction
      30.0                  //Specular
  );
  // add light to the color
  color.rgb *= light;
  color *= 1.0 + uShowcaseBrightness;
  gl_FragColor = color;
  //gl_FragColor = vec4(uShowcaseBrightness, 0.0, 0.0, 1.0);
}