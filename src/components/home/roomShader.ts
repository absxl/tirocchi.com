export const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTextureA;
uniform sampler2D uTextureB;
uniform float uTransition;
uniform float uDim;
uniform vec2 uPan;
uniform float uBarrel;
uniform vec2 uResolution;
uniform vec2 uTexA;
uniform vec2 uTexB;
uniform float uTime;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Scale so the texture covers the screen without distortion (crops the short side).
vec2 coverScale(vec2 texSize, vec2 resolution) {
  float screenAspect = resolution.x / max(resolution.y, 1.0);
  float texAspect = texSize.x / max(texSize.y, 1.0);
  return screenAspect > texAspect
    ? vec2(1.0, texAspect / screenAspect)
    : vec2(screenAspect / texAspect, 1.0);
}

vec2 sampleUv(vec2 uv, vec2 scale) {
  vec2 centered = uv - 0.5;
  centered *= 1.0 + uBarrel * dot(centered, centered);
  vec2 outUv = 0.5 + centered * scale;
  outUv += uPan * (1.0 - scale) * 0.5;
  return clamp(outUv, 0.0, 1.0);
}

void main() {
  vec3 a = texture2D(uTextureA, sampleUv(vUv, coverScale(uTexA, uResolution))).rgb;
  vec3 b = texture2D(uTextureB, sampleUv(vUv, coverScale(uTexB, uResolution))).rgb;

  float t = smoothstep(0.0, 1.0, uTransition);
  vec3 color = mix(a, b, t);
  color *= 1.0 - uDim * sin(3.14159265 * t);

  float vignette = smoothstep(0.95, 0.25, length(vUv - 0.5));
  color *= mix(0.68, 1.0, vignette);

  float grain = hash(vUv * uResolution + uTime) - 0.5;
  color += grain * 0.02;

  gl_FragColor = vec4(color, 1.0);
}
`;
