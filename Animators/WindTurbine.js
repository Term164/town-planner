import { Node } from "../Geometry/Node.js";

export class WindTurbine extends Node{

    constructor(options){
        super(options);
        this.phi = Math.random();
        this.rotationSpeed = Math.random()*0.05+0.005;
        this.animated = true;
        this.blades = this.children[0];
        this.blades.translation = [this.blades.translation[0], this.blades.translation[1]-0.1, this.blades.translation[2]];
        this.blades.updateTransformMovement();
    }

    animate(){

        this.phi += this.rotationSpeed;
        if (this.phi >= 2*Math.PI) this.phi -= 2*Math.PI;
        this.blades.rotation = [0, 0, this.phi ];
        this.blades.updateTransformMovement();
        this.updateMatrix();
    }




    clone() {
        return new WindTurbine({
            ...this,
            children: this.children.map(child => child.clone()),
        });
    }







}