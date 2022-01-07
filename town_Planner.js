import { GUI } from '../lib/dat.gui.module.js';

import { Application } from './engine/Application.js';
import { Renderer } from './engine/Renderer.js';
import { Physics } from './engine/Physics.js';
import { GLTFLoader } from './Geometry/GLTFLoader.js';
import { PerspectiveCamera } from './Geometry/PerspectiveCamera.js';
import { ModelManager } from './Geometry/ModelManager.js';
import { GameManager } from './engine/GameManager.js';
import { Car } from './Animators/Car.js';
import { PeopleManager } from './Animators/PeopleManager.js';
import { Light } from './Geometry/Light.js';
import { SoundManager } from './engine/SoundManager.js';

class App extends Application {

    async start() {
        this.time = Date.now();
        this.startTime = this.time;
        this.delta = 0;
        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        // ==================== Loading Blender models =====================
        this.loader = new GLTFLoader();
        await this.loader.load('./assets/models/land/land.gltf');
        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = new PerspectiveCamera();
        this.scene.nodes[1] = this.camera;
        
        this.lights = [];
    
        this.modelManager = new ModelManager();
        await this.modelManager.loadAllModels();


        
        
        this.soundManager = new SoundManager();
        this.gameManager = new GameManager(this);

        
        Car.gameManager = this.gameManager;
        PeopleManager.gameManager = this.gameManager;
        

        //console.log(this.scene);

        this.physics = new Physics(this.scene);
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();

        // Game logic speed (when do updates occur)
        this.setNormalGameSpeed();
        this.setSunUpdateNormalSpeed();
    }

    setNormalGameSpeed(){
        this.normalSpeed = setInterval(this.gameManager.tick, 5000);
    }

    setFastForwardSpeed(){
        this.fastSpeed = setInterval(this.gameManager.tick, 2500);
    }

    setSunUpdateNormalSpeed(){
        this.sunSpeedFactor = 1;
    }

    setSunUpdateFastSpeed(){
        this.sunSpeedFactor = 2;
    }


    update() {
        this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
        this.delta += dt*1000;
        //console.log(dt, this.delta);
        if(this.gameManager){
            if (this.delta >= 100/this.sunSpeedFactor){
                this.gameManager.updateSun();
                this.delta = 0;
            }
        }
        


        if (this.camera) {
            this.camera.update(dt);
        }

        if (this.physics) {
            this.physics.update(dt);
        }

        

    }

    render() {
        if (this.renderer) {
            //console.log(this.lights.length);
            this.renderer.render(this.scene, this.camera, this.lights);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        const aspectRatio = w / h

        if (this.camera) {
            this.camera.aspect = aspectRatio;
            this.camera.updateProjection();
        }
    }

    enablecamera() {
        this.canvas.requestPointerLock();
        this.soundManager.playBackground();
    }

    pointerlockchangeHandler() {
        if (!this.camera) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.camera.enable();
        } else {
            this.camera.disable();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new GUI();
    gui.add(app, 'enablecamera');
});
