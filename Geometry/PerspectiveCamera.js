import { vec3, mat4 } from '../lib/gl-matrix-module.js';
import { Node } from './Node.js';

export class PerspectiveCamera extends Node {

    constructor(options = {}) {
        super(options);
        Object.assign(this, PerspectiveCamera.defaults);

        this.projectionMatrix = options.matrix ? mat4.clone(options.matrix) : mat4.create();
        this.updateProjection();
        
        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.zoomHandler = this.zoomHandler.bind(this);
        this.keys = {};

        this.zoomIn = false;
        this.zoomOut = false;
        this.turnSpeed = 200;
        this.zoomSpeed = 100;
    }

    updateProjection() {
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);
    }

    update(dt) {
        const c = this;
        const forward = vec3.set(vec3.create(), -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
        const right = vec3.set(vec3.create(), Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));
        const cameraDirection = this.getCameraRotation();
        
        // ================ KEYBINDINGS =====================
        let acc = vec3.create();
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            vec3.add(acc, acc, right);
        }
        if (this.keys['KeyA']) {
            vec3.sub(acc, acc, right);
        }
        if(this.keys['Space']){
            vec3.add(acc,acc,vec3.set((vec3.create()),0,1,0));
        }

        // ZoomIn and ZoomOut keybindings
        if(this.zoomIn){
            vec3.add(acc, acc, vec3.scale(cameraDirection, cameraDirection, this.zoomSpeed));
            this.zoomIn = false;
        }
        if(this.zoomOut){
            vec3.sub(acc, acc, vec3.scale(cameraDirection, cameraDirection, this.zoomSpeed));
            this.zoomOut = false;
        }

        //Rotation keybindings
        if(this.keys['KeyQ']){
            this.rotate(false, this.turnSpeed, right, cameraDirection);
        }

        if(this.keys['KeyE']){
            this.rotate(true, this.turnSpeed, right, cameraDirection);
        }

        // 2: update velocity
        vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

        // 3: if no movement, apply friction
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'] &&
            !this.keys['Space'] &&
            !this.zoomIn &&
            !this.zoomOut)
        {
            vec3.scale(c.velocity, c.velocity, 1 - c.friction);
        }

        // 4: limit speed
        const len = vec3.len(c.velocity);
        if (len > c.maxSpeed) {
            vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }
    }

    getCameraRotation(){
        const cameraDirection = vec3.set(vec3.create(), 0,0,-1);
        const rotationMatrixX = mat4.fromXRotation(mat4.create(), this.rotation[0]);
        const rotationMatrixY = mat4.fromYRotation(mat4.create(), this.rotation[1]);
        vec3.transformMat4(cameraDirection, cameraDirection, rotationMatrixX);
        vec3.transformMat4(cameraDirection, cameraDirection, rotationMatrixY);
        return cameraDirection;
    }

    
    rotate(left, turnSpeed, right, cameraDirection){
        const camera = this;
        const distanceToPlane = -camera.translation[1]/cameraDirection[1];
        const pointPlaneIntersection = vec3.set(vec3.create(), cameraDirection[0] * distanceToPlane + camera.translation[0], 0, cameraDirection[2] * distanceToPlane + camera.translation[2]);
        
        const turnAngle = Math.PI/turnSpeed;
        const distanceOverPlane = Math.round(Math.sqrt((camera.translation[0]-pointPlaneIntersection[0])**2 + (camera.translation[2] - pointPlaneIntersection[2])**2));
        const angularAcceleration = distanceOverPlane*Math.sin(turnAngle);

        if(left){
            camera.rotation[1] += turnAngle;
            vec3.scaleAndAdd(camera.translation, camera.translation, vec3.normalize(vec3.create(), right), angularAcceleration);
        }else{
            camera.rotation[1] -= turnAngle;
            vec3.scaleAndAdd(camera.translation, camera.translation, vec3.negate(vec3.create(),vec3.normalize(vec3.create(), right)), angularAcceleration);
        }

        // Omejimo kot na 2 PI
        const pi = Math.PI;
        const twopi = pi * 2;
        camera.rotation[1] = ((camera.rotation[1] % twopi) + twopi) % twopi;
    }


    enable() {
        document.addEventListener('mousemove', this.mousemoveHandler);
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
        document.addEventListener('wheel', this.zoomHandler);
    }

    disable() {
        document.removeEventListener('mousemove', this.mousemoveHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);

        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    mousemoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;
        const c = this;

        c.rotation[0] -= dy * c.mouseSensitivity;
        c.rotation[1] -= dx * c.mouseSensitivity;

        const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;

        if (c.rotation[0] > halfpi) {
            c.rotation[0] = halfpi;
        }
        if (c.rotation[0] < -halfpi) {
            c.rotation[0] = -halfpi;
        }

        c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

    zoomHandler(e){
        if(e.wheelDelta > 0){
            this.zoomIn = true;
        }else if(e.wheelDelta < 0){
            this.zoomOut = true;
        }
    }

}

PerspectiveCamera.defaults = {
    aspect           : 1.5,
    fov              : 1.5,
    near             : 0.3,
    far              : 300,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 100,
    friction         : 0.2,
    acceleration     : 100,
    translation      : [150,20,150],
    rotation         : [-Math.PI/4,0,0]
};
