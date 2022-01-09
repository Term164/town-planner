import { Node } from "../Geometry/Node.js";

export class WindTurbine extends Node {

    static cost = 300;

    constructor(options){
        super(options);
        this.x = 0;
        this.y = 0;
        this.energyProduction = 100;
        this.node = this;
        this.lights;

        this.phi = Math.random();
        this.rotationSpeed = Math.random()*0.04+0.01;
        this.animated = true;
        this.blades = this.children[0];
        this.blades.translation = [this.blades.translation[0], this.blades.translation[1]-0.1, this.blades.translation[2]];
        this.blades.updateTransformMovement();
    }


    placeWindTurbine(x, y, light){
        this.x = x;
        this.y = y;
        this.updateTranslation([x*10+5,0,y*10+5]);
        this.lights = light;
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