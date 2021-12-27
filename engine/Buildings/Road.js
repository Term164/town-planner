import { Tile } from "./Tile.js";

export class Road extends Tile{
    constructor(x, y, node, type){
        super(x,y, node);
        this.type = type;
        this.neighbours = 0;
    }
}