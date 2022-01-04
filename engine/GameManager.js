import { GUIManager } from "./GUIManager.js";
import { House } from "./Buildings/House.js";
import { Shop } from "./Buildings/Shop.js";
import { Factory } from "./Buildings/Factory.js";
import { Road } from "./Buildings/Road.js";
import { TownHall } from "./Buildings/TownHall.js";

import { MouseController } from "./MouseController.js";
import { Car } from "../Animators/Car.js";
import { PeopleManager } from "../Animators/PeopleManager.js";
import { Tree } from "../Animators/Tree.js";

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

        // People
        this.people = [];

        // Trees
        this.trees = [];

        // Game modes
        this.mode = "look"
        this.type = "house"

        this.guiManager.update();
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

        // TODO: randomize townhall placement
        const model = this.townPlanner.modelManager.getModel("townhall");
        const selectedTile = new TownHall(15,15, model);
        
        const tree1 = this.townPlanner.modelManager.getModel("tree");
        const tree2 = this.townPlanner.modelManager.getModel("tree");
        tree1.placeTree(151,158.5);
        tree2.placeTree(159, 158.5);
        
        selectedTile.active = true;
        map[15][15] = selectedTile;
        this.townHall = selectedTile;
        this.townPlanner.scene.addNode(model);

        this.townPlanner.scene.addNode(tree1);
        this.townPlanner.scene.addNode(tree2);

        return map;
    }

    tick(){
        this.money += this.income;
        this.time += 1;
    }

    updateMapActivity(){
        this.connectedRoads = 0;
        this.activeBuildings = 0;
        this.resetTown();
        this.checkRoadNetwork();

        // Order of updates is IMPORTANT!
        this.updatePopulation();
        this.updateProduction();
        this.updateIncome();
        this.updateOveralHappiness();
    }

    updateOveralHappiness(){
        for (let house of this.houses) this.overalHappiness += house.happiness;
        this.overalHappiness = this.overalHappiness / this.houses.size;
        //this.overalHappiness = 1 - (this.unemployedPopulation/this.pop) * 0.5;
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

        if(tile.connected && tile instanceof Road){
            for (let neighbour of neighbours){
                if(neighbour != null){
                    if (neighbour instanceof Road && !neighbour.connected){
                        if (!this.checkedTiles.has(neighbour)){
                            this.checkTileConnectivity(neighbour);
                        }
                    }else if (!(neighbour instanceof Road)){
                        if (!neighbour.connected){
                            neighbour.connected = true;
                            this.connectedBuildings++;
                        }
                    }
                }
            }
        }   
    }

    resetTown(){
        const allBuildings = [this.roads, this.houses, this.shops, this.factories];
        for(let set of allBuildings){
            for (let tile of set) {
                tile.active = false;
                tile.connected = false;
                if (tile.adjacencyBonus != null) tile.adjacencyBonus = 0;
            }
        }
    }

    // Update all different type of buildings
    updatePopulation(){
        for(let house of this.houses) this.checkTileAcitvity(house);
        for(let house of this.houses) this.updateHouse(house);
    }

    updateProduction(){
        for(let factory of this.factories) this.checkTileAcitvity(factory);
        for(let factory of this.factories) this.updateFactory(factory);
    }

    updateIncome(){
        for(let shop of this.shops) this.checkTileAcitvity(shop);
        for(let shop of this.shops) this.updateShop(shop);
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
                        this.requiredGoods -= tile.requiredGoods;
                        this.inactiveShops.delete(tile)
                    }
                }
            }
        }

        if (tile.active) return true;
        else return false;
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

        if (!tile.active){
            if (this.checkTileAcitvity(tile)){

            }else{
                
            }
        }else{
            // Decrease the population for the amount that it orginaly added if the tile was previously active
            this.pop -= (tile.pop + tile.adjacencyBonus);
            this.unemployedPopulation -= (tile.pop + tile.adjacencyBonus);
            tile.adjacencyBonus = 0; // Reset the adjecency bonus
        }

        
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
    }

    updateFactory(tile){
        if(tile.active == true){
            const neighbours = this.getBuildingNeighbours(tile);
            for(let neighbour of neighbours){
                if(neighbour != null){
                    if(neighbour.goodsProduction != null){
                        tile.adjacencyBonus += 2.5;
                    }
                }
            }
            this.goods += tile.goodsProdction + tile.adjacencyBonus;
            this.unusedGoods += tile.goodsProdction + tile.adjacencyBonus;
        }
    }

    updateShop(tile){
        if(tile.active == true){
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
    
    updateDeletedTile(neighbours){
        for (let neighbour of neighbours){
            this.checkAndUpdateTile(neighbour);
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
                    if (this.type == "house"){
                        let rng = Math.floor(Math.random()*5);
                        switch(rng){
                            case 0:
                                model = this.townPlanner.modelManager.getModel("house1_red");    
                                break;
                            case 1:
                                model = this.townPlanner.modelManager.getModel("house1_blue");    
                                break;
                            case 2:
                                model = this.townPlanner.modelManager.getModel("house1_orange");    
                                break;
                            case 3:
                                model = this.townPlanner.modelManager.getModel("house1_grey");    
                                break;
                            case 4:
                                model = this.townPlanner.modelManager.getModel("house1_blueyellow");    
                                break;
                        }
                    }else{
                        model = this.townPlanner.modelManager.getModel(this.type);
                    } 
                    
                    let selectedTile;
                    switch(this.type){
                        case "house":
                            selectedTile = new House(x,y, model);
                            this.houses.add(selectedTile);
                            
                            this.createCar();
                            this.createPerson();
                            this.createPerson();
                            //this.createTree(selectedTile.direction, x, y);

                            break;
                        case "shop":
                            selectedTile = new Shop(x,y, model);
                            this.shops.add(selectedTile);
                            this.inactiveShops.add(selectedTile)
                            break;
                        case "factory":
                            selectedTile = new Factory(x,y, model);
                            this.factories.add(selectedTile);
                            this.inactiveFactories.add(selectedTile);
                            break;
                        case "road":
                            selectedTile = new Road(x, y, model, "road");
                            this.roads.add(selectedTile);


                            this.releaseWaitingQ();
                            

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
                        this.updateOveralHappiness();
                    }

                    this.townPlanner.scene.addNode(model);
                    this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
                    //console.log("connected roads: " + this.connectedRoads, "active buildings: " + this.activeBuildings, "connected buildings: " + this.connectedBuildings);
                    console.log("population: " + this.pop, "goods: " + this.goods, "income: " + this.income, "happines: " + this.overalHappiness);
                }
            }else if (this.mode == "bulldoze"){
                if (this.map[x][y] != null){
                    this.townPlanner.scene.deleteNode(this.map[x][y].node);
                    // If a road is deleted fix the road network and check for connectivity and activity of buildings
                    if(this.map[x][y] instanceof Road){
                        this.roads.delete(this.map[x][y]);
                        this.map[x][y] = null;

                        this.moveIntoWaitingQOnRoadBulldoze();

                        const neighbours = this.getTileNeighbours(null, x, y);
                        for (let neighbour of neighbours){
                            if(neighbour instanceof Road){
                                neighbour.neighbours = 0;
                                this.fixRoadPoint(neighbour.x, neighbour.y, true);
                            }
                        }
                        this.updateMapActivity();
                        console.log("connected roads: " + this.connectedRoads, "active buildings: " + this.activeBuildings);
                    }else if (this.map[x][y] instanceof House){
                        this.deleteCar();
                        this.deletePerson();
                        this.deletePerson();
                    }


                    // If a house is deleted update the income/population/production...
                    const neighbours = this.getBuildingNeighbours(this.map[x][y]);
                    this.map[x][y] = null;
                    this.updateDeletedTile(neighbours)
                    this.townPlanner.renderer.prepareScene(this.townPlanner.scene);
                    this.updateOveralHappiness();
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
        let c = new Car(carModel);
        this.cars.push(c);
        if (this.roads.size <= 0)
            this.waitingCars.push(c);
        else{
            this.townPlanner.scene.addNode(c);
            c.placeCar();
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
        let p = new PeopleManager(personModel);
        this.people.push(p);
        this.townPlanner.scene.addNode(p);
        p.placePerson();
    }

    createTree(dir, mapx, mapy){
        let t = new Tree("tree");
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
    }

    deletePerson(){
        if (this.people.length<=0)return;
        let p = this.people.pop();
        this.townPlanner.scene.deleteNode(p);
    }

    releaseWaitingQ(){
    // If there are any cars in the waiting q, release them now
        while (this.waitingCars.length > 0){
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




}