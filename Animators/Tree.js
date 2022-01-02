import { Node } from "../Geometry/Node.js";

export class Tree extends Node{

    constructor(options){
        super(options);
        this.animated = true;
        this.leaf = this.children[0];
        this.epsilon = Math.PI/8;
        this.phi = Math.random()*0.5;
        this.direction = Math.round(Math.random()) == 0 ? -1 : 1;

    }

    animate(){
    
        this.phi += 0.002 * this.direction;
        if (this.phi >= this.epsilon || this.phi <= -this.epsilon)
            this.direction = -this.direction;

        this.leaf.rotation = [0, this.phi, 0];
        this.leaf.updateTransformMovement();

    }


    clone() {
        return new Tree({
            ...this,
            children: this.children.map(child => child.clone()),
        });
    }







}