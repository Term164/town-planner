import { Tile } from "./Tile.js";

export class Factory extends Tile{
    constructor(x, y, node){
        super(x,y, node);
        this.cost = 100;
        this.requiredPop = 2;
        node.scale = [node.scale[0]/2.8, node.scale[1]/2.8, node.scale[2]/2.8];
        node.updateMatrix();
        node.updateTranslation([x*10+4,2.3,y*10+2.5]);
    }
}