// softlight.vert

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureGradient;
uniform sampler2D textureGradientMap;
uniform float offset;


float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
    return mix(
        sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend), 
        2.0 * base * blend + base * base * (1.0 - 2.0 * blend), 
        step(base, vec3(0.5))
    );
}

void main(void) {
    vec3 color = texture2D(texture, vTextureCoord).rgb;
    float br = luma(color);
    vec3 colorMap = texture2D(textureGradientMap, vec2(br, .5)).rgb;
    color = mix(color, colorMap, .5 * offset);


    vec3 colorGradient = texture2D(textureGradient, vTextureCoord).rgb;
    vec3 colorBlend = blendSoftLight(color, colorGradient);

    color = mix(color, colorBlend, 0.25 * offset);

    gl_FragColor = vec4(color, 1.0);
}