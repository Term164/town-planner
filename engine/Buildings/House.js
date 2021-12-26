import { Tile } from './Tile.js'
export class House extends Tile {
    constructor(x, y, node){
        super(x,y, node);
        this.cost = 10;
        this.pop = 2;
        node.scale = [2.5,1.5,2.5];
        node.updateMatrix();
        node.updateTranslation([x*10+5,node.translation[1]/2,y*10+5]);
    }



}