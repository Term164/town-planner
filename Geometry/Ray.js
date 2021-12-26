import { mat4, vec3, vec4 } from "../lib/gl-matrix-module.js";

export class Ray{
    constructor(camera, canvas){
        this.camera = camera;
        this.canvas = canvas;
    }

    generateRayFromPoint(x, y){
        this.projectionMatrix = this.camera.projectionMatrix;
        this.viewMatrix = this.camera.matrix;
        return this.calculateMouseRay(x,y);
    }

    calculateMouseRay(x, y){
        const normalizedCoords = this.getNormalizedDeviceCoords(x, y);
        const clipCoords = vec4.fromValues(normalizedCoords[0], normalizedCoords[1], -1.0, 1.0);
        const eyeCoords = this.toEyeCoords(clipCoords);
        const worldRay = this.toWorldCoords(eyeCoords);
        return worldRay;
    }

    getNormalizedDeviceCoords(mouseX, mouseY) {
        const x = (2.0*mouseX) / this.canvas.clientWidth - 1;
        const y = 1.0 - (2.0*mouseY) / this.canvas.clientHeight;
        return [x, y];
    }

    toEyeCoords(clipCoords){
        const invertedProjectionMatrix = mat4.invert(mat4.create(), mat4.clone(this.projectionMatrix));
        const eyeCoords = vec4.create();
        vec4.transformMat4(eyeCoords, clipCoords, invertedProjectionMatrix);
        vec4.set(eyeCoords, eyeCoords[0], eyeCoords[1], -1.0, 0.0);
        return eyeCoords;
    }

    toWorldCoords(eyeCoords){
        const mouseRay = vec4.create();
        vec4.transformMat4(mouseRay, eyeCoords, this.viewMatrix);
        const normalizedMouseRay = vec3.set(vec3.create(), mouseRay[0], mouseRay[1], mouseRay[2]);
        vec3.normalize(normalizedMouseRay, normalizedMouseRay);
        return(normalizedMouseRay);
    }


}