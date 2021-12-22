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
        ico1.translation = [0,0,0];
        ico1.updateMatrix();
        
        let ico2 = this.modelManager.getModel("townhall");
        ico2.scale = [0.5, 0.1, 0.5];
        ico2.translation = [20, 10, 0];
        ico2.updateMatrix();
        
        let ico3 = this.modelManager.getModel("shop");
        ico3.translation = [20,10,20];
        //ico3.rotation = [Math.PI/2,0,0];
        //ico3.updateTransformMovement();
        ico3.updateMatrix();
        let ico4 = this.modelManager.getModel("factory");
        ico4.translation = [-10,8,-20];
        ico4.updateMatrix();

        this.scene.addNode(ico1);
        this.scene.addNode(ico2);
        this.scene.addNode(ico3);
        this.scene.addNode(ico4);

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
