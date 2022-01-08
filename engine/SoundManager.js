

export class SoundManager{

    constructor(){
        this.gameManager = null;
        this.guiManager = null;

        this.getElements();
    }

    setManagers(gameManager){
        this.gameManager = gameManager;
        this.guiManager = this.gameManager.guiManager;
    }


    getElements(){

        this.audioContext = new AudioContext();

        this.background_element = document.getElementById("background_audio");
        this.background_element.volume = 0.05;

        this.crowd_element = document.getElementById("crowd_audio");
        this.crowd_element.volume = 0.2;

        this.construct_element = document.getElementById("construct_fx");
        this.construct_element.volume = 0.7;
        this.demolish_element = document.getElementById("demolish_fx");
        this.demolish_element.volume = 0.6;


    }

    playBackground(){
        this.background_element.play();
    }

    playCrowd(){
        this.crowd_element.play();
    }

    pauseCrowd(){
        this.crowd_element.pause();
    }

    updateCrowd(camera, crowdPoint, anyHouses, sunState){
        if (sunState="moon"){
            this.crowd_element.volume = 0;
            return;
        }
        if (anyHouses){
        let distance = Math.sqrt( (camera[0]-crowdPoint[0])**2 + (camera[1]-crowdPoint[1])**2 + (camera[2]-crowdPoint[2])**2 );
        let value=0;
        if (distance <= 20) value = 0.2;
        else if (distance >= 100) value = 0;
        else value = (-0.2/80) * distance + 0.25;
        
        this.crowd_element.volume = value;
        
        }else
            this.crowd_element.volume = 0;

    }

    playConstructSound(){
        this.construct_element.pause();
        this.construct_element.currentTime = 0;
        this.construct_element.play();
    }

    playDemolishSound(){
        this.demolish_element.pause();
        this.demolish_element.currentTime = 0;
        this.demolish_element.play();
    }



    /**
     * 
     *  TO DO
     *  - Setup camera controls, probably main menu would help here
     *  - Connect sounds to something other than play button/enable camera button !
     *  * Main Menu (Start game, help, exit), maybe add Volume sliders to GUI or options in the menu *
     *  - Tweaks and balance details *
     *  
     *  
     *  
     * 
     * 
     * 
     * 
     */





}
