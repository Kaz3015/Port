import * as THREE from 'three/webgpu';
export default class LightningBranch {
    constructor(listOfPoints, widthPercent, emissionPercent, creationGeneration, spawnPointIndex) {
        this.listOfPoints = listOfPoints; // Array of LightningPoint
        this.widthPercent = widthPercent; // float
        this.emissionPercent = emissionPercent; // float
        this.creationGeneration = creationGeneration; // int
        this.spawnPointIndex = spawnPointIndex; // THREE.Vector3
    }
}