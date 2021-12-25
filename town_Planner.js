import { GUI } from '../lib/dat.gui.module.js';

import { Application } from './engine/Application.js';
import { Renderer } from './engine/Renderer.js';
import { Physics } from './engine/Physics.js';
import { GLTFLoader } from './Geometry/GLTFLoader.js';
import { PerspectiveCamera } from './Geometry/PerspectiveCamera.js';
import { ModelManager } from './Geometry/ModelManager.js';
import { quat } from './lib/gl-matrix-module.js';

class App extends Application {

    async start() {
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;
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
    

        
        
       
        let ico1 = this.modelManager.getModel("house");
        ico1.translation = -[20,0,0];
        ico1.updateMatrix();
        
        let ico2 = this.modelManager.getModel("townhall");
        
        ico2.translation = [20, 0, 0];
        ico2.updateMatrix();
        
        let ico3 = this.modelManager.getModel("shop");
        ico3.translation = [20,0,20];
        //ico3.rotation = [Math.PI/2,0,0];
        //ico3.updateTransformMovement();
        ico3.updateMatrix();

        let ico4 = this.modelManager.getModel("factory");
        ico4.translation = [0,0,20];
        ico4.updateMatrix();
        this.scene.addNode(ico4);

        let ico5 = this.modelManager.getModel("road");
        ico5.translation = [60,0,20];
        ico5.updateMatrix();
        this.scene.addNode(ico5);

        let ico12 = this.modelManager.getModel("road");
        ico12.translation = [60,0,40];
        ico12.updateMatrix();
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
        ico10.translation = [-5,0,0];
        ico10.updateMatrix();
        this.scene.addNode(ico10);

        let ico11 = this.modelManager.getModel("car1_green");
        ico11.translation = [-10,0,0];
        ico11.updateMatrix();
        this.scene.addNode(ico11);

        this.scene.addNode(ico1);
        this.scene.addNode(ico2);
        this.scene.addNode(ico3);
        
        
        
        
     
       
    
      



        console.log(this.scene);

        this.physics = new Physics(this.scene);

        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();
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

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new GUI();
    gui.add(app, 'enablecamera');
});
