import { Tile } from "./Tile.js";

export class TownHall extends Tile{
    constructor(x, y, node){
        super(x,y, node);
        node.scale = [node.scale[0]/2, node.scale[1]/2, node.scale[2]/2];
        node.updateMatrix();
        node.updateTranslation([x*10+6,3.5,y*10+5]);
    }
}