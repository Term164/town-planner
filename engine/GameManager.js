import { GUIManager } from "./GUIManager.js";
import { House } from "./Buildings/House.js";
import { Shop } from "./Buildings/Shop.js";
import { Factory } from "./Buildings/Factory.js";
import { Road } from "./Buildings/Road.js";
import { TownHall } from "./Buildings/TownHall.js";

import { MouseController } from "./MouseController.js";
import { Tile } from "./Buildings/Tile.js";

export class GameManager{

    static mouseHoverSelector;

    constructor(townPlanner){
        this.townPlanner = townPlanner;
        this.guiManager = new GUIManager(this);
        this.setHoverSelector();
        this.mouseController = new MouseController(townPlanner.canvas, townPlanner.camera, this);
        this.map = this.generateMap(30);

        // Game variables
        this.time = 0;
        this.pop = 0;
        this.money = 0;
        this.goods = 0;

        this.income = 0; // Money per tick
        this.production = 0; // Goods per tick


        // Game modes
        this.mode = "look"
        this.type = "house"
    }

    setHoverSelector(){
        GameManager.mouseHoverSelector = this.townPlanner.modelManager.getModel("selectedTile");
        GameManager.mouseHoverSelector.translation = [5,0,5];
        GameManager.mouseHoverSelector.scale = [5,0.1,5];
        GameManager.mouseHoverSelector.updateMatrix();
        this.townPlanner.scene.addNode(GameManager.mouseHoverSelector);
    }

    generateMap(size){
        const map = new Array(size);
        for (let i = 0; i < size; i++){
            map[i] = new Array(size);
        }

        const model = this.townPlanner.modelManager.getModel("townhall");
        const tile = new TownHall(15,15, model);
        tile.connected = true;
        map[15][15] = tile;
        this.townPlanner.scene.addNode(model);

        return map;
    }


    addPlot(x, y){
        if(x >= 0 && y >= 0 && x < 30 && y <30){
            if(this.mode == "build"){
                if(this.map[x][y] == null){
                    const model = this.townPlanner.modelManager.getModel(this.type);
                    let tile;
                    switch(this.type){
                        case "house":
                            tile = new House(x,y, model);
                            break;
                        case "shop":
                            tile = new Shop(x,y, model);
                            break;
                        case "factory":
                            tile = new Factory(x,y, model);
                            break;
                        case "road":
                            tile = new Road(x, y, model, "straight");
                            break;
                    }
                    this.map[x][y] = tile;
                    this.townPlanner.scene.addNode(model);
                    this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
                    if (this.type == "road") this.fixRoadPoint(x,y);
                }
            
            }else if (this.mode == "bulldoze"){
                if (this.map[x][y] != null){
                    this.townPlanner.scene.deleteNode(this.map[x][y].node);
                    this.map[x][y] = null;
                    this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
                }
            }
        }
    }

    fixRoadPoint(x, y) {
        // left, right, top, bottom should be Road class so we can just access them
        // A function should be created when you place the road tile it corrects it and the tiles around it
        let left = null;
        let right = null;
        let top = null;
        let bottom = null;

        if(x+1 >= 0 && this.map[x+1][y] instanceof Road){
            right = this.map[x+1][y];
        }
        if(x-1 < 30 && this.map[x-1][y] instanceof Road){
            left = this.map[x-1][y];
        }
        if(y+1 >= 0 && this.map[x][y+1] instanceof Road){
            top = this.map[x][y+1];
        }
        if(y-1 < 30 && this.map[x][y-1] instanceof Road){
            bottom = this.map[x][y-1];
        }

        let model;
        let tile;
        if (top && left && right && bottom){
            model = this.townPlanner.modelManager.getModel("crossroad");
            this.map[x][y].node.mesh = model.mesh;
        }
        else if (top && left && right || top && bottom && left || top && bottom && right || bottom && left && right){
            model = this.townPlanner.modelManager.getModel("tcrossroad");
            tile = new Road(x, y, model, "tcrossroad");
        }
        else if (top && left || top && right || bottom && left || bottom && right){
            model = this.townPlanner.modelManager.getModel("bend");
            tile = new Road(x, y, model, "bend");
            if (bottom && left){
                tile.rotateLeft();
                tile.rotation = "down";
                
            }
        }
        else{
            model = this.townPlanner.modelManager.getModel("road");
            tile = new Road(x, y, model, "straight");
            if (top || bottom){
                tile.rotateRight();
                tile.rotation = "up";
                if (this.map[x][y+1] != null){
                    if (this.map[x][y+1].type == "straight" && this.map[x][y+1].rotation == "right" || this.map[x][y+1].rotation == "left"){
                        this.map[x][y+1].rotateRight();
                        this.map[x][y+1].rotation = "up";
                    }
                }
                if (this.map[x][y-1] != null){
                    if (this.map[x][y-1].type == "straight" && this.map[x][y-1].rotation == "right" || this.map[x][y-1].rotation == "left"){
                        this.map[x][y-1].rotateRight();
                        this.map[x][y-1].rotation = "up";
                    }
                }
            }
            
        }



        //this.map[x][y] = tile;
        //this.townPlanner.scene.addNode(model);
        this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
    }

}