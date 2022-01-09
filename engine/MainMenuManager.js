import { App } from '../town_Planner.js';

export class MainMenuManager{

    constructor(canvas){

        // vzami elemente za main menu, podobno kot gui manager
        // tipo event listenerje
        // ko se pritisne play, se uzvede glavna funkcija ki starta game!!!!
        
        this.menu_element = document.getElementById("main_menu_div");
        this.play_element = document.getElementById("main_menu_play");
        this.howto_element = document.getElementById("main_menu_howto");
        this.howto_back_element = document.getElementById("howto_back");
        this.howto_page_element = document.getElementById("howto_div");
        this.background_element = document.getElementById("main_menu_background");

        this.setUpEventListeners();

        this.canvas = canvas;

    }

    setUpEventListeners(){
        this.startGame = this.startGame.bind(this);
        this.play_element.addEventListener("click", this.startGame);
        
        this.openHowToPlay = this.openHowToPlay.bind(this);
        this.howto_element.addEventListener("click", this.openHowToPlay);

        this.closeHowToPlay = this.closeHowToPlay.bind(this);
        this.howto_back_element.addEventListener("click", this.closeHowToPlay);

    }

    startGame(){
        // MASTER FUNCTION, closes the main menu and starts the game
        // real shit!!
        this.menu_element.style.display = "none";
        this.background_element.style.display = "none";
        const app = new App(this.canvas);
    }

    openHowToPlay(){
        this.howto_page_element.style.display = "block";
    } 

    closeHowToPlay(){
        this.howto_page_element.style.display = "none";
    }













}