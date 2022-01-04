export class Tile{
    constructor(x, y, node){
        this.x = x;
        this.y = y;
        this.active = false;
        this.connected = false;
        this.direction = 0;
        this.node = node;
        node.scale = [node.scale[0]/2, node.scale[1]/2, node.scale[2]/2];
        //node.scale = [0.1,0.1,0.1];
        node.updateTranslation([x*10+5,0,y*10+5]);
    }


    rotateToDirection(newDirection){
        this.node.rotate(0,-(newDirection-this.direction)*Math.PI/2,0);
        this.direction = newDirection;
    }
}