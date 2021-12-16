

let score = 100;
let nday = 0;
let day = "Monday";
let time = 8;

let timespeed = 1;

const score_element = document.getElementById("score_data");

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
day_element.innerHTML = day;
time_element.innerHTML = time;


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
            dan="Monday";
            break;
        case 1:
            dan="Tuesday";
            break;
        case 2:
            dan="Wednesday";
            break;
        case 3:
            dan="Thursday";
            break;
        case 4:
            dan="Friday";
            break;
        case 5:
            dan="Saturday";
            break;
        case 6:
            dan="Sunday";
            break;
    }

    time_element.innerHTML = time;
    day_element.innerHTML = dan;

}


setInterval(povecaj_score, 1000);
setInterval(povecaj_dan, 3000);








