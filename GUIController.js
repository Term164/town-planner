import { ModelManager } from './Geometry/ModelManager.js';

export class GUIController {

    constructor(){

        this.score = 100;
        this.money = 10;
        this.production = 50;
        this.population = 10;
        this.happiness = 85;

        this.nday = 0;
        this.day = "MON";
        this.time = 8;

        this.house_cost = 100;
        this.shop_cost = 200;
        this.factory_cost = 400;
        this.wind_turbine_cost = 300;
        this.road_cost = 50;
        this.bulldoze_cost = 20;

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
        this.shop_element = document.getElementById("shopp_icon");
        this.factory_element = document.getElementById("factory_icon");
        this.road_element = document.getElementById("road_icon");
        this.wind_turbine_elemet = document.getElementById("wind_turbine_icon");
        this.bulldozer_element = document.getElementById("bulldozer_icon");

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



        this.pause_element.addEventListener("click", this.pauseClick);
        this.play_element.addEventListener("click", this.playClick);
        this.ff_element.addEventListener("click", this.ffClick);

        this.arrow_down_element.addEventListener("click", this.arrowDownClick);
        this.arrow_up_element.addEventListener("click", this.arrowUpClick);


        // Uporaben del kode:
        /*
        house_element.addEventListener("click", myFunction );
        shop_element.addEventListener("click", myFunction );
        factory_element.addEventListener("click", myFunction );
        road_element.addEventListener("click", myFunction );
        wind_turbine_element.addEventListener("click", myFunction);
        bulldozer_element.addEventListener("click", myFunction );
        */




        this.score_element.innerHTML = this.score;
        this.money_element.innerHTML = this.money;
        this.production_element.innerHTML = this.production;
        this.population_element.innerHTML = this.population;
        this.happiness_element.innerHTML = this.happiness;

        this.day_element.innerHTML = this.day;
        this.time_element.innerHTML = this.time;

        this.house_cost_element.innerHTML = this.house_cost;
        this.shop_cost_element.innerHTML = this.shop_cost;
        this.factory_cost_element.innerHTML = this.factory_cost;
        this.road_cost_element.innerHTML = this.road_cost;
        this.wind_turbine_cost_elemet.innerHTML = this.wind_turbine_cost;
        this.bulldoze_cost_element.innerHTML = this.bulldoze_cost;

}


pauseClick(){
    alert("PAVZA");
    // 
    // gamestate = "pause"
    // alneki

}

playClick(){
    //alert("RESUME");
    this.timespeed = 1;
    // gamestate = "resume";
    // alneki

}

ffClick(){
    //alert("FF");
    this.timespeed = 5;
    // gamespeed *= 2;
    // alneka druga konstanta whatever

}

arrowDownClick(){
    let down = document.getElementById("toolbar_div");
    down.style.display = "none";
    let up = document.getElementById("toolbar_show_div");
    up.style.display = "block";
}

arrowUpClick(){
    let down = document.getElementById("toolbar_div");
    down.style.display = "block";
    let up = document.getElementById("toolbar_show_div");
    up.style.display = "none";
}





povecaj_score(){
    this.score+=1000;
    this.score_element.innerHTML = score;

    this.money+=100;
    this.money_element.innerHTML = money;

    
}

povecaj_dan(){
    this.time+=1;
    if(this.time >= 24) {
        this.time=0;
        this.nday+=1;
}
    
    
    if(this.nday >= 7) this.nday=0;
    
    this.dan;
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

    this.time_element.innerHTML = time;
    this.day_element.innerHTML = dan;

}

closeLoadingScreen(){
    this.loading_screen.style.display = "none";
}

loadPercentage(num){
    this.loading_percentage.innerHTML = num;
}





}

