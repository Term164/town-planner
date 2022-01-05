import { Tile } from "./Tile.js";

export class Shop extends Tile{
    static cost = 200;
    constructor(x, y, node, light){
        super(x,y, node, light);
        this.income = 10;
        this.requiredPop = 2;
        this.requiredGoods = 10;
        this.adjacencyBonus = 0;
    }
}