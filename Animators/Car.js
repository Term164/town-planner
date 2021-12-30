import { Node } from "../Geometry/Node.js";

export class Car extends Node{

    constructor(options){
        super(options);
        this.phi = 0;
        this.rotationSpeed = 0.05;
        this.animated = true;
        this.carBody = this.children[0];
    }

    animate(){
        
        this.phi -= this.rotationSpeed;
        if (this.phi < 0 ) this.phi += 2*Math.PI;
        for (let i = 0; i < 4; i++){
            this.carBody.children[i].rotation = [Math.PI/2 , 0, this.phi ];
            this.carBody.children[i].updateTransformMovement();
        }
        
    }




    clone() {
        return new Car({
            ...this,
            children: this.children.map(child => child.clone()),
        });
    }







}