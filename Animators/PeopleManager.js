import { Node } from "../Geometry/Node.js";
import { House } from "../engine/Buildings/House.js";
import { Shop } from "../engine/Buildings/Shop.js";
import { Road } from "../engine/Buildings/Road.js";


export class PeopleManager extends Node{

    static gameManager;

    constructor(options){
        super(options);

        this.animated = true;
        
        this.scale = [0.5, 0.5, 0.5];
        this.updateMatrix();
        this.person = this.children[0];
        
        this.direction = 3;
        this.speed = Math.random()*0.03+0.02;
        this.randomDir = Math.random()*2*Math.PI;
        this.waiting = Math.random()*150 + 250;

        this.sleeping = false;

        this.x;
        this.y;
        
        this.originalOffset =  [0, 1.59, 7];


    }


    placePerson(){
        //console.log(this, this.person);
        let roadList = PeopleManager.gameManager.roads;
        let shopList = PeopleManager.gameManager.shops;
        let houseList = PeopleManager.gameManager.houses;
        
        // faila če so vsi listi prazni oz vse stavbe neaktivne
        if (roadList.size <= 0 && shopList.size <= 0 && houseList.size <= 0){
            return false;
        }else{
            if(shopList.size <= 0 && roadList.size <= 0){
                this.houseMode();
            }else if (shopList.size <= 0){
                if (Math.floor(Math.random()*2) == 0)
                    this.roadMode();
                else
                    this.houseMode();
            }else if (roadList.size <= 0){
                if (Math.floor(Math.random()*2) == 0)
                    this.shopMode();
                else
                    this.houseMode();
            }else{
                let rng = Math.floor(Math.random()*3);
                switch(rng){
                    case 0:
                        this.roadMode();
                    case 1:
                        this.houseMode();
                    case 2:
                        this.shopMode();
                }
            }

        }


    }

    shopMode(){
        let shopList = PeopleManager.gameManager.shops;
        let shop = [...shopList][Math.floor(Math.random()*shopList.size)];
        this.x = shop.x;
        this.y = shop.y;
        this.translation = [this.x*10+5, 0, this.y*10+5];
        this.updateTransformMovement();
        if (shop.direction == 0)
            this.translation = [this.translation[0], this.translation[1], this.translation[2]+3];
        else if (shop.direction == 1)
            this.translation = [this.translation[0]-3, this.translation[1], this.translation[2]];
        else if (shop.direction == 2)
            this.translation = [this.translation[0], this.translation[1], this.translation[2]-3];
        else if (shop.direction == 3)
            this.translation = [this.translation[0]+3, this.translation[1], this.translation[2]];
        this.updateTransformMovement();
    }

    roadMode(){
        let roadList = PeopleManager.gameManager.roads;
        let road = [...roadList][Math.floor(Math.random()*roadList.size)];
        this.x = road.x;
        this.y = road.y;
        this.rotateTo((road.direction+1)%4);
        if(Math.random<0.5) this.rotateTo( (this.direction+2)%4 );
        this.translation = [this.x*10+5, 0, this.y*10+5];
        this.updateTransformMovement();
    }

    houseMode(){
        let houseList = PeopleManager.gameManager.houses;
        let house = [...houseList][Math.floor(Math.random()*houseList.size)];
        this.x = house.x;
        this.y = house.y;
        this.translation = [this.x*10+5, 0, this.y*10+5];
        this.updateTransformMovement();
        if (house.direction == 0)
            this.translation = [this.translation[0], this.translation[1], this.translation[2]+3];
        else if (house.direction == 1)
            this.translation = [this.translation[0]-3, this.translation[1], this.translation[2]];
        else if (house.direction == 2)
            this.translation = [this.translation[0], this.translation[1], this.translation[2]-3];
        else if (house.direction == 3)
            this.translation = [this.translation[0]+3, this.translation[1], this.translation[2]];
        this.updateTransformMovement();
    }




    animate(){
        // Convert actual translation to map terms: 155, 155 -> 15,15
        this.x = (this.translation[0]-5)/10;
        this.y = (this.translation[2]-5)/10;

        // If a user has paused the game, no animations should play
        if (!PeopleManager.gameManager.animationRunning) return;



        // If this person is sleeping, keep him "hidden" inside the town hall.
        // Once the night starts, every person has a 60% change of sleeping, meaning there will still be some night life
        if (this.sleeping){
            this.translation = [155, 0, 155];
            this.updateTransformMovement();
            return;
        }



        if (this.x < 0 || this.y < 0)this.placePerson();
        if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof Road ){
            // Pavement walking
            this.person.translation = [0, 1.53, 0];
            this.person.updateTransformMovement();

            if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "crossroad" ) {
            }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "tcrossroad" ) {
                switch(PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction){
                    case 0:
                        if (this.direction == 2 && Math.round(this.y) - this.y  > 0.33)
                            this.rotateTo( Math.random()< 0.5 ? 1 : 3 );
                        break;
                    case 1:
                        if (this.direction == 3 && this.x - Math.round(this.x) > 0.33)
                            this.rotateTo( Math.random()< 0.5 ? 0 : 2 );
                        break;
                    case 2:
                        if (this.direction == 0 && this.y - Math.round(this.y) > 0.33)
                            this.rotateTo( Math.random()< 0.5 ? 1 : 3 );
                        break;
                    case 3:
                        if (this.direction == 1 && Math.round(this.x) - this.x > 0.33)
                            this.rotateTo( Math.random()< 0.5 ? 0 : 2 );
                        break;

                }

            }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "bend" ){
            
                
                switch( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction ){
                    case 0:
                        if ( this.y < Math.round(this.y) && Math.round(this.x) - this.x > 0.33 && this.direction == 1 ||
                            Math.round(this.y) < this.y && this.x - Math.round(this.x) < 0.33 && this.direction == 1
                        )   this.rotateTo(0);
                        else if ( this.x < Math.round(this.x) && Math.round(this.y) - this.y > 0.33 && this.direction == 2 ||
                            Math.round(this.x) < this.x && this.y - Math.round(this.y) < 0.33 && this.direction == 2
                        )   this.rotateTo(3);
                        break;
                    case 1:
                        if ( this.y < Math.round(this.y) && this.x - Math.round(this.x) > 0.33 && this.direction == 3 ||
                            Math.round(this.y) < this.y && Math.round(this.x) - this.x < 0.33 && this.direction == 3
                        )   this.rotateTo(0);
                        else if ( this.x < Math.round(this.x) && this.y - Math.round(this.y) < 0.33 && this.direction == 2 ||
                            Math.round(this.x) < this.x && Math.round(this.y) - this.y > 0.33 && this.direction == 2
                        )   this.rotateTo(1);
                        break;    
                    case 2: //
                        if ( this.y < Math.round(this.y) && Math.round(this.x) - this.x < 0.33 && this.direction == 3 ||
                            Math.round(this.y) < this.y && this.x - Math.round(this.x) > 0.33 && this.direction == 3
                        )   this.rotateTo(2);
                        else if ( this.x < Math.round(this.x) && Math.round(this.y) - this.y < 0.33 && this.direction == 0 ||
                            Math.round(this.x) < this.x && this.y - Math.round(this.y) > 0.33 && this.direction == 0
                        )   this.rotateTo(1);
                        break;
                    case 3: // \- 0->3, 1->2
                        if ( this.y < Math.round(this.y) && this.x - Math.round(this.x) < 0.33 && this.direction == 1 ||
                            Math.round(this.y) < this.y && Math.round(this.x) - this.x > 0.33 && this.direction == 1
                        )   this.rotateTo(2);
                        else if ( this.x < Math.round(this.x) && this.y - Math.round(this.y) > 0.33 && this.direction == 0 ||
                            Math.round(this.x) < this.x && Math.round(this.y) - this.y < 0.33 && this.direction == 0
                        )   this.rotateTo(3);
                        break;
                }

            }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].type === "road" ){
              
                if (Math.round(this.x)+1 >= PeopleManager.gameManager.map[0].length||
                    Math.round(this.x)-1 < 0 ||
                    Math.round(this.y)+1 >= PeopleManager.gameManager.map.length||
                    Math.round(this.y)-1 < 0
                ){
                    this.rotateTo( (this.direction+2)%4 );
                    this.moveCardinal();
                    return;
                }
                

                if (PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 0 ||
                    PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 2 ){
                    if ( Math.abs(this.y - Math.round(this.y)) < 0.25){
                        if (Math.random()<0.5){ 
                            this.translation = [this.translation[0], this.translation[1], (Math.round(this.y)+0.35)*10+5];
                            this.rotateTo(1);
                        }else{
                            this.translation = [this.translation[0], this.translation[1], (Math.round(this.y)-0.35)*10+5];
                            this.rotateTo(3);
                        }
                    }else if (Math.abs(this.y - Math.round(this.y)) > 0.42){
                        this.placePerson();
                    }
                    this.updateTransformMovement();

                }else if (PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 1 ||
                PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 3 ){
                    if ( Math.abs(this.x - Math.round(this.x)) < 0.25){
                        if (Math.random()<0.5){ 
                            this.translation = [(Math.round(this.x)+0.35)*10+5, this.translation[1], this.translation[2]];
                            this.rotateTo(0);
                        }else{
                            this.translation = [(Math.round(this.x)-0.35)*10+5, this.translation[1], this.translation[2]];
                            this.rotateTo(2);
                        }
                    }else if (Math.abs(this.x - Math.round(this.x)) > 0.42){
                        this.placePerson();
                    }
                    this.updateTransformMovement();
                }


                
                if( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 0 && !( PeopleManager.gameManager.map[Math.round(this.x)+1][Math.round(this.y)] ) ){ 
                    if( this.direction == 3 && (this.x - Math.round(this.x)) > 0.45 ){
                        if (Math.random()<0.3) this.placePerson();
                        this.rotateTo( (this.direction+2)%4 );
                    }
                    if( this.direction == 1 && (Math.round(this.x) - this.x) > 0.45 && !(PeopleManager.gameManager.map[Math.round(this.x)-1][Math.round(this.y)] instanceof Road) ){
                        if (Math.random()<0.3) this.placePerson();
                        this.rotateTo( (this.direction+2)%4 );
                    }
                }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 1 && !( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)+1] ) ){
                    if ( this.direction == 0 && (this.y - Math.round(this.y)) > 0.45 ){
                        if (Math.random()<0.3) this.placePerson();
                        this.rotateTo( (this.direction+2)%4 );
                    }
                }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 2 && !( PeopleManager.gameManager.map[Math.round(this.x)-1][Math.round(this.y)] ) ){
                    if ( this.direction == 1 && (Math.round(this.x) - this.x) > 0.45 ){
                        if (Math.random()<0.3) this.placePerson();
                        this.rotateTo( (this.direction+2)%4 );
                    }
                }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 3 && !( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)-1] ) ){
                    if ( this.direction == 2 && (Math.round(this.y) - this.y) > 0.45 ){
                        if (Math.random()<0.3) this.placePerson();
                        this.rotateTo( (this.direction+2)%4 );
                    }
                }
                
            }
            
            this.moveCardinal();


        }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof Shop ){
            this.person.translation = [0, 1, 0];
            this.person.updateTransformMovement();

            if (this.waiting < 250){
                //shop code
                             
                    this.tempTranslation = this.translation;
                    this.translation = [ this.translation[0] + this.speed * Math.cos(this.randomDir) , this.translation[1], this.translation[2] - this.speed * Math.sin(this.randomDir) ];
                    
                    this.x = (this.translation[0]-5)/10 ;
                    this.y = (this.translation[2]-5)/10;
                if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof Shop ) {
                    if( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 0 && this.y < Math.round(this.y)+0.1 ||
                        PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 1 && this.x > Math.round(this.x)-0.1 ||
                        PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 2 && this.y > Math.round(this.y)-0.1 ||
                        PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 3 && this.x < Math.round(this.x)+0.1
                    ){
                        this.translation = this.tempTranslation;
                        this.updateTransformMovement();
                    }
                    if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 0 && this.y < Math.round(this.y)-0.1 ||
                    PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 1 && this.x > Math.round(this.x)+0.1 ||
                    PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 2 && this.y > Math.round(this.y)+0.1 ||
                    PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 3 && this.x < Math.round(this.x)-0.1
                    )this.placePerson();

                    this.updateTransformMovement();
                }

            }else if (this.waiting < 400){
                if (this.waiting == 399){
                    this.randomDir = Math.random()*2*Math.PI;
                    this.person.rotation = [0, this.randomDir, 0];
                    this.person.updateTransformMovement();
                }
            }else{
                this.waiting = 0;
            }
                this.waiting += 1;

        }else if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof House ){
            // House code
            this.person.translation = [0, 1, 0];
            this.person.updateTransformMovement();

            if (this.waiting < 250){

                    this.tempTranslation = this.translation;
                    this.translation = [ this.translation[0] + this.speed * Math.cos(this.randomDir) , this.translation[1], this.translation[2] - this.speed * Math.sin(this.randomDir) ];
                    
                    this.x = (this.translation[0]-5)/10 ;
                    this.y = (this.translation[2]-5)/10;
                    if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)] instanceof House ) {
                        if( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 0 && this.y < Math.round(this.y)+0.3 ||
                            PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 1 && this.x > Math.round(this.x)-0.3 ||
                            PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 2 && this.y > Math.round(this.y)-0.3 ||
                            PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 3 && this.x < Math.round(this.x)+0.3
                        ){
                            this.translation = this.tempTranslation;
                            this.updateTransformMovement();
                        }
                        if ( PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 0 && this.y < Math.round(this.y)-0.3 ||
                        PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 1 && this.x > Math.round(this.x)+0.3 ||
                        PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 2 && this.y > Math.round(this.y)+0.3 ||
                        PeopleManager.gameManager.map[Math.round(this.x)][Math.round(this.y)].direction == 3 && this.x < Math.round(this.x)-0.3
                        )this.placePerson();
    
                        this.updateTransformMovement();
                    }

            }else if (this.waiting < 400){
                if (this.waiting == 399){
                    this.randomDir = Math.random()*2*Math.PI;
                    this.person.rotation = [0, this.randomDir, 0];
                    this.person.updateTransformMovement();
                }
            }else{
                this.waiting = 0;
            }
                this.waiting += 1;



        }else{
            // Everything else, offroad, town hall, factory, be very careful with this one
            // They shouldn't be walking to factories and wind turbines, but also they shouldn't be phasing
            // through town halls and trees
            if (!this.sleeping)
                this.placePerson();

        }



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
        return new PeopleManager({
            ...this,
            children: this.children.map(child => child.clone()),
        });
    }







}