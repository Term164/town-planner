import { GLTFLoader } from "./GLTFLoader.js";

export class ModelManager{
    constructor(){
        this.model_list = './assets/models/modelList.json';
        this.models = new Map();
        this.loader = new GLTFLoader();
    }

    fetchJson(url) {
        return fetch(url).then(response => response.json());
    }

    async loadAllModels(){
        const modelData = (await this.fetchJson(this.model_list)).models;
        for (let model of modelData){
            await this.loader.load(model.location);
            this.models.set(model.name, await this.loader.loadNode(model.name));
        }
        //console.log(this.models);
    }

    getModel(modelName){
        if(this.models.has(modelName)){
            return this.models.get(modelName).clone();
        }else{
            throw new Error('No model with this name exists');
        }
    }


}