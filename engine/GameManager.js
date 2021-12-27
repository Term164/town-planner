import { GUIManager } from "./GUIManager.js";
import { House } from "./Buildings/House.js";
import { Shop } from "./Buildings/Shop.js";
import { Factory } from "./Buildings/Factory.js";
import { Road } from "./Buildings/Road.js";
import { TownHall } from "./Buildings/TownHall.js";

import { MouseController } from "./MouseController.js";

export class GameManager{

    static mouseHoverSelector;

    constructor(townPlanner){
        this.townPlanner = townPlanner;
        this.guiManager = new GUIManager(this);
        this.setHoverSelector();
        this.mouseController = new MouseController(townPlanner.canvas, townPlanner.camera, this);
        this.map = this.generateMap(30);
        this.townHall;

        // Game variables
        this.time = 0;
        this.pop = 0;
        this.money = 0;
        this.goods = 0;
        this.electricProduction = 0;

        this.income = 0; // Money per tick

        // Logic variables
        this.connectedRoads = 0;
        this.activeBuildings = 0;
        this.checkedTiles = new Set();

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
        const selectedTile = new TownHall(15,15, model);
        selectedTile.connected = true;
        selectedTile.active = true;
        map[15][15] = selectedTile;
        this.townHall = selectedTile;
        this.townPlanner.scene.addNode(model);

        return map;
    }

    updateMapActivity(){
        this.connectedRoads = 0;
        this.activeBuildings = 0;
        this.resetTown();
        this.checkRoadNetwork();
    }

    checkRoadNetwork(){
        this.checkedTiles.clear();
        this.checkTileConnectivity(this.townHall);
    }

    checkTileConnectivity(tile){
        this.checkedTiles.add(tile);
        const neighbours = this.getTileNeighbours(tile);
        for (let neighbour of neighbours){
            if (neighbour != null){
                if (neighbour instanceof Road || neighbour instanceof TownHall){
                    if (neighbour.connected) {
                        tile.connected = true;
                        this.connectedRoads++;
                        break;
                    }
                }
            }    
        }

        for (let neighbour of neighbours){
            if(neighbour != null){
                if (neighbour instanceof Road && !neighbour.connected){
                    if (!this.checkedTiles.has(neighbour)){
                        this.checkTileConnectivity(neighbour);
                    }
                }else if (!(neighbour instanceof Road)){
                    this.checkTileAcitvity(neighbour);
                }
            }
        }
    }

    resetTown(){
        for(let x = 0; x < this.map.length; x++){
            for(let y = 0; y < this.map.length; y++){
                if(this.map[x][y] != null){
                    let currentTile = this.map[x][y];
                    if(currentTile != this.townHall){
                        currentTile.active = false;
                        currentTile.connected = false;
                    }
                }
            }
        }
    }

    getTileNeighbours(tile, x, y){
        let left = null;
        let right = null;
        let top = null;
        let bottom = null;

        if(x == null){
            if(tile.x-1 >= 0){
                left = this.map[tile.x-1][tile.y];
            }
            if(tile.x+1 < 30){
                right = this.map[tile.x+1][tile.y];
            }
            if(tile.y-1 >= 0){        
                top = this.map[tile.x][tile.y-1];
            }
            if(tile.y+1 < 30){
                bottom = this.map[tile.x][tile.y+1];
            }
        }else{
            if(x-1 >= 0){
                left = this.map[x-1][y];
            }
            if(x+1 < 30){
                right = this.map[x+1][y];
            }
            if(y-1 >= 0){        
                top = this.map[x][y-1];
            }
            if(y+1 < 30){
                bottom = this.map[x][y+1];
            }
        }
        
        return [right,left,top,bottom];
    }

    checkTileAcitvity(tile){
        const neighbours = this.getTileNeighbours(tile);
        for(let neighbour of neighbours){
            if (neighbour != null){
                if (neighbour instanceof Road && neighbour.connected){
                    tile.active = true;
                    this.activeBuildings++;
                    break;
                }
            }
        }
    }


    addPlot(x, y){
        if(x >= 0 && y >= 0 && x < 30 && y <30){
            if(this.mode == "build"){
                if(this.map[x][y] == null){
                    const model = this.townPlanner.modelManager.getModel(this.type);
                    let selectedTile;
                    switch(this.type){
                        case "house":
                            selectedTile = new House(x,y, model);
                            break;
                        case "shop":
                            selectedTile = new Shop(x,y, model);
                            break;
                        case "factory":
                            selectedTile = new Factory(x,y, model);
                            break;
                        case "road":
                            selectedTile = new Road(x, y, model, "road");
                            break;
                    }
                    this.map[x][y] = selectedTile;
                    this.townPlanner.scene.addNode(model);
                    this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
                    if (this.type == "road") {
                        this.fixRoadPoint(x,y);
                        this.checkedTiles.clear();
                        this.checkTileConnectivity(this.map[x][y]);
                    }else{
                        this.checkTileAcitvity(this.map[x][y]);
                    }
                    //console.log("connected roads: " + this.connectedRoads, "active buildings: " + this.activeBuildings);
                }
            
            }else if (this.mode == "bulldoze"){
                if (this.map[x][y] != null){
                    this.townPlanner.scene.deleteNode(this.map[x][y].node);
                    // If a road is deleted fix the road network and check for connectivity and activity of buildings
                    if(this.map[x][y] instanceof Road){
                        this.map[x][y] = null;
                        const neighbours = this.getTileNeighbours(null, x, y);
                        for (let neighbour of neighbours){
                            if(neighbour instanceof Road){
                                neighbour.neighbours = 0;
                                this.fixRoadPoint(neighbour.x, neighbour.y, true);
                            }
                        }
                        this.updateMapActivity();
                        //console.log("connected roads: " + this.connectedRoads, "active buildings: " + this.activeBuildings);
                    }
                    // If a house is deleted update the income/population/production...
                    this.map[x][y] = null;
                    this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
                }
            }
        }
    }

    fixRoadPoint(x, y, deleted) {
        // left, right, top, bottom should be Road class so we can just access them
        // A function should be created when you place the road selectedTile it corrects it and the selectedTiles around it
        let left = null;
        let right = null;
        let top = null;
        let bottom = null;

        let selectedTile = this.map[x][y];

        if(x+1 < 30){
            if(this.map[x+1][y] instanceof Road){
                right = this.map[x+1][y];
                if (!deleted){
                    right.neighbours++;
                }
                selectedTile.neighbours++;
            }
        }
        
        if(x-1 >= 0){
            if(this.map[x-1][y] instanceof Road){
                left = this.map[x-1][y];
                if (!deleted){
                    left.neighbours++;
                }
                selectedTile.neighbours++;
            }
        }
        
        if(y+1 < 30){
            if(this.map[x][y+1] instanceof Road){
                bottom = this.map[x][y+1];
                if (!deleted){
                    bottom.neighbours++;
                }
                selectedTile.neighbours++;
            }
        }
        
        if(y-1 >= 0){
            if(this.map[x][y-1] instanceof Road){
                top = this.map[x][y-1];
                if (!deleted){
                    top.neighbours++;
                }
                selectedTile.neighbours++;
            }
        }        

        // Check if the road at the exact coords is rotated correctly and has the correct model.
        if (selectedTile.neighbours == 4){
            this.setRoadTypeAndModel(selectedTile, "crossroad")
        }
        else if (selectedTile.neighbours == 3){
            this.setRoadTypeAndModel(selectedTile, "tcrossroad")
            if (left && right){
                if (top){
                    selectedTile.rotateToDirection(2);
                }else {
                    selectedTile.rotateToDirection(0);
                }
            }else {
                if (left){
                    selectedTile.rotateToDirection(1);
                }else{
                    selectedTile.rotateToDirection(3);
                }
            }
        }
        else if (top && left || top && right || bottom && left || bottom && right){           
            this.setRoadTypeAndModel(selectedTile, "bend")
            if (bottom && left){
                selectedTile.rotateToDirection(1);
            }else if (top && left){
                selectedTile.rotateToDirection(2); 
            }else if(top && right){
                selectedTile.rotateToDirection(3); 
            }else {
                selectedTile.rotateToDirection(0);
            }
        }
        else{
            this.setRoadTypeAndModel(selectedTile, "road")
            if(top)
                selectedTile.rotateToDirection(1);
            else if (bottom)
                selectedTile.rotateToDirection(3);
            else if (right)
                selectedTile.rotateToDirection(2);
            else 
                selectedTile.rotateToDirection(0);
        }



        //Check if the neighbouring tiles have correct models and are rotated correctly
        if(!deleted){
            const neighbouringTiles = [left, right, top, bottom];
            for(let tile of neighbouringTiles){
                if(tile != null){
                    if(tile.neighbours == 4){
                        this.setRoadTypeAndModel(tile, "crossroad")
                    }else if(tile.neighbours == 3){
                        if (tile.type == "road"){
                            console.log("test");
                            if (tile.direction == 0 || tile.direction == 2){
                                if (tile == bottom) tile.rotateToDirection(2);
                                else tile.rotateToDirection(0);
                            }
                            else if(tile.direction == 1 || tile.direction == 3){
                                if (tile == left) tile.rotateToDirection(3);
                                else tile.rotateToDirection(1);
                            }
                        }else{
                            if (tile == bottom || tile == top){
                                if (tile.direction == 0 || tile.direction == 3) tile.rotateToDirection(3);
                                else tile.rotateToDirection(1);
                            }else{
                                if (tile.direction == 3 || tile.direction == 2) tile.rotateToDirection(2);
                                else tile.rotateToDirection(0);
                            }
                        }
                        this.setRoadTypeAndModel(tile, "tcrossroad")
                    }else if(tile.neighbours == 2){
                        if(!(tile == top || tile == bottom) && (tile.direction == 1 || tile.direction == 3)){
                            this.setRoadTypeAndModel(tile, "bend");
                            if (tile == left && tile.direction == 1) tile.rotateToDirection(3);
                            else if (tile == left && tile.direction == 3) tile.rotateToDirection(0);
                            else if (tile == right && tile.direction == 1) tile.rotateToDirection(2);
                            else if (tile == right && tile.direction == 3) tile.rotateToDirection(1);
                        }else if(!(tile == left || tile == right) && (tile.direction == 0 || tile.direction == 2)){
                            this.setRoadTypeAndModel(tile, "bend");
                            if (tile == top && tile.direction == 2) tile.rotateToDirection(0);
                            else if (tile == top && tile.direction == 0) tile.rotateToDirection(1);
                            else if (tile == bottom && tile.direction == 2 ) tile.rotateToDirection(3);
                            else if (tile == bottom && tile.direction == 0) tile.rotateToDirection(2);
                        }
                    }else if (tile.neighbours == 1){
                        if(tile == left)
                            tile.rotateToDirection(2);
                        if(tile == right)
                            tile.rotateToDirection(0);
                        if(tile == top)
                            tile.rotateToDirection(3)
                        if(tile == bottom)
                            tile.rotateToDirection(1)
                    }
                }
            }
        }
        
        this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
    }

    setRoadTypeAndModel(selectedTile, type){
        let model = this.townPlanner.modelManager.getModel(type);
        selectedTile.type = type;
        selectedTile.node.children[0] = model;
    }

}