uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;
#include ./waveElevation.glsl

// intermediary function so we don't need to write all 
// those extra parameters every time we call the function
float waveElevationForPosition(vec3 position)
{
    return waveElevation(
        position.xyz, 
        uBigWavesFrequency, 
        uBigWavesSpeed, 
        uBigWavesElevation, 
        uSmallWavesFrequency, 
        uSmallWavesSpeed, 
        uSmallWavesElevation, 
        uTime, 
        uSmallIterations);
}

void main()
{
    // Base Position
    float shift = 0.01;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, - shift);

    float elevation = waveElevationForPosition(modelPosition.xyz);
    modelPosition.y += elevation; 
    modelPositionA.y += waveElevationForPosition(modelPositionA);
    modelPositionB.y += waveElevationForPosition(modelPositionB);

    // Compute Normal
    vec3 toA = normalize(modelPositionA - modelPosition.xyz);
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);
    vec3 computedNormal = cross(toA, toB);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Varyings
    vElevation = elevation;
    vNormal = computedNormal;
    vPosition = modelPosition.xyz;
}