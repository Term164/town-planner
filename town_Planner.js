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

        // Create a sun and some throwaway lights (probably should be replaced with townhall lights)
        const sun = new Light();
        const light2 = new Light();
        const light3 = new Light();
        const light4 = new Light();

        sun.translation = [150,100,150];
        /*
        sun.ambientColor = [200, 200, 200]
        sun.diffuseColor = [240, 240, 240]
        sun.specularColor = [255, 255, 255]
        */

        sun.ambientColor = [50, 50, 50]
        sun.diffuseColor = [50, 50, 50]
        sun.specularColor = [50, 50, 50]
        sun.attenuatuion = [1.0,0.0001,0.00005];
        this.lights = [sun, light2, light3, light4];

    
        this.modelManager = new ModelManager();
        await this.modelManager.loadAllModels();


        this.gameManager = new GameManager(this);
        Car.gameManager = this.gameManager;
        PeopleManager.gameManager = this.gameManager;

        console.log(this.scene);

        this.physics = new Physics(this.scene);
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();

        // Game logic speed (when do updates occur)
        this.setNormalGameSpeed();
    }

    setNormalGameSpeed(){
        this.normalSpeed = setInterval(this.gameManager.tick, 5000);
    }

    setFastForwardSpeed(){
        this.fastSpeed = setInterval(this.gameManager.tick, 2500);
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
