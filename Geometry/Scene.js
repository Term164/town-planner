import { Node } from './Node.js';

export class Scene {

    constructor(options = {}) {
        this.nodes = [...(options.nodes || [])];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    traverse(before, after) {
        for (const node of this.nodes) {
            this.traverseNode(node, before, after);
        }
    }

    deleteNode(value){
        for (const node of this.nodes){
            if (node === value){
                this.removeValue(value);
                break;
            } 
        }
    }

    removeValue(value){
        this.nodes = this.nodes.filter(function(ele){
            return ele != value;
        });
    }

    traverseNode(node, before, after) {
        if (before) {
            before(node);
        }
        for (const child of node.children) {
            this.traverseNode(child, before, after);
        }
        if (after) {
            after(node);
        }
    }

    clone() {
        return new Scene({
            ...this,
            nodes: this.nodes.map(node => node.clone()),
        });
    }
}
