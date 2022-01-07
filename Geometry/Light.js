import { Node } from "./Node.js";

export class Light{
    constructor(){
        Object.assign(this, {
            translation      : [-1000,-1000,-1000],
            ambientColor     : [0, 0, 0],
            diffuseColor     : [0, 0, 0],
            specularColor    : [0, 0, 0],
            shininess        : 50,
            attenuatuion     : [1.0, 0, 0.002]
        });
        this.isOn = true;
    }
}