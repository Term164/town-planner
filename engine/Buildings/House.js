import { Tile } from './Tile.js'
export class House extends Tile {
    constructor(x, y, node){
        super(x,y, node);
        this.cost = 10;
        this.pop = 2;
    }



}