export class Tile{
    constructor(x, y, node){
        this.x = x;
        this.y = y;
        this.connected = false;
        this.active = false;
        //TODO: Make it a number (0 = left, 1 = up, 2 = right, 3 = down)
        this.rotation = "left";
        this.node = node;
    }

    rotateRight(){
        this.node.rotate(0,-Math.PI/2,0);
    }

    rotateLeft(){
        this.node.rotate(0,+Math.PI/2,0);
    }
}