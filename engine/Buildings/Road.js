import { Tile } from "./Tile.js";

export class Road extends Tile{

    static cost = 25;

    constructor(x, y, node, type){
        super(x,y, node);
        node.scale = [node.scale[0]/2, node.scale[1]/2, node.scale[2]/2];
        node.updateMatrix();
        this.type = type;
        this.neighbours = 0;
    }
}