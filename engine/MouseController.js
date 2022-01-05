import { Ray } from "../Geometry/Ray.js";
import { vec3 } from "../lib/gl-matrix-module.js";
import { GameManager } from "./GameManager.js";

export class MouseController {
    constructor(canvas, camera, gameManager){
        this.gameManager = gameManager;
        this.addEventListeners();
        this.canvas = canvas;
        this.camera = camera;
        this.ray = new Ray(camera, canvas);
        this.guiLock = false;
    }

    addEventListeners(){
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUp);
    }
    
    mouseMoveHandler(e) {
        const x = e.clientX;
        const y = e.clientY;
        const worldRay = this.ray.generateRayFromPoint(x,y);
        const distanceToPlane = -this.camera.translation[1]/worldRay[1];
        const pointPlaneIntersection = vec3.set(vec3.create(), worldRay[0] * distanceToPlane + this.camera.translation[0], 0, worldRay[2] * distanceToPlane + this.camera.translation[2]);
        GameManager.mouseHoverSelector.updateTranslation([Math.floor(pointPlaneIntersection[0]/10)*10 + 5,0,Math.floor(pointPlaneIntersection[2]/10)*10+5]);
    }

    mouseUp(e){
        
        if(!this.guiLock){
            if(this.gameManager.checkMoney()){
                let x = e.clientX;
                let y = e.clientY;
                const worldRay = this.ray.generateRayFromPoint(x,y);
                const distanceToPlane = -this.camera.translation[1]/worldRay[1];
                const pointPlaneIntersection = vec3.set(vec3.create(), worldRay[0] * distanceToPlane + this.camera.translation[0], 0, worldRay[2] * distanceToPlane + this.camera.translation[2]);
                x = Math.floor(pointPlaneIntersection[0]/10);
                y = Math.floor(pointPlaneIntersection[2]/10);
                this.gameManager.addPlot(x, y);
            }
        }
    }
}