import { House } from "./Buildings/House.js";
import { Shop } from "./Buildings/Shop.js";
import { Factory } from "./Buildings/Factory.js";
import { Road } from "./Buildings/Road.js";
import { TownHall } from "./Buildings/TownHall.js";

import { MouseController } from "./MouseController.js";
import { Light } from "../Geometry/Light.js";
import { Car } from "../Animators/Car.js";
import { PeopleManager } from "../Animators/PeopleManager.js";
import { Tree } from "../Animators/Tree.js";

export class GameManager{

    static mouseHoverSelector;

    constructor(townPlanner){
        this.townPlanner = townPlanner;
        this.modelManager = townPlanner.modelManager;
        this.guiManager = this.modelManager.guiManager;
        this.guiManager.setGameManager(this);
        this.soundManager = this.townPlanner.soundManager;
        this.guiManager.setSoundManager(this.soundManager);
        this.soundManager.setManagers(this);


        this.setHoverSelector("selectedTile")

        this.mouseController = new MouseController(townPlanner.canvas, townPlanner.camera, this);
        this.map = this.generateMap(30);
        this.townHall;

        // Game variables
        this.time = 8;
        this.sunState = "sunrise"; // nightTime = false means it's day...
        this.dan = "MON";
        this.nday = 0;

        this.pop = 0;
        this.money = 5000000;
        this.goods = 0;
        this.electricProduction = 0;

        this.income = 0; // Money per tick
        this.unemployedPopulation = 0;
        this.unusedGoods = 0;
        this.overalHappiness = 0;

        // Logic variables
        this.connectedRoads = 0;
        this.connectedBuildings = 0;
        this.activeBuildings = 0;
        this.checkedTiles = new Set();

        this.selectorDirection = 0;

        // All placed buildings
        this.roads = new Set();
        this.houses = new Set();
        this.shops = new Set();
        this.factories = new Set();

        this.inactiveFactories = new Set();
        this.inactiveShops = new Set();

        // Cars
        this.cars = [];
        this.waitingCars = [];

        /*
        let carModels = ["car1_red","car1_green","car1_blue","car2_red","car2_green","car2_blue"];
        for (let model of carModels){
            let c = this.modelManager.getModel(model);
            this.cars.push(c);
            this.townPlanner.scene.addNode(c);    
        }

        */
        // People
        this.people = [];

        // Trees
        this.trees = [];

        // Game modes
        this.mode = "look"
        this.type = "house"

        this.guiManager.update();

        this.tick = this.tick.bind(this);
        this.updateSun = this.updateSun.bind(this);

        // Lights
        this.initializeLights();
        this.sunx=0;
        this.suny=0;
        this.sunCounter = 0;
        this.skyColor = [0/255, 200/255, 200/255, 1];

        // Sound
        this.crowdPoint = [];

        // Animation
        this.animationRunning = true;


    }

    initializeLights(){
        const sun = new Light();
        const light2 = new Light();
        const light3 = new Light();
        const light4 = new Light();

        sun.translation = [150,20,150];

        sun.ambientColor = [200, 200, 200];
        sun.diffuseColor = [200, 200, 200];
        sun.specularColor = [50, 50, 50];

        /*    
        sun.ambientColor = [250, 250, 250];
        sun.diffuseColor = [250, 250, 250];
        sun.specularColor = [100, 100, 100];
        */

        sun.attenuatuion = [1.0,0.0001,0.000005];
        //sun.attenuatuion = [1.0,0.0001,0.00005];

        light2.ambientColor = [50, 50, 50];
        light2.diffuseColor = [50, 50, 50];
        light2.specularColor = [50, 50, 50];
        light2.translation = [151, 5, 155];

        light3.ambientColor = [50, 50, 50];
        light3.diffuseColor = [50, 50, 50];
        light3.specularColor = [50, 50, 50];
        light3.translation = [159, 5, 155];

        light4.ambientColor = [50, 50, 50];
        light4.diffuseColor = [50, 50, 50];
        light4.specularColor = [50, 50, 50];
        light4.translation = [155, 5, 152];

        this.townPlanner.lights = [sun, light2, light3, light4];


    }



    generateMap(size){
        const map = new Array(size);
        for (let i = 0; i < size; i++){
            map[i] = new Array(size);
        }

        // TODO: randomize townhall placement
        const model = this.modelManager.getModel("townhall");
        const selectedTile = new TownHall(15,15, model);
        
        const tree1 = this.townPlanner.modelManager.getModel("tree");
        const tree2 = this.townPlanner.modelManager.getModel("tree");
        tree1.placeTree(151,158.5);
        tree2.placeTree(159, 158.5);
        this.townPlanner.scene.addNode(tree1);
        this.townPlanner.scene.addNode(tree2);

        selectedTile.active = true;
        map[15][15] = selectedTile;
        this.townHall = selectedTile;
        this.townPlanner.scene.addNode(model);
        return map;
    }

    tick(){
        this.money += this.income;
        this.time += 1;

        if(this.time >= 24) {
            this.time=0;
            this.nday+=1;
        }
        if(this.nday >= 7) this.nday=0;
        let dan;
        switch(this.nday){
            case 0:
                this.dan="MON";
                break;
            case 1:
                this.dan="TUE";
                break;
            case 2:
                this.dan="WED";
                break;
            case 3:
                this.dan="THU";
                break;
            case 4:
                this.dan="FRI";
                break;
            case 5:
                this.dan="SAT";
                break;
            case 6:
                this.dan="SUN";
                break;
        }

        if (this.time >= 7 && this.time <= 19) this.nightTime = false;
        else this.nightTime = true;

        if (this.nightTime) this.turnOnLights();
        else this.turnOffLights();

        if (this.time >= 6 && this.time <= 8) this.sunState = "sunrise";
        if (this.time >= 9 && this.time <= 17) this.sunState = "sun";
        if (this.time >= 18 && this.time <= 20) this.sunState = "sunset";
        if (this.time >= 21 || this.time <= 5) this.sunState = "moon";
        
        if (this.time == 20){
            for (let i = 0; i < this.people.length; i++){
                if (Math.random()<0.6) this.people[i].sleeping = true;
            }
        }
        if (this.time == 8){
            for (let i = 0; i < this.people.length; i++){
                this.people[i].sleeping = false;
            }
        }


        this.guiManager.update();
        this.calculateCrowdPoint();
        this.soundManager.updateCrowd(this.townPlanner.camera.translation, this.crowdPoint, this.houses.size>0);
    }

    updateMapActivity(){
        this.resetTown();
        this.checkRoadNetwork();

        // Order of updates is IMPORTANT!
        this.updatePopulation();
        this.updateProductionAndIncome();
        this.updateOveralHappiness();
    }

    updateOveralHappiness(){
        this.overalHappiness = 0;
        for (let house of this.houses) this.overalHappiness += house.happiness;
        this.overalHappiness = this.overalHappiness / this.houses.size;
        // TODO fiddle a little with the happines of the people
        //this.overalHappiness -= (this.unemployedPopulation/this.pop) * 0.5;
    }

    checkRoadNetwork(){
        this.checkedTiles.clear();
        this.checkTileConnectivity(this.townHall);
    }

    checkTileConnectivity(tile){
        const neighbours = this.getTileNeighbours(tile);
        this.checkedTiles.add(tile);
        for (let neighbour of neighbours){
            if (neighbour != null){
                if (neighbour instanceof Road || neighbour instanceof TownHall){
                    if (neighbour.connected) {
                        tile.connected = true;

                        if(tile instanceof Road) this.connectedRoads++;
                        else this.connectedBuildings++;
                        break;
                    }
                }
            }    
        }

        if(tile.connected && (tile instanceof Road || tile instanceof TownHall)){
            for (let neighbour of neighbours){
                if(neighbour != null){
                    if (neighbour instanceof Road && !neighbour.connected){
                        if (!this.checkedTiles.has(neighbour)){
                            this.checkTileConnectivity(neighbour);
                        }
                    }else if (!(neighbour instanceof Road)){
                        if (!neighbour.connected){
                            neighbour.connected = true;
                            this.checkAndUpdateTile(neighbour);
                            this.connectedBuildings++;
                        }
                    }
                }
            }
        }   
    }

    resetTown(){
        this.goods = 0;
        this.pop = 0;
        this.income = 0;
        this.unemployedPopulation = 0;
        this.unusedGoods = 0;
        this.overalHappiness = 0;

        // Logic variables
        this.connectedRoads = 0;
        this.connectedBuildings = 0;
        this.activeBuildings = 0;

        this.inactiveFactories.clear();
        this.inactiveShops.clear();

        const allBuildings = [this.roads, this.houses, this.shops, this.factories];
        for(let set of allBuildings){
            for (let tile of set) {
                tile.active = false;
                tile.connected = false;
                if (tile.adjacencyBonus != null) tile.adjacencyBonus = 0;
                if(tile instanceof Factory) this.inactiveFactories.add(tile);
                else if(tile instanceof Shop) this.inactiveShops.add(tile);
            }
        }
    }

    // Update all different type of buildings
    updatePopulation(){
        for(let house of this.houses) this.updateHouse(house);
    }

    updateProductionAndIncome(){
        let previousFactoriesSize;
        let previousShopsSize;
        while(true){
            previousFactoriesSize = this.inactiveFactories.size;
            previousShopsSize = this.inactiveShops.size;
            if (this.inactiveShops.size != 0 && this.unusedGoods >= 10){
                for (let shop of this.inactiveShops) {
                    if (this.unusedGoods < shop.requiredGoods) break;
                    this.updateShop(shop);
                }
            }
            if (this.unusedGoods < 10 || this.inactiveShops.size == 0){
                for (let factory of this.inactiveFactories){
                    if(this.updateFactory(factory)) break;
                }
            }

            if (previousFactoriesSize == this.inactiveFactories.size && previousShopsSize == this.inactiveShops.size) break;

        }
    }

    checkTileAcitvity(tile){
        if(tile.connected){
            if(tile instanceof House){
                tile.active = true;
                this.activeBuildings++;
            }else if(tile.requiredPop <= this.unemployedPopulation){
                if(tile instanceof Factory){
                    tile.active = true;
                    this.activeBuildings++;
                    this.unemployedPopulation -= tile.requiredPop;
                    this.inactiveFactories.delete(tile);
                }else if(tile instanceof Shop) {
                    if(tile.requiredGoods <= this.unusedGoods){
                        tile.active = true;
                        this.activeBuildings++;
                        this.unemployedPopulation -= tile.requiredPop;
                        this.unusedGoods -= tile.requiredGoods;
                        this.inactiveShops.delete(tile)
                    }
                }
            }
        }
    }

    checkAndUpdateTile(tile){
        if (tile != null){
            if (tile instanceof House){
                this.updateHouse(tile);
            }else if (tile instanceof Factory){
                this.updateFactory(tile);
            }else if (tile instanceof Shop){
                this.updateShop(tile);
            }
        }
    }

    // Update specific building
    updateHouse(tile){

        if (!tile.active)this.checkTileAcitvity(tile)  
        else{
            // Decrease the population for the amount that it orginaly added if the tile was previously active
            this.pop -= (tile.pop + tile.adjacencyBonus);
            this.unemployedPopulation -= (tile.pop + tile.adjacencyBonus);
            tile.adjacencyBonus = 0; // Reset the adjecency bonus
        }

        if(tile.active){
            const neighbours = this.getBuildingNeighbours(tile);
            for(let neighbour of neighbours){
                if(neighbour != null){
                    if(neighbour.pop != null){ // Check if its a house
                        if(tile.adjacencyBonus < 2) tile.adjacencyBonus += 0.5;
                        tile.happiness += 0.0625; //If all neighbours are houses the happines is at 100%
                    }else if(neighbour.goodsProduction != null){ // Check if its a factory
                        tile.adjacencyBonus -= 0.5;
                        tile.happiness -= 0.1;
                    }else if(neighbour.income != null){ // Check if its a shop
                        if(tile.happiness <= 0.9) tile.happiness += 0.1;
                        else tile.happiness = 1;
                    }
                }
            }
            this.pop += tile.pop + tile.adjacencyBonus;
            this.unemployedPopulation += tile.pop + tile.adjacencyBonus;

            if (this.inactiveFactories.size > 0 || this.inactiveShops.size > 0) this.updateProductionAndIncome();
        }
    }

    updateFactory(tile){
        if(!tile.active) this.checkTileAcitvity(tile);
        else{
            this.goods -= (tile.goodsProduction + tile.adjacencyBonus);
            this.unusedGoods -= (tile.goodsProduction + tile.adjacencyBonus);
            tile.adjacencyBonus = 0;
        }

        if(tile.active){
            const neighbours = this.getBuildingNeighbours(tile);
            for(let neighbour of neighbours){
                if(neighbour != null){
                    if(neighbour.goodsProduction != null){
                        tile.adjacencyBonus += 2.5;
                    }
                }
            }
            this.goods += tile.goodsProduction + tile.adjacencyBonus;
            this.unusedGoods += tile.goodsProduction + tile.adjacencyBonus;
            if (this.inactiveShops.size > 0) this.updateProductionAndIncome();
            return true;
        }else return false;
    }

    updateShop(tile){

        if(!tile.active) this.checkTileAcitvity(tile);
        else{
            this.income -= (tile.income + tile.adjacencyBonus);
            tile.adjacencyBonus = 0;
        }


        if(tile.active){
            const neighbours = this.getBuildingNeighbours(tile);
            for(let neighbour of neighbours){
                if (neighbour != null){
                    if(neighbour.requiredGoods != null){
                        tile.adjacencyBonus += 1;
                    }
                }
            }
            this.income += tile.income + tile.adjacencyBonus;
        }
    }

    getBuildingNeighbours(building){
        const neighbours = [];
        const positions = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]
        for (let coords of positions){
            if(building.x + coords[0] < 30 && building.x + coords[0] >= 0 && building.y + coords[1] < 30 && building.y + coords[1] >= 0){
                neighbours.push(this.map[building.x + coords[0]][building.y + coords[1]]);
            }
        }
        return neighbours;
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

    checkMoney(){
        let enoughMoney = false;
        if (this.mode == "build"){
            switch(this.type){
                case "house":
                    enoughMoney = this.money >= House.cost;
                    if (enoughMoney) this.money -= House.cost;
                    break;
                case "shop":
                    enoughMoney = this.money >= Shop.cost;
                    if (enoughMoney) this.money -= Shop.cost;
                    break;
                case "factory":
                    enoughMoney = this.money >= Factory.cost;
                    if (enoughMoney) this.money -= Factory.cost;
                    break;
                case "road":
                    enoughMoney = this.money >= Road.cost;
                    if (enoughMoney) this.money -= Road.cost;
                    break;
            }
        }else if(this.mode == "bulldoze"){
            enoughMoney = this.money >= 20;
            if (enoughMoney) this.money -= 20;
        }
        
        this.guiManager.update();
        return enoughMoney;
    }

    addPlot(x, y){
        if(x >= 0 && y >= 0 && x < 30 && y <30){
            if(this.mode == "build"){
                if(this.map[x][y] == null){

                    let model;
                    if(this.type != "road"){
                        model = GameManager.mouseHoverSelector.clone();
                        //Get a new model to show what model is going to be placed next
                        this.setHoverSelector(this.type);
                        GameManager.mouseHoverSelector.rotation = model.rotation;
                        GameManager.mouseHoverSelector.translation = [model.translation[0], -20, model.translation[2]];
                        GameManager.mouseHoverSelector.updateMatrix();
                    }else{
                        model = this.modelManager.getModel("road");
                        GameManager.mouseHoverSelector.translation = [model.translation[0], -20, model.translation[2]];
                        GameManager.mouseHoverSelector.updateMatrix();
                    }
                    
                    let selectedTile;
                    switch(this.type){
                        case "house":
                            selectedTile = new House(x,y, model, this.createLight(x, y));
                            selectedTile.direction = this.selectorDirection;
                            this.houses.add(selectedTile);
                            
                            this.createCar();
                            this.createPerson();
                            this.createPerson();
                            //this.createTree(selectedTile.direction, x, y);
                            this.soundManager.playConstructSound();
                            break;
                        case "shop":
                            selectedTile = new Shop(x,y, model, this.createLight(x, y));
                            selectedTile.direction = this.selectorDirection;
                            this.shops.add(selectedTile);
                            this.inactiveShops.add(selectedTile);
                            this.soundManager.playConstructSound();
                            break;
                        case "factory":
                            selectedTile = new Factory(x,y, model);
                            selectedTile.direction = this.selectorDirection;
                            this.factories.add(selectedTile);
                            this.inactiveFactories.add(selectedTile);
                            this.soundManager.playConstructSound();
                            break;
                        case "road":
                            selectedTile = new Road(x, y, model, "road");
                            this.roads.add(selectedTile);


                            this.releaseWaitingQ();
                            this.soundManager.playConstructSound();

                            break;
                    }
                    this.map[x][y] = selectedTile;
                    if (this.type == "road") {
                        this.fixRoadPoint(x,y);
                        this.checkedTiles.clear();
                        this.checkTileConnectivity(selectedTile);
                    }else{
                        this.checkTileConnectivity(selectedTile);
                        this.checkAndUpdateTile(selectedTile);
                        const neighbours = this.getBuildingNeighbours(selectedTile);
                        for (let neighbour of neighbours) this.checkAndUpdateTile(neighbour);
                    }

                    this.updateOveralHappiness();
                    this.townPlanner.scene.addNode(model);
                    this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
                    //console.log("connected roads: " + this.connectedRoads, "active buildings: " + this.activeBuildings, "connected buildings: " + this.connectedBuildings);
                    //console.log("population: " + this.pop,"unemployed: " + this.unemployedPopulation ,"goods: " + this.goods,"unused goods: " + this.unusedGoods ,"income: " + this.income, "happines: " + this.overalHappiness);
                }
            }else if (this.mode == "bulldoze"){
                if (this.map[x][y] != null){
                    this.townPlanner.scene.deleteNode(this.map[x][y].node);
                    // If a road is deleted fix the road network and check for connectivity and activity of buildings
                    if(this.map[x][y] instanceof Road){
                        this.roads.delete(this.map[x][y]);
                        this.map[x][y] = null;

                        this.moveIntoWaitingQOnRoadBulldoze(); // NOT WORKING CHECK
                        // BECAUSE OF UPDATED CAR PLACING, EDGE CASE HOUSE DELETION

                        const neighbours = this.getTileNeighbours(null, x, y);
                        for (let neighbour of neighbours){
                            if(neighbour instanceof Road){
                                neighbour.neighbours = 0;
                                this.fixRoadPoint(neighbour.x, neighbour.y, true);
                            }
                        }
                        this.updateMapActivity();
                       this.soundManager.playDemolishSound();
                    }else{
                        // If a house is deleted update the income/population/production...
                        const selectedTile = this.map[x][y];
                        if(this.houses.has(selectedTile)){
                            this.deleteCar();
                            this.deletePerson();
                            this.deletePerson();

                            this.houses.delete(selectedTile);
                        } 
                        else if(this.factories.has(selectedTile)) this.factories.delete(selectedTile);
                        else if(this.shops.has(selectedTile)) this.shops.delete(selectedTile);
                        this.map[x][y] = null;
                        this.updateMapActivity();
                        
                        this.soundManager.playDemolishSound();
                    }
                    this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
                    this.updateOveralHappiness();
                    //console.log("connected roads: " + this.connectedRoads, "active buildings: " + this.activeBuildings, "connected buildings: " + this.connectedBuildings);
                    //console.log("population: " + this.pop, "goods: " + this.goods, "income: " + this.income, "happines: " + this.overalHappiness);
                }
            }
            this.guiManager.update();
        }
    }

    createLight(x, y){
        const light = new Light();
        light.translation = [x*10+5, 1, y*10+7.5];
    
    
        if (this.nightTime){
            // Random color chooser
            const R = Math.floor(Math.random()*56+200);
            const G = Math.floor(Math.random()*56+200);
            const B = Math.floor(Math.random()*56+200);

            light.ambientColor = [Math.floor(R * 0.5), Math.floor(G * 0.5), Math.floor(B * 0.5)];
            light.diffuseColor = [Math.floor(R * 0.8), Math.floor(G * 0.8), Math.floor(B * 0.8)];
            light.specularColor = [R, G, B];
        }else{
            light.ambientColor = [0, 0, 0];
            light.diffuseColor = [0, 0, 0];           
            light.specularColor = [0, 0, 0];
        }

        light.shininess = 10;

        this.townPlanner.lights.push(light);

        return light;
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
        let model = this.modelManager.getModel(type);
        selectedTile.type = type;
        selectedTile.node.children[0] = model;
    }


    turnOffLights(){
        if (this.townPlanner.lights.length <= 4) return;
        for (let i = 4; i < this.townPlanner.lights.length; i++){
            if (this.townPlanner.lights[i].isOn){
                if (Math.random()<0.75){
                    this.townPlanner.lights[i].isOn = false;
                    this.townPlanner.lights[i].ambientColor = [0, 0, 0];
                    this.townPlanner.lights[i].diffuseColor = [0, 0, 0];           
                    this.townPlanner.lights[i].specularColor = [0, 0, 0];
                }
            }
        }

    }

    turnOnLights(){
        if (this.townPlanner.lights.length <= 4) return;
        for (let i = 4; i < this.townPlanner.lights.length; i++){
            if (!this.townPlanner.lights[i].isOn){
                if (Math.random()<0.75){
                    this.townPlanner.lights[i].isOn = true;
                    const R = Math.floor(Math.random()*100+100);
                    const G = Math.floor(Math.random()*100+100);
                    const B = Math.floor(Math.random()*100+100);

                    this.townPlanner.lights[i].ambientColor = [Math.floor(R * 0.3), Math.floor(G * 0.3), Math.floor(B * 0.3)];
                    this.townPlanner.lights[i].diffuseColor = [Math.floor(R * 0.8), Math.floor(G * 0.8), Math.floor(B * 0.8)];
                    this.townPlanner.lights[i].specularColor = [0,0,0];
                }
            }else{
                let x = (this.townPlanner.lights[i].translation[0]-5)/10;
                let y = (this.townPlanner.lights[i].translation[2]-5)/10;
                if ( this.map[x][y] instanceof House ){
                    if (Math.random()<0.05){
                        this.townPlanner.lights[i].isOn = false;
                        this.townPlanner.lights[i].ambientColor = [0, 0, 0];
                        this.townPlanner.lights[i].diffuseColor = [0, 0, 0];           
                        this.townPlanner.lights[i].specularColor = [0, 0, 0];
                    }
                }

            }

        }
        
    }

    updateSun(){
        
        //console.log(this.sunState);
        switch(this.sunState){
            case "sun":              
                this.townPlanner.renderer.gl.clearColor((0/255), (204/255), (255/255), 1);   
                this.skyColor = [0/255,204/255, 255/255, 1];
                //console.log(this.skyColor);
                this.townPlanner.lights[0].ambientColor = [240, 240, 240];
                this.townPlanner.lights[0].diffuseColor = [240, 240, 240];
                this.townPlanner.lights[0].specularColor = [100, 100, 100];
                break;  
            case "moon":
                this.townPlanner.renderer.gl.clearColor(0, 0.10, 0.25, 1); // night sky
                this.skyColor = [0/255,0.1, 0.25, 1];
                //console.log(this.skyColor);
                this.townPlanner.lights[0].ambientColor = [50, 50, 150];
                this.townPlanner.lights[0].diffuseColor = [50, 50, 150];
                this.townPlanner.lights[0].specularColor = [50, 50, 150];
                break;
            case "sunrise":
                if (this.skyColor[1]<0.8){
                this.skyColor = [this.skyColor[0], this.skyColor[1]+2/255, this.skyColor[2]+2.15/255, 1];
                //console.log(this.skyColor);
                this.townPlanner.renderer.gl.clearColor(...this.skyColor);
                this.townPlanner.lights[0].ambientColor = [this.townPlanner.lights[0].ambientColor[0]+2, this.townPlanner.lights[0].ambientColor[1]+2, this.townPlanner.lights[0].ambientColor[2]+1];
                this.townPlanner.lights[0].diffuseColor = [this.townPlanner.lights[0].diffuseColor[0]+2, this.townPlanner.lights[0].diffuseColor[1]+2, this.townPlanner.lights[0].diffuseColor[2]+1];
                this.townPlanner.lights[0].specularColor = [this.townPlanner.lights[0].specularColor[0]+2, this.townPlanner.lights[0].specularColor[1]+2, this.townPlanner.lights[0].specularColor[2]+1];
                }
                break;
                
            case "sunset":
                if (this.skyColor[1]>0.1){
                this.skyColor = [this.skyColor[0], this.skyColor[1]-2/255, this.skyColor[2]-2.15/255, 1];
                //console.log(this.skyColor);
                this.townPlanner.renderer.gl.clearColor(...this.skyColor);
                this.townPlanner.lights[0].ambientColor = [this.townPlanner.lights[0].ambientColor[0]-2, this.townPlanner.lights[0].ambientColor[1]-2, this.townPlanner.lights[0].ambientColor[2]-1];
                this.townPlanner.lights[0].diffuseColor = [this.townPlanner.lights[0].diffuseColor[0]-2, this.townPlanner.lights[0].diffuseColor[1]-2, this.townPlanner.lights[0].diffuseColor[2]-1];
                this.townPlanner.lights[0].specularColor = [this.townPlanner.lights[0].specularColor[0]-1.5, this.townPlanner.lights[0].specularColor[1]-1.5, this.townPlanner.lights[0].specularColor[2]-1];
                }
                break;
                
        }
        //gl.clearColor(0, 0.10, 0.25, 1); // night sky
        //gl.clearColor((0/255), (204/255), (255/255), 1);   


        // Calculates and sets the volume accodringly to the average point of all houses, simulating sound SPATIALIZATION
        this.calculateCrowdPoint();
        this.soundManager.updateCrowd(this.townPlanner.camera.translation, this.crowdPoint, this.houses.size>0);

    }

    calculateCrowdPoint(){
        if (this.houses.size == 0){
            this.crowdPoint = [150, 10, 150];
        }else{
            let avgPoint = [0,10,0];
            for (let house of this.houses){
                avgPoint = [avgPoint[0]+(house.x*10+5), 10, avgPoint[2]+(house.y*10+5)];
            }
            avgPoint = [avgPoint[0]/this.houses.size, 10, avgPoint[2]/this.houses.size];
            this.crowdPoint = avgPoint;

        }

        


    }




    // MyFunctions

    createCar(){
    // Choose random car model, add it to this.cars (total cars), if placing fails, add it to waiting q
        let carModel;
        let rngCar = Math.floor(Math.random()*6);
        switch(rngCar){
            case 0:
                carModel = this.townPlanner.modelManager.getModel("car1_red");    
                break;
            case 1:
                carModel = this.townPlanner.modelManager.getModel("car1_blue");    
                break;
            case 2:
                carModel = this.townPlanner.modelManager.getModel("car1_green");    
                break;
            case 3:
                carModel = this.townPlanner.modelManager.getModel("car2_red");    
                break;
            case 4:
                carModel = this.townPlanner.modelManager.getModel("car2_blue");    
                break;
            case 5:
                carModel = this.townPlanner.modelManager.getModel("car2_green");    
                break;
            }
        
        this.cars.push(carModel);
        if (this.roads.size <= 0)
            this.waitingCars.push(carModel);
        else{
            this.townPlanner.scene.addNode(carModel);
            carModel.placeCar();
       }
    }

    createPerson(){
    // Choose random person model, add it to this.people (total people)
        let personModel;
        let rng = Math.floor(Math.random()*5);
        switch(rng){
            case 0:
                personModel = this.townPlanner.modelManager.getModel("person1");    
                break;
            case 1:
                personModel = this.townPlanner.modelManager.getModel("person2");    
                break;
            case 2:
                personModel = this.townPlanner.modelManager.getModel("person3");    
                break;
            case 3:
                personModel = this.townPlanner.modelManager.getModel("person4");    
                break;
            case 4:
                personModel = this.townPlanner.modelManager.getModel("person5");    
                break;
        }
        this.people.push(personModel);
        this.townPlanner.scene.addNode(personModel);
        personModel.placePerson();
    }

    createTree(dir, mapx, mapy){
        let t = this.townPlanner.modelManager.getModel("tree");
        this.trees.push(t);
        this.townPlanner.scene.addNode(t);
        let x;
        let y;
        switch(dir){
            case 0:
                x = Math.random() < 0.5 ? mapx*10+9 : mapx*10+1;
                y = mapy*10+3.5;
                break;
        }
        
        t.placeTree(x,y);
    }


    deleteCar(){
        if (this.cars.length<=0)return;
        let car = this.cars.pop();
        this.townPlanner.scene.deleteNode(car);
        if (this.waitingCars.length>0)
            this.waitingCars.pop();
    }

    deletePerson(){
        if (this.people.length<=0)return;
        let p = this.people.pop();
        this.townPlanner.scene.deleteNode(p);
    }

    releaseWaitingQ(){
    // If there are any cars in the waiting q, release them now
        while(this.waitingCars.length > 0){
            let wc = this.waitingCars.pop();
            this.townPlanner.scene.addNode(wc);
            wc.placeCar();
        }
    
    }

    moveIntoWaitingQOnRoadBulldoze(){
    //If there are no roads when we destroy a road, put all cars into waiting q
        if (this.roads.size <= 0){
            for (let i=0; i < this.cars.length; i++){
                this.waitingCars.push(this.cars[i]);
                this.townPlanner.scene.deleteNode(this.cars[i]);
            }
        }
    }




    updateSelector(){
        if(this.mode == "look"){
            this.setHoverSelector("selectedTile");
        }else if (this.mode == "bulldoze"){
            this.setHoverSelector("bulldozeTile");
        }else{
            this.setHoverSelector(this.type);
            this.selectorDirection = 0;
        }
        
    }

    setHoverSelector(type){
        if(type == "house"){
            const houses = ["house1_red", "house1_blue","house1_orange","house1_grey","house1_blueyellow"];
            type = houses[Math.floor(Math.random() * houses.length)];
        }else if(type == "shop"){
            const shops = ["shop","shop2"];
            type = shops[Math.floor(Math.random() * shops.length)];
        }
        const newModel = this.modelManager.getModel(type);
        newModel.scale = [newModel.scale[0]/2, newModel.scale[1]/2, newModel.scale[2]/2];
        newModel.updateMatrix();
        if(GameManager.mouseHoverSelector == null){
            this.townPlanner.scene.addNode(newModel);
        }else{
            this.townPlanner.scene.deleteNode(GameManager.mouseHoverSelector);
            this.townPlanner.scene.addNode(newModel);
            this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
        }
        GameManager.mouseHoverSelector = newModel;
    }


}