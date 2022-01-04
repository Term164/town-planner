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

        
        const light1 = new Light();
        //light1.translation = [0,5,0];

        const light2 = new Light();
        //light2.translation = [0,5,0];        
        const light3 = new Light();
        //light3.translation = [-5,5,-5];
        const light4 = new Light();
        //light4.translation = [5,5,-5];

        this.lights = [light1, light2, light3, light4];

    
        this.modelManager = new ModelManager();
        await this.modelManager.loadAllModels();

        if (!this.scene) {
            throw new Error('Scene or camera.camera not present in glTF');
        }

        if (!this.camera) {
            throw new Error('camera node does not contain a camera reference');
        }

        let ico9 = this.modelManager.getModel("car1_red");
        this.scene.addNode(ico9);

        let ico21 = this.modelManager.getModel("person1");
        this.scene.addNode(ico21);


        this.gameManager = new GameManager(this);
        Car.gameManager = this.gameManager;
        PeopleManager.gameManager = this.gameManager;

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
