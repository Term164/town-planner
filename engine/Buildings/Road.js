import { Tile } from "./Tile.js";

export class Road extends Tile{

    static cost = 50;

    constructor(x, y, node, type){
        super(x,y, node);
        this.type = type;
        this.neighbours = 0;
    }
}