import { GUI } from '../lib/dat.gui.module.js';

import { Application } from './engine/Application.js';
import { Renderer } from './engine/Renderer.js';
import { Physics } from './engine/Physics.js';
import { GLTFLoader } from './Geometry/GLTFLoader.js';
import { PerspectiveCamera } from './Geometry/PerspectiveCamera.js';
import { ModelManager } from './Geometry/ModelManager.js';
import { GameManager } from './engine/GameManager.js';
import { quat } from './lib/gl-matrix-module.js';
import { GUIController } from './GUIController.js';
import { Car } from './Animators/Car.js';

class App extends Application {

    async start() {
        this.time = Date.now();
        this.startTime = this.time;
        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        // ==================== Loading Blender models =====================
        this.loader = new GLTFLoader();
        await this.loader.load('./assets/models/land/land.gltf');
        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = new PerspectiveCamera();
        this.scene.nodes[1] = this.camera;
    
        this.modelManager = new ModelManager();
        await this.modelManager.loadAllModels();

        if (!this.scene) {
            throw new Error('Scene or camera.camera not present in glTF');
        }

        if (!this.camera) {
            throw new Error('camera node does not contain a camera reference');
        }
    
        
        /*
        let ico1 = this.modelManager.getModel("house1_red");
        ico1.translation = [-20,0,20];
        ico1.updateMatrix();
        
        let ico2 = this.modelManager.getModel("townhall");
        
        ico2.translation = [20, 0, 0];
        ico2.updateMatrix();
        
        let ico3 = this.modelManager.getModel("shop");
        ico3.translation = [20,0,20];
        //ico3.rotation = [Math.PI/2,0,0];
        //ico3.updateTransformMovement();
        ico3.updateMatrix();

        this.scene.addNode(ico1);
        this.scene.addNode(ico2);
        this.scene.addNode(ico3);


        let ico4 = this.modelManager.getModel("factory");
        ico4.translation = [0,0,20];
        ico4.updateMatrix();
        this.scene.addNode(ico4);

        let ico5 = this.modelManager.getModel("road");
        ico5.translation = [60,0,20];
        ico5.updateMatrix();
        this.scene.addNode(ico5);

        let ico12 = this.modelManager.getModel("road");
        ico12.translation = [80,0,40];
        ico12.rotation = [0, Math.PI/2, 0];
        ico12.updateTransformMovement();
        //ico12.updateMatrix();
        this.scene.addNode(ico12);

        let ico6 = this.modelManager.getModel("bend");
        ico6.translation = [40,0,20];
        ico6.updateMatrix();
        this.scene.addNode(ico6);

        let ico7 = this.modelManager.getModel("tcrossroad");
        ico7.translation = [80,0,20];
        ico7.updateMatrix();
        this.scene.addNode(ico7);
        
        let ico8 = this.modelManager.getModel("crossroad");
        ico8.translation = [40,0,40];
        ico8.updateMatrix();
        this.scene.addNode(ico8);        

        let ico9 = this.modelManager.getModel("car1_red");
        ico9.translation = [60,0,20];
        ico9.updateMatrix();
        this.scene.addNode(ico9);

        let ico10 = this.modelManager.getModel("car1_blue");
        ico10.translation = [-20,0,0];
        ico10.updateMatrix();
        ico10.rotation = [0, -Math.PI/2, 0];
        ico10.updateTransformMovement();
        this.scene.addNode(ico10);

        let ico11 = this.modelManager.getModel("car1_green");
        ico11.translation = [-12,0,0];
        ico11.updateMatrix();
        ico11.rotation = [0, Math.PI, 0];
        ico11.updateTransformMovement();
        this.scene.addNode(ico11);

        let ico13 = this.modelManager.getModel("car2_red");
        ico13.translation = [-4,0,0];
        ico13.updateMatrix();
        this.scene.addNode(ico13);

        let ico14 = this.modelManager.getModel("car2_blue");
        ico14.translation = [2,0,0];
        ico14.updateMatrix();
        this.scene.addNode(ico14);

        let ico15 = this.modelManager.getModel("car2_green");
        ico15.translation = [8,0,0];
        ico15.updateMatrix();
        this.scene.addNode(ico15);

        
        let ico17 = this.modelManager.getModel("wind_turbine_shaft");
        this.scene.addNode(ico17);

        let ico18 = this.modelManager.getModel("wind_turbine_blades");
        let blades18 = ico18.children[0];
        blades18.rotation = [0, 0, -Math.PI/2+2.5];
        blades18.updateTransformMovement();
        this.scene.addNode(ico18);

        let ico19 = this.modelManager.getModel("wind_turbine_shaft");
        ico19.translation = [-5, 0, -5];
        ico19.updateMatrix();
        this.scene.addNode(ico19);

        let ico20 = this.modelManager.getModel("wind_turbine_blades");
        ico20.translation = [-5, 0, -5];
        ico20.updateMatrix();
        let blades20 = ico20.children[0];
        blades20.rotation = [0, 0, Math.PI/3];
        blades20.updateTransformMovement();
        this.scene.addNode(ico20);
        

        let ico21 = this.modelManager.getModel("person1");
        ico21.translation = [22,1,27];
        ico21.updateMatrix();
        this.scene.addNode(ico21);

        let ico22 = this.modelManager.getModel("person2");
        ico22.translation = [23,1,24];
        ico22.updateMatrix();
        ico22.rotation = [0, Math.PI/2, 0];
        ico22.updateTransformMovement();
        this.scene.addNode(ico22);
        
        let ico23 = this.modelManager.getModel("person3");
        ico23.translation = [22,1,25];
        ico23.updateMatrix();
        ico23.rotation = [0, Math.PI/3, 0];
        ico23.updateTransformMovement();
        this.scene.addNode(ico23);
        
        let ico24 = this.modelManager.getModel("person4");
        ico24.translation = [25,1,22];
        ico24.updateMatrix();
        ico24.rotation = [0, -Math.PI/3, 0];
        ico24.updateTransformMovement();
        this.scene.addNode(ico24);
        
        let ico25 = this.modelManager.getModel("house1_blue");
        ico25.translation = [-40, 0, 20];
        ico25.updateMatrix();
        this.scene.addNode(ico25);

        let ico26 = this.modelManager.getModel("house1_orange");
        ico26.translation = [-60, 0, 20];
        ico26.updateMatrix();
        this.scene.addNode(ico26);

        let ico27 = this.modelManager.getModel("house1_grey");
        ico27.translation = [-80, 0, 20];
        ico27.updateMatrix();
        this.scene.addNode(ico27);

        let ico28 = this.modelManager.getModel("house1_blueyellow");
        ico28.translation = [-100, 0, 20];
        ico28.updateMatrix();
        this.scene.addNode(ico28);

        let ico29 = this.modelManager.getModel("person5");
        ico29.translation = [25,1,26];
        ico29.updateMatrix();
        ico29.rotation = [0, -Math.PI/6, 0];
        ico29.updateTransformMovement();
        this.scene.addNode(ico29);

        let ico30 = this.modelManager.getModel("tree");
        ico30.translation = [-20, 0, -10];
        ico30.updateMatrix();
        this.scene.addNode(ico30);

        let ico31 = this.modelManager.getModel("tree");
        ico31.translation = [-25, 0, -12];
        ico31.updateMatrix();
        this.scene.addNode(ico31);

        */
        /*
        let ico12 = this.modelManager.getModel("road");
        ico12.translation = [145, 0, 145];
        ico12.scale = [0.5, 0.5, 0.5];
        ico12.updateTransformMovement();
        //ico12.updateMatrix();
        this.scene.addNode(ico12);
        */

        let ico9 = this.modelManager.getModel("car1_red");
        ico9.scale = [0.5, 0.5, 0.5];





        
        ico9.updateMatrix();
        this.scene.addNode(ico9);


        this.gameManager = new GameManager(this);
        Car.gameManager = this.gameManager;

        console.log(this.scene);

        this.physics = new Physics(this.scene);
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();


    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;

        if (this.camera) {
            this.camera.update(dt);
        }

        if (this.physics) {
            this.physics.update(dt);
        }

    }

    render() {
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
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
