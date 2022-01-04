import { Node } from "./Node.js";

export class Light{
    constructor(){

        Object.assign(this, {
            translation      : [0,2,0],
            ambientColor     : [100, 100, 100],
            diffuseColor     : [100, 100, 100],
            specularColor    : [0, 0 ,0],
            shininess        : 10,
            attenuatuion     : [1.0, 0, 0.02]
        });
    }
}