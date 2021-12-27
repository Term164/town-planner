import { Tile } from "./Tile.js";

export class Factory extends Tile{
    constructor(x, y, node){
        super(x,y, node);
        this.cost = 100;
        this.requiredPop = 2;
    }
}