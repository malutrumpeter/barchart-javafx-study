#ifdef GL_ES
#extension GL_OES_standard_derivatives : enable
precision highp float;
precision highp int;
#define HIGHP highp
#define MEDIUMP mediump
#define LOWP lowp
#else
#define HIGHP
#define MEDIUMP
#define LOWP
#endif
varying vec2 texCoord0;
varying vec2 texCoord1;
varying LOWP vec4 perVertexColor;
uniform vec2 oinvarcradii;
uniform vec2 idim;
float rrmask(vec2 abstco, vec2 flatdim, vec2 invarcradii) {
vec2 ecctco = max(abstco - flatdim, 0.0010) * invarcradii;
float ecclensq = dot(ecctco, ecctco);
float pix = dot(ecctco / ecclensq, invarcradii);
return clamp(0.5 + (1.0 + 0.25 * pix * pix - ecclensq) / (2.0 * pix), 0.0, 1.0);
}
float pgrammask(vec2 abstco, vec2 tcc) {
vec2 cov = clamp(tcc + 0.5 - abstco, 0.0, 1.0);
cov = min(cov, tcc * 2.0);
return cov.x * cov.y;
}
LOWP float mask(vec2 tco, vec2 oflatdim) {
vec2 abstco = abs(tco);
float ocov = rrmask(abstco, oflatdim, oinvarcradii);
float icov = pgrammask(abstco, idim);
return clamp(ocov - icov, 0.0, 1.0);
}
void main() {
gl_FragColor = mask(texCoord0, texCoord1) * perVertexColor;
}
