import { Tile } from "./Tile.js";

export class Shop extends Tile{
    constructor(x, y, node){
        super(x,y, node);
        this.cost = 20;
        this.income = 2;
        this.requiredPop = 2;
        this.requiredGoods = 2;
    }
}