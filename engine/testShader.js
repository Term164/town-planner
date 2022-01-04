const vertex = `#version 300 es
precision mediump float;
layout (location = 0) in vec4 aPosition;
layout (location = 1) in vec2 aTexCoord;
layout (location = 2) in vec3 aNormal;

uniform mat4 uViewModel;
uniform mat4 uProjection;


out vec3 vVertexPosition;
out vec3 vNormal;
out vec2 vTexCoord;

void main() {
    vVertexPosition = (uViewModel * aPosition).xyz;
    vNormal = aNormal;
    vTexCoord = aTexCoord;
    gl_Position = uProjection * vec4(vVertexPosition, 1);
}
`;

const fragment = `#version 300 es
precision mediump float;

uniform mat4 uViewModel;

uniform mediump sampler2D uTexture;

uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;

uniform vec3 uLightPosition;
uniform vec3 uLightAttenuation;
uniform float uShininess;

in vec3 vVertexPosition;
in vec3 vNormal;
in vec2 vTexCoord;

out vec4 oColor;

void main() {

    vec3 lightPosition = (uViewModel * vec4(uLightPosition, 0)).xyz;
    float d = distance(vVertexPosition, lightPosition);
    float attenuation = 1.0 / dot(uLightAttenuation, vec3(1, d, d * d));
    
    vec3 N = normalize((uViewModel * vec4(vNormal, 0)).xyz);
    vec3 L = normalize(lightPosition - vVertexPosition);
    vec3 E = normalize(-vVertexPosition);

    vec3 R = normalize(reflect(-L, N));

    float lambert = max(0.0, dot(L, N));
    float phong = pow(max(0.0, dot(E, R)), uShininess);

    vec3 ambient = uAmbientColor;
    vec3 diffuse = uDiffuseColor * lambert;
    vec3 specular = uSpecularColor * phong;

    vec3 light = (ambient + diffuse + specular) * attenuation;

    oColor = texture(uTexture, vTexCoord) * vec4(light, 1);
}
`;

export const shaders = {
    simple: { vertex, fragment }
};
