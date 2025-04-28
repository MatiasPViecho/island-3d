/**
* This shader was made thanks to maximeheckel, check out his work from his blog
 https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/
  */
precision highp float;
uniform sampler2D tDiffuse;

uniform vec2 uResolution;
uniform float uColorNum;
uniform float uPixelSize;
uniform float uFadeMultiplier;
uniform float uAllowDither; // will be 0 or 1
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;



const float bayerMatrix8x8[64] = float[64](
    0.0/ 64.0, 48.0/ 64.0, 12.0/ 64.0, 60.0/ 64.0,  3.0/ 64.0, 51.0/ 64.0, 15.0/ 64.0, 63.0/ 64.0,
  32.0/ 64.0, 16.0/ 64.0, 44.0/ 64.0, 28.0/ 64.0, 35.0/ 64.0, 19.0/ 64.0, 47.0/ 64.0, 31.0/ 64.0,
    8.0/ 64.0, 56.0/ 64.0,  4.0/ 64.0, 52.0/ 64.0, 11.0/ 64.0, 59.0/ 64.0,  7.0/ 64.0, 55.0/ 64.0,
  40.0/ 64.0, 24.0/ 64.0, 36.0/ 64.0, 20.0/ 64.0, 43.0/ 64.0, 27.0/ 64.0, 39.0/ 64.0, 23.0/ 64.0,
    2.0/ 64.0, 50.0/ 64.0, 14.0/ 64.0, 62.0/ 64.0,  1.0/ 64.0, 49.0/ 64.0, 13.0/ 64.0, 61.0/ 64.0,
  34.0/ 64.0, 18.0/ 64.0, 46.0/ 64.0, 30.0/ 64.0, 33.0/ 64.0, 17.0/ 64.0, 45.0/ 64.0, 29.0/ 64.0,
  10.0/ 64.0, 58.0/ 64.0,  6.0/ 64.0, 54.0/ 64.0,  9.0/ 64.0, 57.0/ 64.0,  5.0/ 64.0, 53.0/ 64.0,
  42.0/ 64.0, 26.0/ 64.0, 38.0/ 64.0, 22.0/ 64.0, 41.0/ 64.0, 25.0/ 64.0, 37.0/ 64.0, 21.0 / 64.0
);


const vec3 palette[16] = vec3[16](
    vec3(1.0, 0.0, 0.0),  // Red
    vec3(0.0, 1.0, 0.0),  // Green
    vec3(0.0, 0.0, 1.0),  // Blue
    vec3(1.0, 1.0, 0.0),  // Yellow
    vec3(1.0, 0.0, 1.0),  // Magenta
    vec3(0.0, 1.0, 1.0),  // Cyan
    vec3(1.0, 0.5, 0.0),  // Orange
    vec3(0.5, 0.0, 1.0),  // Purple
    vec3(0.5, 1.0, 0.0),  // Lime
    vec3(1.0, 0.0, 0.5),  // Pink
    vec3(0.0, 0.5, 1.0),  // Sky Blue
    vec3(0.0, 1.0, 0.5),  // Mint
    vec3(1.0, 0.75, 0.0), // Gold
    vec3(0.75, 0.0, 1.0), // Violet
    vec3(0.0, 1.0, 0.75), // Aquamarine
    vec3(1.0, 0.0, 0.75)  // Rose
);

const int paletteLength = 16;
vec3 hsl2rgb(vec3 c)
{
	vec3 rgb = clamp(abs(mod(c.x*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
	
	return c.z + c.y * (rgb - .5) * (1. - abs(2. * c.z - 1.));
}
vec3 rgb2hsl(vec3 c) {
	float h = 0.;
	float s = 0.;
	float l = 0.;
	float r = c.r;
	float g = c.g;
	float b = c.b;
	float cMin = min(r, min(g, b));
	float cMax = max(r, max(g, b));
	
	l = (cMax + cMin) / 2.;
	if (cMax > cMin) {
		float cDelta = cMax - cMin;
		s = l < .0 ? cDelta / (cMax+cMin) : cDelta / (2. - (cMax + cMin));
		if(r == cMax) {
			h = (g - b) / cDelta;
		} else if(g == cMax) {
			h = 2. + (b - r) / cDelta;
		} else {
			h = 4. + (r - g) / cDelta;
		}
		
		if(h < 0.) {
			h += 6.;
		}
		h = h / 6.;
	}
	return vec3(h, s, l);
}

float hueDistance(float h1, float h2)
{
	float diff = abs(h1 - h2);
	
	return min(abs(1. - diff), diff);
}

const float lightnessSteps = 16.;

// SOURCE: http://alex-charlton.com/posts/Dithering_on_the_GPU/
float lightnessStep(float l) {
	return floor((.5 + l * lightnessSteps)) / lightnessSteps;
}

const float SaturationSteps = 16.;

float SaturationStep(float s) {
	/* Quantize the saturation to one of SaturationSteps values */
	return floor((.5 + s * SaturationSteps)) / SaturationSteps;
}

vec3[2] closestColors(float hue) {
    vec3 ret[2];
    vec3 closest = vec3(-2, 0, 0);
    vec3 secondClosest = vec3(-2, 0, 0);
    vec3 temp;
    for (int i = 0; i < paletteLength; ++i) {
        temp = rgb2hsl(palette[i]);
        float tempDistance = hueDistance(temp.x, hue);
        if (tempDistance < hueDistance(closest.x, hue)) {
            secondClosest = closest;
            closest = temp;
        } else {
            if (tempDistance < hueDistance(secondClosest.x, hue)) {
                secondClosest = temp;
            }
        }
    }
    ret[0] = closest;
    ret[1] = secondClosest;
    return ret;
}


vec3 dither(vec2 uv, vec3 color) {
  int x = int(uv.x * uResolution.x) % 8;
  int y = int(uv.y * uResolution.y) % 8;
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.88;

  color.rgb += threshold;
  color.r = floor(color.r * (uColorNum - 1.0) + 0.5) / (uColorNum - 1.0);
  color.g = floor(color.g * (uColorNum - 1.0) + 0.5) / (uColorNum - 1.0);
  color.b = floor(color.b * (uColorNum - 1.0) + 0.5) / (uColorNum - 1.0);

  return color;
}



vec3 ACESFilm(vec3 x)
{
    float a = 2.51f;
    float b = 0.03f;
    float c = 2.43f;
    float d = 0.59f;
    float e = 0.14f;
    return clamp((x*(a*x + b)) / (x*(c*x + d) + e), 0.0f, 1.0f);
}


#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
void main()
{
  
  // 2nd method of ditter
  // frankensteneised method 
  vec2 normalizedPixelSize = uPixelSize / uResolution;
  vec2 uvPixel = normalizedPixelSize * floor(vUv / normalizedPixelSize);
  vec4 color = texture2D(tDiffuse, uvPixel);
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  color.rgb = dither(vUv, color.rgb) * (uFadeMultiplier);

  // lights 
  vec3 light = vec3(0.0);

  light += ambientLight(vec3(1.0), 4.0);
  // light += ambientLight( 
  //   vec3(0.2),
  //   0.04);
  
  // apply lights
  //color.rgb = ACESFilm(color.rgb);
  color.rgb *= light;
  //color.rgb = ACESFilm(color.rgb);

  //color.rgb = pow(col, vec3(1.0/1.8));
  gl_FragColor = vec4(color.rgb, uFadeMultiplier);
}