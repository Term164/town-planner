import { GUI } from '../lib/dat.gui.module.js';

import { Application } from './engine/Application.js';
import { Renderer } from './engine/Renderer.js';
import { Physics } from './engine/Physics.js';
import { GLTFLoader } from './Geometry/GLTFLoader.js';
import { PerspectiveCamera } from './Geometry/PerspectiveCamera.js';

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


        if (!this.scene) {
            throw new Error('Scene or camera.camera not present in glTF');
        }

        if (!this.camera) {
            throw new Error('camera node does not contain a camera reference');
        }
    

        await this.loader.load('./assets/models/testCircle/krog.gltf');
        this.sphere = await this.loader.loadNode('Icosphere');
        this.scene.addNode(this.sphere);

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
