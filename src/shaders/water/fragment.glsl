uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uTime;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/pointLight.glsl
#include ../includes/directionalLight.glsl
void main()
{

    // Base color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    // Directional Light
    vec3 light = vec3(0.0);
    light += directionalLight(
        vec3(1.0),               // light Color
        7.0,                    // light Intensity
        normal,                 //Normal
        vec3(0.0, 1.25, 0.0),   //Light Position
        viewDirection,          //View Direction
        30.0                  //Specular
    );
    light += pointLight(
        vec3(1.0),               // light Color
        20.0,                    // light Intensity
        normal,                 //Normal
        vec3(4.0, 1.0, 3.0),   //Light Position
        viewDirection,          //View Direction
        60.0,                  //Specular
        vPosition,     // Position
        0.05                     // Light Decay
    );
    // add light to the color
    color *= light;

    color *= vec3(0.5, 0.1, 0.1);
    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}