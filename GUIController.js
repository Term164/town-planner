
let score = 100;
let money = 10;
let production = 50;
let population = 10;
let happiness = 85;


let nday = 0;
let day = "MON";
let time = 8;

let timespeed = 1;

let house_cost = 100;
let shop_cost = 200;
let factory_cost = 400;
let wind_turbine_cost = 300;
let road_cost = 50;
let bulldoze_cost = 20;

const score_element = document.getElementById("score_data");
const money_element = document.getElementById("money_data");
const population_element = document.getElementById("population_data");
const happiness_element = document.getElementById("happiness_data");
const production_element = document.getElementById("production_data");

const day_element = document.getElementById("datetime_day_data");
const time_element = document.getElementById("datetime_time_data");

const pause_element = document.getElementById("pause_icon");
const play_element = document.getElementById("play_icon");
const ff_element = document.getElementById("ff_icon");

const house_element = document.getElementById("house_icon");
const shop_element = document.getElementById("shopp_icon");
const factory_element = document.getElementById("factory_icon");
const road_element = document.getElementById("road_icon");
const bulldozer_element = document.getElementById("bulldozer_icon");

const house_cost_element = document.getElementById("house_cost_data");
const shop_cost_element = document.getElementById("shop_cost_data");
const factory_cost_element = document.getElementById("factory_cost_data");
const road_cost_element = document.getElementById("road_cost_data");
const wind_turbine_cost_elemet = document.getElementById("wind_turbine_cost_data");
const bulldoze_cost_element = document.getElementById("bulldoze_cost_data");



const arrow_down_element = document.getElementById("arrow_down_icon");
const arrow_up_element = document.getElementById("arrow_up_icon");

pause_element.addEventListener("click", pauseClick);
play_element.addEventListener("click", playClick);
ff_element.addEventListener("click", ffClick);

arrow_down_element.addEventListener("click", arrowDownClick);
arrow_up_element.addEventListener("click", arrowUpClick);


// Uporaben del kode:
/*
house_element.addEventListener("click", myFunction );
shop_element.addEventListener("click", myFunction );
factory_element.addEventListener("click", myFunction );
road_element.addEventListener("click", myFunction );
bulldozer_element.addEventListener("click", myFunction );
*/

score_element.innerHTML = score;
money_element.innerHTML = money;
production_element.innerHTML = production;
population_element.innerHTML = population;
happiness_element.innerHTML = happiness;

day_element.innerHTML = day;
time_element.innerHTML = time;

house_cost_element.innerHTML = house_cost;
shop_cost_element.innerHTML = shop_cost;
factory_cost_element.innerHTML = factory_cost;
road_cost_element.innerHTML = road_cost;
wind_turbine_cost_elemet.innerHTML = wind_turbine_cost;
bulldoze_cost_element.innerHTML = bulldoze_cost;



function pauseClick(){
    alert("PAVZA");
    // 
    // gamestate = "pause"
    // alneki

}

function playClick(){
    //alert("RESUME");
    timespeed = 1;
    // gamestate = "resume";
    // alneki

}

function ffClick(){
    //alert("FF");
    timespeed = 5;
    // gamespeed *= 2;
    // alneka druga konstanta whatever

}

function arrowDownClick(){
    let down = document.getElementById("toolbar_div");
    down.style.display = "none";
    let up = document.getElementById("toolbar_show_div");
    up.style.display = "block";
}

function arrowUpClick(){
    let down = document.getElementById("toolbar_div");
    down.style.display = "block";
    let up = document.getElementById("toolbar_show_div");
    up.style.display = "none";
}





function povecaj_score(){
    score+=1000;
    score_element.innerHTML = score;

    money+=100;
    money_element.innerHTML = money;

    
}

function povecaj_dan(){
    time+=1;
    if(time >= 24) {
        time=0;
        nday+=1;
    }
    
    
    if(nday >= 7) nday=0;
    
    let dan;
    switch(nday){
        case 0:
            dan="MON";
            break;
        case 1:
            dan="TUE";
            break;
        case 2:
            dan="WED";
            break;
        case 3:
            dan="THU";
            break;
        case 4:
            dan="FRI";
            break;
        case 5:
            dan="SAT";
            break;
        case 6:
            dan="SUN";
            break;
    }

    time_element.innerHTML = time;
    day_element.innerHTML = dan;

}


setInterval(povecaj_score, 1000);
setInterval(povecaj_dan, 300);








