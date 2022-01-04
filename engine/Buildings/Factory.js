import { Tile } from "./Tile.js";

export class Factory extends Tile{

    static cost = 400;

    constructor(x, y, node){
        super(x,y, node);
        this.requiredPop = 2;
        this.goodsProduction = 30;
        this.adjacencyBonus = 0;
    }
}