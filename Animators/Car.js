import { Node } from "../Geometry/Node.js";
import { GameManager } from "../engine/GameManager.js";
import { Tile } from "../engine/Buildings/Tile.js";
import { House } from "../engine/Buildings/House.js";
import { Shop } from "../engine/Buildings/Shop.js";
import { Factory } from "../engine/Buildings/Factory.js";
import { Road } from "../engine/Buildings/Road.js";
import { TownHall } from "../engine/Buildings/TownHall.js";


export class Car extends Node{

    static gameManager;

    constructor(options){
        super(options);
        this.phi = 0;   
        this.animated = true;
        this.carBody = this.children[0];

        this.scale = [0.5, 0.5, 0.5];       
        this.updateMatrix();

        this.direction = 3;
        this.speed = 0.1;

        //this.placeCar();

        this.x;
        this.y;
        

    }


    placeCar(){
        
        let list = Car.gameManager.roads;
        if(list.size != 0 ){
        let rng = Math.floor(Math.random()*list.size);
            let road = [...list][rng];
            this.x = road.x;
            this.y = road.y;
            this.rotateTo((road.direction+1)%4);
            //if(Math.random<0.5) this.rotateTo( (this.direction+2)%4 );
            this.translation = [this.x*10+5, 0, this.y*10+5];
            this.updateTransformMovement();
            
        }else{
            return false;
        }
        
    }
    

    
    animate(){

        // If a user has paused the game, no animations should play
        if (!Car.gameManager.animationRunning) return;


        //wheels
        this.phi -= (this.speed / 0.4 ); // w = v/r 
        if (this.phi < 0 ) this.phi += 2*Math.PI;
        for (let i = 0; i < 4; i++){
            this.carBody.children[i].rotation = [Math.PI/2 , 0, this.phi ];
            this.carBody.children[i].updateTransformMovement();
        }
        
        this.moveCar();
    }


    moveCar(){

        this.x = (this.translation[0]-5)/10 ;
        this.y = (this.translation[2]-5)/10;
        //console.log("i am at (mapterms): "+ Math.round(this.x), Math.round(this.y));
        //console.log( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof Road );
        //if ( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof Road )
            //console.log( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction );
        //console.log( Car.gameManager.map[15][15] instanceof TownHall); // Tile, in vsi podrazredi


        if ( !(Car.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof Road) ){
            this.placeCar();
        } else {
            // If crossroad
            if ( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "crossroad" ) {
                
                if ( Math.abs(this.x - Math.round(this.x) ) < 0.001 && Math.abs(this.y - Math.round(this.y) ) < 0.001 ){ // polovica
                    let dir = Math.floor(Math.random()*3);
                    
                    switch(this.direction){
                        case 0:
                            if (dir == 2) this.rotateTo(3);
                            else this.rotateTo(dir);
                            break;
                        case 1:
                            this.rotateTo(dir);
                            break;
                        case 2:
                            this.rotateTo(dir+1);
                            break;
                        case 3:                
                            if (dir == 1) this.rotateTo(3);
                            else this.rotateTo(dir);
                            break;                
                    }
                }   

                
            }else if ( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "tcrossroad" ) { // If T crossroad
                if ( Math.abs(this.x - Math.round(this.x) ) < 0.001 && Math.abs(this.y - Math.round(this.y) ) < 0.001 ){ // polovica
                    let dir = Math.floor(Math.random()*2);
                    switch (  Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction ){
                        case 0:
                            if (this.direction == 3){
                                if (dir == 1) this.rotateTo(3);
                                else this.rotateTo(0);
                            }else if (this.direction == 2){
                                if (dir == 0) this.rotateTo(3);
                                else this.rotateTo(1);
                            }else {
                                this.rotateTo(dir);
                            }
                            break;
                        case 1:
                            if (this.direction == 3){
                                if (dir == 1) this.rotateTo(2);
                                else this.rotateTo(0);
                            }else if (this.direction == 2){
                                if (dir == 0) this.rotateTo(2);
                                else this.rotateTo(1);
                            }else {
                                this.rotateTo(dir);
                            }
                            break;
                        case 2:
                            if (this.direction == 3){
                                if (dir == 1) this.rotateTo(3);
                                else this.rotateTo(2);
                            }else if (this.direction == 0){
                                if (dir == 0) this.rotateTo(3);
                                else this.rotateTo(1);
                            }else {
                                if (dir ==  0) this.rotateTo(2);
                                else this.rotateTo(1);
                            }
                            break;
                        case 3:
                            if (this.direction == 1){
                                if (dir == 1) this.rotateTo(2);
                                else this.rotateTo(0);
                            }else if (this.direction == 0){
                                if (dir == 1) this.rotateTo(3);
                                else this.rotateTo(0);
                            }else {
                                if (dir ==  0) this.rotateTo(2);
                                else this.rotateTo(3);
                            }
                            break;

                    }

                }


            }else if ( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "bend" ){ // if bend
                if ( Math.abs(this.x - Math.round(this.x) ) < 0.001 && Math.abs(this.y - Math.round(this.y) ) < 0.001 ){ // polovica
                    switch( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction ){
                        case 0:
                            if ( this.direction == 2 ) this.rotateTo(3);
                            else this.rotateTo(0);
                            break;
                        case 1:
                            if ( this.direction == 2 ) this.rotateTo(1);
                            else this.rotateTo(0);
                            break;
                        case 2:
                            if ( this.direction == 0 ) this.rotateTo(1);
                            else this.rotateTo(2);
                            break;
                        case 3:
                            if ( this.direction == 0 ) this.rotateTo(3);
                            else this.rotateTo(2);
                            break;
                    }
                
                }

            }else if ( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "road" ){ // konec ravne ceste, 180°
                if ( Math.round(this.x)+1 >= Car.gameManager.map[0].length||
                    Math.round(this.x)-1 < 0 ||
                    Math.round(this.y)+1 >= Car.gameManager.map.length||
                    Math.round(this.y)-1 < 0
                ){
                    this.rotateTo( (this.direction+2)%4 );
                    this.moveCardinal();
                    return;
                }
                
                if( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 0 && !(Car.gameManager.map[Math.round(this.x)+1][Math.round(this.y)] instanceof Road) ){ 
                        if( this.direction == 3 && (this.x - Math.round(this.x)) > 0.3 )
                            this.rotateTo( (this.direction+2)%4 );
                        if( this.direction == 1 && ( Math.round(this.x) - this.x) > 0.3 && !(Car.gameManager.map[Math.round(this.x)-1][Math.round(this.y)] instanceof Road) )
                            this.rotateTo( (this.direction+2)%4 );
                    }else if ( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 1 && !(Car.gameManager.map[Math.round(this.x)][Math.round(this.y)+1] instanceof Road) ){
                        if ( this.direction == 0 && (this.y - Math.round(this.y)) > 0.3 )
                            this.rotateTo( (this.direction+2)%4 );

                    }else if ( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 2 && !(Car.gameManager.map[Math.round(this.x)-1][Math.round(this.y)] instanceof Road) ){
                        if ( this.direction == 1 && (Math.round(this.x) - this.x) > 0.3 )
                            this.rotateTo( (this.direction+2)%4 );


                    }else if ( Car.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 3 && !(Car.gameManager.map[Math.round(this.x)][Math.round(this.y)-1] instanceof Road) ){
                        if ( this.direction == 2 && (Math.round(this.y) - this.y) > 0.3 )
                            this.rotateTo( (this.direction+2)%4 );
                    }

            }


        }


        this.moveCardinal();
        


    }

    // 0 Down, 1 Left, 2 Up, 3 Right
    rotateTo(num){
        switch(num){
            case 0:
                this.rotation = [0, -Math.PI/2 , 0];
                this.updateTransformMovement();
                this.direction = 0;
                break;
            case 1:
                this.rotation = [0, Math.PI, 0];
                this.updateTransformMovement();
                this.direction = 1;
                break;
            case 2:
                this.rotation = [0, Math.PI/2, 0];
                this.updateTransformMovement();
                this.direction = 2;
                break;                
            case 3:
                this.rotation = [0, 0, 0];
                this.updateTransformMovement();
                this.direction = 3;
                break;    
        }
    }


    moveCardinal(){

        switch(this.direction){
            case 0:
                this.translation = [ this.translation[0] , this.translation[1], this.translation[2] + this.speed];
                break;
            case 1:
                this.translation = [ this.translation[0] - this.speed, this.translation[1], this.translation[2] ];
                break;
            case 2:
                this.translation = [ this.translation[0] , this.translation[1], this.translation[2] - this.speed];
                break;
            case 3:
                this.translation = [ this.translation[0] + this.speed, this.translation[1], this.translation[2] ];
                break;
        }
        this.updateTransformMovement();

    }




    clone() {
        return new Car({
            ...this,
            children: this.children.map(child => child.clone()),
        });
    }




}


