import { Tile } from "./Tile.js";

export class Shop extends Tile{
    constructor(x, y, node){
        super(x,y, node);
        this.cost = 20;
        this.income = 2;
        this.requiredPop = 2;
        this.requiredGoods = 2;
        node.scale = [node.scale[0]/3, node.scale[1]/3, node.scale[2]/3];
        node.rotation = [Math.PI/4.6,0,0];
        node.updateTransformMovement();
        node.updateTransform();
        node.updateTranslation([x*10+2.3,3.8,y*10+5]);
    }
}