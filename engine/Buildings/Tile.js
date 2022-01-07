export class Tile{
    constructor(x, y, node, lights){
        this.x = x;
        this.y = y;
        this.active = false;
        this.connected = false;
        this.direction = 0;
        if(lights != null) this.lights = lights;
        this.node = node;
        if(node != null)
            node.updateTranslation([x*10+5,0,y*10+5]);
    }


    rotateToDirection(newDirection){
        this.node.rotate(0,-(newDirection-this.direction)*Math.PI/2,0);
        this.direction = newDirection;
    }
}