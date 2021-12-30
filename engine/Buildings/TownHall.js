import { Tile } from "./Tile.js";

export class TownHall extends Tile{
    constructor(x, y, node){
        super(x,y, node);
        this.connected = true;
    }
}