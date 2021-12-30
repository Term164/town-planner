import { MouseController } from "./MouseController.js";

export class GameManager{

    static mouseHoverSelector;

    constructor(townPlanner){
        this.townPlanner = townPlanner;
        //this.setHoverSelector();
        this.mouseController = new MouseController(townPlanner.canvas, townPlanner.camera, this);
    }

    setHoverSelector(){
        GameManager.mouseHoverSelector = this.townPlanner.modelManager.getModel("selectedTile");
        GameManager.mouseHoverSelector.translation = [5,0,5];
        GameManager.mouseHoverSelector.scale = [5,0.1,5];
        GameManager.mouseHoverSelector.updateMatrix();
        this.townPlanner.scene.addNode(GameManager.mouseHoverSelector);
    }
}