import { Tile } from './Tile.js'
export class House extends Tile {

    static cost = 100;

    constructor(x, y, node, light){
        super(x,y, node, light);
        this.pop = 2;
        this.adjacencyBonus = 0;
        this.happiness = 1;
    }

}