

export class GUIManager{
    constructor(){
        this.gameManager = null;
        

        this.house_cost = 100;
        this.shop_cost = 200;
        this.factory_cost = 400;
        this.wind_turbine_cost = 300;
        this.road_cost = 25;
        this.bulldoze_cost = 20;

        this.getAllElements();
        this.setEventListeners();

        this.HUDisOn = true;

        this.setHint();
    }

    setGameManager(gameManager){
        this.gameManager = gameManager;
    }

    setSoundManager(soundManager){
        this.soundManager = soundManager;
    }

    getAllElements(){
        this.score_element = document.getElementById("score_data");
        
        this.money_element = document.getElementById("money_data");
        
        this.income_data = document.getElementById("income_data");
        
        this.population_working = document.getElementById("population_working_data");
        this.population_all = document.getElementById("population_all_data");
        

        this.happiness = document.getElementById("happiness_data");
        
        this.goods_used = document.getElementById("production_used_data");
        this.goods_all = document.getElementById("production_all_data");
        
        this.energy_used = document.getElementById("energy_used_data");
        this.energy_all = document.getElementById("energy_all_data");


        
        this.day_element = document.getElementById("datetime_day_data");
        this.time_element = document.getElementById("datetime_time_data");

        this.pause_element = document.getElementById("pause_icon");
        this.play_element = document.getElementById("play_icon");
        this.ff_element = document.getElementById("ff_icon");

        this.house_element = document.getElementById("house_icon");
        this.shop_element = document.getElementById("shop_icon");
        this.factory_element = document.getElementById("factory_icon");
        this.road_element = document.getElementById("road_icon");
        this.wind_turbine_elemet = document.getElementById("wind_turbine_icon");
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
        this.loading_background = document.getElementById("loading_background");

        this.house_cost_element.innerHTML = this.house_cost;
        this.shop_cost_element.innerHTML = this.shop_cost;
        this.factory_cost_element.innerHTML = this.factory_cost;
        this.road_cost_element.innerHTML = this.road_cost;
        this.wind_turbine_cost_elemet.innerHTML = this.wind_turbine_cost;
        this.bulldoze_cost_element.innerHTML = this.bulldoze_cost;
    
        this.game_over_element = document.getElementById("gameover_div");
        this.game_over_text_element = document.getElementById("gameover_text");
        this.canvas_element = document.getElementById("myCanvas");
        
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
        this.wind_turbine_elemet.addEventListener('mouseover', this.mouseOverButton);
        this.wind_turbine_elemet.addEventListener('mouseout', this.mouseLeftButton);
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
        this.game_over_element.addEventListener('mouseover', this.mouseOverButton);

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
        this.windTurbineMode = this.windTurbineMode.bind(this);
        this.bulldozerMode = this.bulldozerMode.bind(this);
        this.house_element.addEventListener("click", this.houseMode);
        this.shop_element.addEventListener("click", this.shopMode);
        this.factory_element.addEventListener("click", this.factoryMode);
        this.road_element.addEventListener("click", this.roadMode);
        this.wind_turbine_elemet.addEventListener("click", this.windTurbineMode);
        this.bulldozer_element.addEventListener("click", this.bulldozerMode);
        
        // HUD on/off
        this.KeyPressed = this.KeyPressed.bind(this);
        document.addEventListener('keydown', this.KeyPressed); // pressed key

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
            "Hello World!",
        ]
    
        let text = this.hintList[ Math.floor( Math.random() * this.hintList.length )];
        this.hint_element.innerHTML = text;
    }

    closeLoadingScreen(){
        this.loading_screen.style.display = "none";
        this.loading_background.style.display = "none";
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
        if(this.gameManager.townPlanner.normalSpeed != null){
            clearInterval(this.gameManager.townPlanner.normalSpeed);
            clearInterval(this.gameManager.townPlanner.normalSunSpeed);
        }
        if(this.gameManager.townPlanner.fastSpeed != null){
            clearInterval(this.gameManager.townPlanner.fastSpeed);
            clearInterval(this.gameManager.townPlanner.fastSunSpeed);
        }
        this.soundManager.pauseCrowd();
        this.gameManager.animationRunning = false;
    }

    playClick(){
        this.pauseClick();
        this.gameManager.townPlanner.setNormalGameSpeed();
        this.gameManager.townPlanner.setSunUpdateNormalSpeed();
        this.soundManager.playCrowd();
        this.gameManager.animationRunning = true;
    }

    // Just speed up the time no need for animations
    ffClick(){
        this.pauseClick();
        this.gameManager.townPlanner.setFastForwardSpeed();
        this.gameManager.townPlanner.setSunUpdateFastSpeed();
        this.soundManager.playCrowd();
        this.gameManager.animationRunning = true;
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

    windTurbineMode(){
        if(this.gameManager.mode == "build" && this.gameManager.type == "wind_turbine"){
            this.gameManager.mode = "look";
        }else{
            this.gameManager.mode = "build";
            this.gameManager.type = "wind_turbine";
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
        this.population_working.innerHTML = this.gameManager.pop-this.gameManager.unemployedPopulation;
        this.population_all.innerHTML = Math.round(this.gameManager.pop);
        this.goods_used.innerHTML = this.gameManager.goods-this.gameManager.unusedGoods;
        this.goods_all.innerHTML = this.gameManager.goods;
        this.energy_all.innerHTML = this.gameManager.energyProduction;
        this.energy_used.innerHTML = this.gameManager.criticalEnergy;
        this.income_data.innerHTML = this.gameManager.income;
        this.happiness.innerHTML = Math.floor(this.gameManager.overalHappiness * 100);
        this.score_element.innerHTML = Math.floor(this.gameManager.pop * this.gameManager.income * this.gameManager.overalHappiness);
        
        this.time_element.innerHTML = this.gameManager.time;
        this.day_element.innerHTML = this.gameManager.dan;

    }

    gameOver(reason){
        this.game_over_element.style.display = "block";
        // set game over text
        this.soundManager.pauseCrowd();
        this.soundManager.pauseBackground();

        this.canvas_element.style.filter = "blur(4px)";

        this.disableHUD();

        this.gameManager.townPlanner.camera.disable();
        if (reason == "happiness"){
            this.setGameOverHappiness();
        }else{
            this.setGameOverTownHall();
        }

        this.gameManager.animationRunning = false;
        this.gameManager.setHoverSelector("selectedTile"); 
       
    }

    setGameOverHappiness(){
        let list = [
            "Nooo, they were too sad. And now I'm sad....",
            "You happiness got too low. How about trying again and this time trying?",
            "Keep a close look on happiness. As for now, it's the only way you can lose.",
            "People hate your city, wow. Now they're moving out. Now you're all alone. Just like before.",
            "Try putting Factories away from houses.",
            "Try putting more Houses next to other houses.",
            "Try having more shops. Or something, idk...",
            "I get it, being a mayor is hard. But you're playing a kids video game, c'mon man!",
            "Happiness level cannot get past 100%, but it certainly can get below 15%.",
            "Are you happy now? Cause they certainly aren't!",
            "For more funny text messages, just reload the game and look at the loading scren. And then actually TRY to play the game.",
            "I won't roast you for losing. But this game could've been made in Roblox. And you suck in Roblox!",
            "This isn't advanced calculus, just keep the Happiness above 15%.",
            "Does that really say Game Over? Wow. I guess that's it. See you next time.",


        ];
        let text = list[Math.floor(Math.random()*list.length)];
        this.game_over_text_element.innerHTML = text;
    }
    
    setGameOverTownHall(){
        let list = [
            "What are you trying to do? Anarchy?!?",
            "Deleting the Town Hall probably wasn't such a good idea, was it?",
            "Now who's gonna run the city? Clearly you can't do it alone.",
            "I leave for 5 minutes and you already demolished our building?",
            "Town Hall is the most important building. It just is.",
            "You demolished your own building. How does it feel?",
            "I think in the rules it said that you shouldn't destroy the Town Hall? Did you even read them?"            

        ];
        let text = list[Math.floor(Math.random()*list.length)];
        this.game_over_text_element.innerHTML = text;
    }

    enableHUD(){
        this.HUDisOn=true;
        document.getElementById("toolbar_show_div").style.display = "block";
        document.getElementById("toolbar_div").style.display = "block";
        document.getElementById("controls_div").style.display = "block";
        document.getElementById("datetime_div").style.display = "block";
        document.getElementById("score_tooltip").style.display = "block";
        document.getElementById("score_div").style.display = "block";
        document.getElementById("energy_tooltip").style.display = "block";
        document.getElementById("energy_div").style.display = "block";
        document.getElementById("goods_tooltip").style.display = "block";
        document.getElementById("production_div").style.display = "block";
        document.getElementById("happiness_tooltip").style.display = "block";
        document.getElementById("happiness_div").style.display = "block";
        document.getElementById("population_tooltip").style.display = "block";
        document.getElementById("population_div").style.display = "block";
        document.getElementById("income_tooltip").style.display = "block";
        document.getElementById("income_div").style.display = "block";
        document.getElementById("money_tooltip").style.display = "block";
        document.getElementById("money_div").style.display = "block";

    }

    disableHUD(){
        this.HUDisOn=false;
        document.getElementById("toolbar_show_div").style.display = "none";
        document.getElementById("toolbar_div").style.display = "none";
        document.getElementById("controls_div").style.display = "none";
        document.getElementById("datetime_div").style.display = "none";
        document.getElementById("score_tooltip").style.display = "none";
        document.getElementById("score_div").style.display = "none";
        document.getElementById("energy_tooltip").style.display = "none";
        document.getElementById("energy_div").style.display = "none";
        document.getElementById("goods_tooltip").style.display = "none";
        document.getElementById("production_div").style.display = "none";
        document.getElementById("happiness_tooltip").style.display = "none";
        document.getElementById("happiness_div").style.display = "none";
        document.getElementById("population_tooltip").style.display = "none";
        document.getElementById("population_div").style.display = "none";
        document.getElementById("income_tooltip").style.display = "none";
        document.getElementById("income_div").style.display = "none";
        document.getElementById("money_tooltip").style.display = "none";
        document.getElementById("money_div").style.display = "none";

    }

    KeyPressed(e){
        if(e.code == "KeyH"){
            if(this.HUDisOn){
                this.disableHUD();
            }else{
                this.enableHUD();
            }
        }   
    }
    



}