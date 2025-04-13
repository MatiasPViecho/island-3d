// goes here and not in includes because is not really re-usable, specific to water shader
#include ../includes/perlinClassic3D.glsl
float waveElevation(
  vec3 position, 
  vec2 bigWavesFrequency, 
  float bigWavesSpeed, 
  float bigWavesElevation, 
  float smallWavesFrequency, 
  float smallWavesSpeed, 
  float smallWavesElevation, 
  float time, 
  float smallIterations)
{
  // Elevation
    float elevation = sin(position.x * bigWavesFrequency.x + time * bigWavesSpeed) *
                      sin(position.z * bigWavesFrequency.y + time * bigWavesSpeed) *
                      bigWavesElevation;

    for(float i = 1.0; i <= smallIterations; i++)
    {
        elevation -= abs(perlinClassic3D(vec3(position.xz * smallWavesFrequency * i, time * smallWavesSpeed)) * smallWavesElevation / i);
    }

    return elevation;
}