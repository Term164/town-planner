import { Node } from "../Geometry/Node.js";
import { GameManager } from "../engine/GameManager.js";
import { Tile } from "../engine/Buildings/Tile.js";
import { House } from "../engine/Buildings/House.js";
import { Shop } from "../engine/Buildings/Shop.js";
import { Factory } from "../engine/Buildings/Factory.js";
import { Road } from "../engine/Buildings/Road.js";
import { TownHall } from "../engine/Buildings/TownHall.js";


export class PeopleManager extends Node{

    static gameManager;

    constructor(options){
        super(options);
        this.phi = 0.002;   
        this.animated = true;
        
        this.scale = [0.5, 0.5, 0.5];
        this.updateMatrix();

        this.person = this.children[0];

        this.direction = 3;
        this.speed = 0.03;

        this.x;
        this.y;
        
        this.placePerson();

    }


    placePerson(){
        this.translation = [145, 0, 135];
        this.updateMatrix();

    }

    animate(){
        this.x = (this.translation[0]-5)/10 ;
        this.y = (this.translation[2]-5)/10;
        if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof Road )
            console.log(PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction);
        
        
        if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof Road ){
            // Pavement walking
            if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "crossroad" ) {
            }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "tcrossroad" ) {
            }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "bend" ){
                
                console.log( this.person.translation[2] , this.y); 
                switch( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction ){
                    case 0:
                        if ( Math.round(this.y) > this.y && Math.round(this.x) - this.x > 0.45 && this.direction == 1 ||
                            Math.round(this.y) < this.y && this.x - Math.round(this.x) > 0.1 && this.direction == 1
                        )   this.rotateTo(0);
                        else if ( Math.round(this.x) > this.x && Math.round(this.y) - this.y > 0.45 && this.direction == 2 ||
                            Math.round(this.x) < this.x && this.y - Math.round(this.y) > 0.45 && this.direction == 2
                        )   this.rotateTo(3);
                            
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



            }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "road" ){
                
                if( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 0 && !( PeopleManager.gameManager.map[Math.round(this.x)+1][Math.round(this.y)] ) ){ 
                    if( this.direction == 3 && (this.x - Math.round(this.x)) > 0.45 )
                        this.rotateTo( (this.direction+2)%4 );
                    if( this.direction == 1 && ( Math.round(this.x) - this.x) > 0.45 && !(PeopleManager.gameManager.map[Math.round(this.x)-1][Math.round(this.y)] instanceof Road) )
                        this.rotateTo( (this.direction+2)%4 );
                }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 1 && !( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)+1] ) ){
                    if ( this.direction == 0 && (this.y - Math.round(this.y)) > 0.45 )
                        this.rotateTo( (this.direction+2)%4 );
                }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 2 && !( PeopleManager.gameManager.map[Math.round(this.x)-1][Math.round(this.y)] ) ){
                    if ( this.direction == 1 && (Math.round(this.x) - this.x) > 0.45 )
                        this.rotateTo( (this.direction+2)%4 );
                }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 3 && !( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)-1] ) ){
                    if ( this.direction == 2 && (Math.round(this.y) - this.y) > 0.45 )
                        this.rotateTo( (this.direction+2)%4 );
                }

            }





        }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof Shop ){
            // Shop code
        

        }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof House ){
            // House code
        
        }else{
            // Everything else, offroad, town hall, factory, be very careful with this one
            // They shouldn't be walking to factories and wind turbines, but also they shouldn't be phasing
            // through town halls and trees

            this.placePerson();

        }
       
        //Move
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

    

    // 0 Down, 1 Left, 2 Up, 3 Right
    rotateTo(num){
        switch(num){
            case 0:
                this.person.rotation = [0, -Math.PI/2 , 0];
                this.person.updateTransformMovement();
                this.direction = 0;
                break;
            case 1:
                this.person.rotation = [0, Math.PI, 0];
                this.person.updateTransformMovement();
                this.direction = 1;
                break;
            case 2:
                this.person.rotation = [0, Math.PI/2, 0];
                this.person.updateTransformMovement();
                this.direction = 2;
                break;                
            case 3:
                this.person.rotation = [0, 0, 0];
                this.person.updateTransformMovement();
                this.direction = 3;
                break;    
        }
    }



    clone() {
        return new PeopleManager({
            ...this,
            children: this.children.map(child => child.clone()),
        });
    }







}