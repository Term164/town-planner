export class Tile{
    constructor(x, y, node){
        this.x = x;
        this.y = y;
        this.connected = false;
        this.active = false;
        //TODO: Make it a number (0 = left, 1 = up, 2 = right, 3 = down)
        this.direction = 0;
        this.node = node;
        node.scale = [node.scale[0]/2, node.scale[1]/2, node.scale[2]/2];
        node.updateTranslation([x*10+5,0,y*10+5]);
    }


    rotateToDirection(newDirection){
        this.node.rotate(0,-(newDirection-this.direction)*Math.PI/2,0);
        this.direction = newDirection;
    }
}