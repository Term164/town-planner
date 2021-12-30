export class GUIManager{
    constructor(gameManager){
        this.gameManager = gameManager;
        this.getAllElements();
        this.setEventListeners();
    }

    getAllElements(){
        this.score_element = document.getElementById("score_data");

        this.day_element = document.getElementById("datetime_day_data");
        this.time_element = document.getElementById("datetime_time_data");

        this.pause_element = document.getElementById("pause_icon");
        this.play_element = document.getElementById("play_icon");
        this.ff_element = document.getElementById("ff_icon");

        this.house_element = document.getElementById("house_icon");
        this.shop_element = document.getElementById("shop_icon");
        this.factory_element = document.getElementById("factory_icon");
        this.road_element = document.getElementById("road_icon");
        this.bulldozer_element = document.getElementById("bulldoze_icon");

        this.arrow_down_element = document.getElementById("arrow_down_icon");
        this.arrow_up_element = document.getElementById("arrow_up_icon");
    }

    setEventListeners(){

        // GUI Lock events
        // Locks the ability to interact with the world,
        // so the player can only interact with the GUI
        this.mouseOverButton = this.mouseOverButton.bind(this);
        this.mouseLeftButton = this.mouseLeftButton.bind(this);
        this.house_element.addEventListener('mouseover', this.mouseOverButton);
        this.house_element.addEventListener('mouseout', this.mouseLeftButton);
        this.shop_element.addEventListener('mouseover', this.mouseOverButton);
        this.shop_element.addEventListener('mouseout', this.mouseLeftButton);
        this.factory_element.addEventListener('mouseover', this.mouseOverButton);
        this.factory_element.addEventListener('mouseout', this.mouseLeftButton);
        this.road_element.addEventListener('mouseover', this.mouseOverButton);
        this.road_element.addEventListener('mouseout', this.mouseLeftButton);
        this.bulldozer_element.addEventListener('mouseover', this.mouseOverButton);
        this.bulldozer_element.addEventListener('mouseout', this.mouseLeftButton);
        this.pause_element.addEventListener('mouseover', this.mouseOverButton);
        this.pause_element.addEventListener('mouseout', this.mouseLeftButton);
        this.play_element.addEventListener('mouseover', this.mouseOverButton);
        this.play_element.addEventListener('mouseout', this.mouseLeftButton);
        this.ff_element.addEventListener('mouseover', this.mouseOverButton);
        this.ff_element.addEventListener('mouseout', this.mouseLeftButton);
        this.arrow_down_element.addEventListener('mouseover', this.mouseOverButton);
        this.arrow_down_element.addEventListener('mouseout', this.mouseLeftButton);
        this.arrow_up_element.addEventListener('mouseover', this.mouseOverButton);
        this.arrow_up_element.addEventListener('mouseout', this.mouseLeftButton);

        // Time control
        this.pauseClick = this.pauseClick.bind(this);
        this.playClick = this.playClick.bind(this);
        this.ffClick = this.ffClick.bind(this);
        this.pause_element.addEventListener("click", this.pauseClick);
        this.play_element.addEventListener("click", this.playClick);
        this.ff_element.addEventListener("click", this.ffClick);

        // Construction bar control
        this.closeConstructionMenu = this.closeConstructionMenu.bind(this);
        this.openConstructionMenu = this.openConstructionMenu.bind(this);
        this.arrow_down_element.addEventListener("click", this.closeConstructionMenu);
        this.arrow_up_element.addEventListener("click", this.openConstructionMenu);

        // Construction bar
        this.houseMode = this.houseMode.bind(this);
        this.shopMode = this.shopMode.bind(this);
        this.factoryMode = this.factoryMode.bind(this);
        this.roadMode = this.roadMode.bind(this);
        this.bulldozerMode = this.bulldozerMode.bind(this);
        this.house_element.addEventListener("click", this.houseMode);
        this.shop_element.addEventListener("click", this.shopMode);
        this.factory_element.addEventListener("click", this.factoryMode);
        this.road_element.addEventListener("click", this.roadMode);
        this.bulldozer_element.addEventListener("click", this.bulldozerMode);
    }

    pauseClick(){
        alert("PAVZA");
    }

    playClick(){

    }

    ffClick(){

    }

    closeConstructionMenu(){
        let down = document.getElementById("toolbar_div");
        down.style.display = "none";
        let up = document.getElementById("toolbar_show_div");
        up.style.display = "block";
    }

    openConstructionMenu(){
        let down = document.getElementById("toolbar_div");
        down.style.display = "block";
        let up = document.getElementById("toolbar_show_div");
        up.style.display = "none";
    }

    houseMode(){
        if(this.gameManager.mode == "build" && this.gameManager.type == "house"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "build";
            this.gameManager.type = "house";
        }
    }

    shopMode(){
        if(this.gameManager.mode == "build" && this.gameManager.type == "shop"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "build";
            this.gameManager.type = "shop";
        }
    }


    factoryMode(){
        if(this.gameManager.mode == "build" && this.gameManager.type == "factory"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "build";
            this.gameManager.type = "factory";
        }
    }

    roadMode(){
        if(this.gameManager.mode == "build" && this.gameManager.type == "road"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "build";
            this.gameManager.type = "road";
        }
    }

    bulldozerMode(){
        if(this.gameManager.mode == "bulldoze"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "bulldoze";
        }
    }

    mouseOverButton(){
        this.gameManager.mouseController.guiLock = true;
    }

    mouseLeftButton(){
        this.gameManager.mouseController.guiLock = false;
    }

    update(){
        this.score_element.innerHTML = this.gameManager.money;
    }
}