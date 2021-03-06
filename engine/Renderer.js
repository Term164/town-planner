import { mat4 } from '../../lib/gl-matrix-module.js';

import { WebGL } from './WebGL.js';

import { shaders } from './newShader.js';
import { vec3, vec4 } from '../lib/gl-matrix-module.js';

// This class prepares all assets for use with WebGL
// and takes care of rendering.

export class Renderer {

    constructor(gl) {
        this.gl = gl;
        this.glObjects = new Map();
        this.programs = WebGL.buildPrograms(gl, shaders);

        //gl.clearColor(0, 0.10, 0.25, 1); // night sky
        //gl.clearColor((0/255), (204/255), (255/255), 1);        


        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
    }

    prepareBufferView(bufferView) {
        if (this.glObjects.has(bufferView)) {
            return this.glObjects.get(bufferView);
        }

        const buffer = new DataView(
            bufferView.buffer,
            bufferView.byteOffset,
            bufferView.byteLength);
        const glBuffer = WebGL.createBuffer(this.gl, {
            target : bufferView.target,
            data   : buffer
        });
        this.glObjects.set(bufferView, glBuffer);
        return glBuffer;
    }

    prepareSampler(sampler) {
        if (this.glObjects.has(sampler)) {
            return this.glObjects.get(sampler);
        }

        const glSampler = WebGL.createSampler(this.gl, sampler);
        this.glObjects.set(sampler, glSampler);
        return glSampler;
    }

    prepareImage(image) {
        if (this.glObjects.has(image)) {
            return this.glObjects.get(image);
        }

        const glTexture = WebGL.createTexture(this.gl, { image });
        this.glObjects.set(image, glTexture);
        return glTexture;
    }

    prepareTexture(texture) {
        const gl = this.gl;

        this.prepareSampler(texture.sampler);
        const glTexture = this.prepareImage(texture.image);

        const mipmapModes = [
            gl.NEAREST_MIPMAP_NEAREST,
            gl.NEAREST_MIPMAP_LINEAR,
            gl.LINEAR_MIPMAP_NEAREST,
            gl.LINEAR_MIPMAP_LINEAR,
        ];

        if (!texture.hasMipmaps && mipmapModes.includes(texture.sampler.min)) {
            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.generateMipmap(gl.TEXTURE_2D);
            texture.hasMipmaps = true;
        }
    }

    prepareMaterial(material) {
        if (material.baseColorTexture) {
            this.prepareTexture(material.baseColorTexture);
        }
        if (material.metallicRoughnessTexture) {
            this.prepareTexture(material.metallicRoughnessTexture);
        }
        if (material.normalTexture) {
            this.prepareTexture(material.normalTexture);
        }
        if (material.occlusionTexture) {
            this.prepareTexture(material.occlusionTexture);
        }
        if (material.emissiveTexture) {
            this.prepareTexture(material.emissiveTexture);
        }
    }

    preparePrimitive(primitive) {
        if (this.glObjects.has(primitive)) {
            return this.glObjects.get(primitive);
        }

        this.prepareMaterial(primitive.material);

        const gl = this.gl;
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        if (primitive.indices) {
            const bufferView = primitive.indices.bufferView;
            bufferView.target = gl.ELEMENT_ARRAY_BUFFER;
            const buffer = this.prepareBufferView(bufferView);
            gl.bindBuffer(bufferView.target, buffer);
        }

        // this is an application-scoped convention, matching the shader
        const attributeNameToIndexMap = {
            POSITION   : 0,
            TEXCOORD_0 : 1,
            NORMAL     : 2,
        };

        for (const name in primitive.attributes) {
            const accessor = primitive.attributes[name];
            const bufferView = accessor.bufferView;
            const attributeIndex = attributeNameToIndexMap[name];

            if (attributeIndex !== undefined) {
                bufferView.target = gl.ARRAY_BUFFER;
                const buffer = this.prepareBufferView(bufferView);
                gl.bindBuffer(bufferView.target, buffer);
                gl.enableVertexAttribArray(attributeIndex);
                gl.vertexAttribPointer(
                    attributeIndex,
                    accessor.numComponents,
                    accessor.componentType,
                    accessor.normalized,
                    bufferView.byteStride,
                    accessor.byteOffset);
            }
        }

        this.glObjects.set(primitive, vao);
        return vao;
    }

    prepareMesh(mesh) {
        for (const primitive of mesh.primitives) {
            this.preparePrimitive(primitive);
        }
    }

    prepareNode(node) {
        if (node.mesh) {
            this.prepareMesh(node.mesh);
        }
        for (const child of node.children) {
            this.prepareNode(child);
        }
    }

    prepareScene(scene) {
        for (const node of scene.nodes) {
            this.prepareNode(node);
        }
    }

    render(scene, camera, lights) {
        const gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const program = this.programs.simple;
        gl.useProgram(program.program);
        gl.uniform1i(program.uniforms.uTexture, 0);


       
        

        const viewMatrix = mat4.clone(camera.matrix);
        mat4.invert(viewMatrix, viewMatrix);
        gl.uniformMatrix4fv(program.uniforms.uViewMatrix, false, viewMatrix);

        const projectionMatrix = mat4.clone(camera.projectionMatrix);
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, projectionMatrix);
        
        for (const node of scene.nodes) {
            this.loadLights(node, lights);
            this.renderNode(node, viewMatrix);
        }
    }

    renderNode(node, viewMatrix) {

        
        const gl = this.gl;
        viewMatrix = mat4.clone(viewMatrix);
        mat4.mul(viewMatrix, viewMatrix, node.matrix);

        if (node.mesh) {
            const program = this.programs.simple;
            gl.uniformMatrix4fv(program.uniforms.uViewModel, false, viewMatrix);
            for (const primitive of node.mesh.primitives) {
                this.renderPrimitive(primitive);
            }
        }

        for (const child of node.children) {
            this.renderNode(child, viewMatrix);
        }
    }

    loadLights(node, lights){
        const gl = this.gl;
        const program = this.programs.simple;

        const lightIterator = lights.values();
        const closestLights = [lightIterator.next().value];
        const lightDistance = [-999999999,999999999,999999999,999999999];

        for(let light of lightIterator){
            for(let j = 1; j < lightDistance.length; j++){
                let distance = vec3.distance(node.translation, light.translation);
                if (closestLights.length < 4){
                    if(closestLights[j] == null){
                        closestLights[j] = light;
                        lightDistance[j] = distance;
                        break;
                    }
                }else if (distance < lightDistance[j]){
                    closestLights[j] = light;
                    lightDistance[j] = distance;
                    break;
                }
            }
        }

        for(let i = 0; i < 4; i++){
            const light = closestLights[i];
            let color = vec3.clone(light.ambientColor);
            vec3.scale(color, color, 1.0 / 255.0);
            gl.uniform3fv(program.uniforms['uAmbientColor[' + i + ']'], color);
            color = vec3.clone(light.diffuseColor);
            vec3.scale(color, color, 1.0 / 255.0);
            gl.uniform3fv(program.uniforms['uDiffuseColor[' + i + ']'], color);
            color = vec3.clone(light.specularColor);
            vec3.scale(color, color, 1.0 / 255.0);
            gl.uniform3fv(program.uniforms['uSpecularColor[' + i + ']'], color);
            let position = light.translation;
            //console.log(position);

            gl.uniform3fv(program.uniforms['uLightPosition[' + i + ']'], position);
            gl.uniform1f(program.uniforms['uShininess[' + i + ']'], light.shininess);
            gl.uniform3fv(program.uniforms['uLightAttenuation[' + i + ']'], light.attenuatuion);
        }
    }

    renderPrimitive(primitive) {
        const gl = this.gl;

        const vao = this.glObjects.get(primitive);
        const material = primitive.material;
        const texture = material.baseColorTexture;
        const glTexture = this.glObjects.get(texture.image);
        const glSampler = this.glObjects.get(texture.sampler);

        gl.bindVertexArray(vao);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.bindSampler(0, glSampler);

        if (primitive.indices) {
            const mode = primitive.mode;
            const count = primitive.indices.count;
            const type = primitive.indices.componentType;
            gl.drawElements(mode, count, type, 0);
        } else {
            const mode = primitive.mode;
            const count = primitive.attributes.POSITION.count;
            gl.drawArrays(mode, 0, count);
        }
    }

}
