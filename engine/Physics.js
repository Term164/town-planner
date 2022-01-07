import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

export class Physics {

    constructor(scene) {
        this.scene = scene;
    }

    update(dt) {
        this.scene.traverse(node => {
            if (node.velocity) {
                vec3.scaleAndAdd(node.translation, node.translation, node.velocity, dt);
                node.updateTransformMovement();
                this.resolveCollision(node);
                
            }
            
            if (node.animated){
                node.animate();
            }
        });
    }


    resolveCollision(c) {
    
    if( !(c.translation[0]>=0 && c.translation[0]<=300 && c.translation[1]>=15 && c.translation[1]<=100 && c.translation[2]>=0 && c.translation[2]<=300) ){   
        
        if (c.translation[0]<0){
            c.translation=[0, c.translation[1], c.translation[2]];
            c.updateTransformMovement();
        }
        if (c.translation[0]>300){
            c.translation=[300, c.translation[1], c.translation[2]];
            c.updateTransformMovement();
        }
        if (c.translation[1]<15){
            c.translation=[c.translation[0], 15, c.translation[2]];
            c.updateTransformMovement();
        }
        if (c.translation[1]>100){
            c.translation=[c.translation[0], 100, c.translation[2]];
            c.updateTransformMovement();
        }
        if (c.translation[2]<0){
            c.translation=[c.translation[0], c.translation[1], 0];
            c.updateTransformMovement();
        }
        if (c.translation[2]>300){
            c.translation=[c.translation[0], c.translation[1], 300];
            c.updateTransformMovement();
        }
    
    }

        
        // Move node minimally to avoid collision.
        /*
        const diffa = vec3.sub(vec3.create(), 1, 1);
        
        let minDiff = Infinity;
        let minDirection = [0, 0, 0];
        if (diffa[0] >= 0 && diffa[0] < minDiff) {
            minDiff = diffa[0];
            minDirection = [minDiff, 0, 0];
        }
        if (diffa[1] >= 0 && diffa[1] < minDiff) {
            minDiff = diffa[1];
            minDirection = [0, minDiff, 0];
        }
        if (diffa[2] >= 0 && diffa[2] < minDiff) {
            minDiff = diffa[2];
            minDirection = [0, 0, minDiff];
        }
        */

        /*
        let diff=vec3.create(150,20,150);
        vec3.sub(diff, diff, c.translation);
        vec3.normalize(diff, diff);
        console.log(diff)

        vec3.add(c.translation, c.translation, diff);
        c.updateTransformMovement();
        */

        //vec3.sub(c.translation, c.translation, vec3.normalize(vec3.create(), c.velocity));

        
        
        

    }

}
