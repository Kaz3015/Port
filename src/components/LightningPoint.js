import * as THREE from 'three/webgpu'
export default class LightningPoint {
    constructor(position, fowardAxis, rightAxis, upAxis, nextGeneration ) {
        this.position = position; // THREE.Vector3
        this.fowardAxis = fowardAxis; // THREE.Vector3
        this.rightAxis = rightAxis; // THREE.Vector3
        this.upAxis = upAxis; // THREE.Vector3
        this.nextGeneration = nextGeneration; // boolean

    }

}