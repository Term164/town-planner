export class GUIManager{
    constructor(){
        this.gameManager = null;
        
        this.house_cost = 100;
        this.shop_cost = 200;
        this.factory_cost = 400;
        this.wind_turbine_cost = 300;
        this.road_cost = 50;
        this.bulldoze_cost = 20;

        this.getAllElements();
        this.setEventListeners();


        this.setHint();
    }

    setGameManager(gameManager){
        this.gameManager = gameManager;
    }

    getAllElements(){
        this.score_element = document.getElementById("score_data");
        this.money_element = document.getElementById("money_data");
        this.population_element = document.getElementById("population_data");
        this.happiness_element = document.getElementById("happiness_data");
        this.production_element = document.getElementById("production_data");

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

        this.house_cost_element = document.getElementById("house_cost_data");
        this.shop_cost_element = document.getElementById("shop_cost_data");
        this.factory_cost_element = document.getElementById("factory_cost_data");
        this.road_cost_element = document.getElementById("road_cost_data");
        this.wind_turbine_cost_elemet = document.getElementById("wind_turbine_cost_data");
        this.bulldoze_cost_element = document.getElementById("bulldoze_cost_data");

        this.arrow_down_element = document.getElementById("arrow_down_icon");
        this.arrow_up_element = document.getElementById("arrow_up_icon");

        this.loading_screen = document.getElementById("loading_screen");
        this.loading_percentage = document.getElementById("loading_percentage_data");
        this.hint_element = document.getElementById("hint_data");
        this.loading_progress = document.getElementById("loading_progress");

        this.house_cost_element.innerHTML = this.house_cost;
        this.shop_cost_element.innerHTML = this.shop_cost;
        this.factory_cost_element.innerHTML = this.factory_cost;
        this.road_cost_element.innerHTML = this.road_cost;
        this.wind_turbine_cost_elemet.innerHTML = this.wind_turbine_cost;
        this.bulldoze_cost_element.innerHTML = this.bulldoze_cost;
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

    setHint(){
        this.hintList =
        [
            "There are no birds in this game, so place all the Wind Turbines you want.",
            "If you wish to acces anarchy mode, just bulldoze the Town Hall. And lose the game. ;) ",
            "The latest technological breakthrough in the car industry allows cars to phase through each other. No more collisions!",
            "Place all the Factories you need. There's no pollution in the game. However, People living near will be very unhappy.",
            "This town really loves roller blades. In fact, everyone is wearing roller blades. Look at them roll.",
            "Play this game for the feeling of owning a house. You'll never own one in real life. Sorry.",
            "How did you become a mayor of the town that has no people in it? Just a lonely Town Hall. Huh...",
            "They don't tell you, but this game is used in schools to teach Civil Engineering. I think...",
            "The trees appear to rotate, but it's only the wind. You know that constant back-and-forth wind, right?",
            "Keep your People happy, and they will give you money.",
            "People need Shops. Shops need Factories. People DO NOT want Factories. You could make a game out of that...",
            "All cars actually drift around bends and do massive U turns. It just happens so fast. Don't blink.",
            "There is no way to finish, but you can lose by making people unhappy. In other words, there are no winners, only survivors.",
            "If you mess up, click the Bulldozer icon to delete buildings. Be careful, it costs money...",
            "All buildings should be connected to the Town Hall via Roads. If they're not, consider them as abandoned buildings.",
            "To increase happiness, try giving People some new neighbours. That should distract them from inflation and poverty.",
            "Factories produce goods, but how do they get materials? I don't know, portals?",
            "Town Hall is the most important building. It just is. It doesn't serve any purpose. But it's very important.",
            "Shops give you money if People use them and if they get goods from Factories. So complicated, this money stuff...",
            "Money doesn't mean everything. It's about how much fun you're having... And about having the highest score out of your friends!",
            "To build, or not to build? -William Shakespeare, Beta testing the game, 2021",
            "Help me, I'm stuck in a loading screen!",
            "Wait, this isn't Minecraft?!",
            "Wait, is this Roblox?",
            "Wait, why is my SimCity on lowest graphics?",
            "Remember to Hydrate and take breaks!",
        ]
    
        let text = this.hintList[ Math.floor( Math.random() * this.hintList.length )];
        this.hint_element.innerHTML = text;
    }

    closeLoadingScreen(){
        this.loading_screen.style.display = "none";
    }
    
    loadPercentage(num, total){
        if (total == 0) throw new Error("Karkoli deljeno 0 je nekaj gnilega");
        
        let percentage = Math.round( num / total * 100 )+"%";
        this.loading_percentage.innerHTML = percentage;
        this.loading_progress.style.width = percentage;
    
        if (num == total){
            setInterval(this.closeLoadingScreen, 1500);
            this.loading_progress.style.backgroundColor = "green";
        }
    
    }


    // Stop all animations + time ticks
    pauseClick(){
        if(this.gameManager.townPlanner.normalSpeed != null)
            clearInterval(this.gameManager.townPlanner.normalSpeed);
        if(this.gameManager.townPlanner.fastSpeed != null)
            clearInterval(this.gameManager.townPlanner.fastSpeed);
    }

    playClick(){
        this.pauseClick();
        this.gameManager.townPlanner.setNormalGameSpeed();
    }

    // Just speed up the time no need for animations
    ffClick(){
        this.pauseClick();
        this.gameManager.townPlanner.setFastForwardSpeed();
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
        this.gameManager.updateSelector();
    }

    shopMode(){
        if(this.gameManager.mode == "build" && this.gameManager.type == "shop"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "build";
            this.gameManager.type = "shop";
        }
        this.gameManager.updateSelector();
    }


    factoryMode(){
        if(this.gameManager.mode == "build" && this.gameManager.type == "factory"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "build";
            this.gameManager.type = "factory";
        }
        this.gameManager.updateSelector();
    }

    roadMode(){
        if(this.gameManager.mode == "build" && this.gameManager.type == "road"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "build";
            this.gameManager.type = "road";
        }
        this.gameManager.updateSelector();
    }

    bulldozerMode(){
        if(this.gameManager.mode == "bulldoze"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "bulldoze";
        }
        this.gameManager.updateSelector();
    }

    mouseOverButton(){
        this.gameManager.mouseController.guiLock = true;
    }

    mouseLeftButton(){
        this.gameManager.mouseController.guiLock = false;
    }

    // All dynamic values are updated here
    // income, population, money, goods, etc...
    update(){
        this.money_element.innerHTML = this.gameManager.money;
        this.population_element.innerHTML = this.gameManager.pop-this.gameManager.unemployedPopulation + "/" + this.gameManager.pop;
        this.production_element.innerHTML = this.gameManager.goods-this.gameManager.unusedGoods + "/" + this.gameManager.goods;
        this.time_element.innerHTML = this.gameManager.time;
        this.day_element.innerHTML = this.gameManager.dan;
    }
}