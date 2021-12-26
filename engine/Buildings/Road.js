import { Tile } from "./Tile.js";

export class Road extends Tile{
    constructor(x, y, node, type){
        super(x,y, node);
        this.type = type;

        // Models are not normalized so we have to correct them
        // TODO: Fix the models...
        if (type == "straight"){
            node.scale = [5, node.scale[1], 5];
            node.updateTranslation([x*10+5,node.translation[1]/2,y*10+5]);
        }else if (type == "bend"){
            node.scale = [node.scale[0]/2, node.scale[1]/2, node.scale[2]/2];
            node.updateTranslation([x*10+5,node.translation[1]/2,y*10+1]);
        }else if (type == "tcrossroad"){
            node.scale = [node.scale[0]/2, node.scale[1]/2, node.scale[2]/2];
            node.updateTranslation([x*10+5,node.translation[1]/2,y*10+8.2]);
        }else {
            node.scale = [node.scale[0]/2, node.scale[1]/2, node.scale[2]/2];
            node.updateTranslation([x*10+1,node.translation[1]/2,y*10+5]);
        }
        node.updateMatrix();
        
    }
}