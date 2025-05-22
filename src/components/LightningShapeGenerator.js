import LightningBranch from './LightningBranch';
import * as THREE from 'three/webgpu';
import LightningPoint from './LightningPoint';


class LightningShapeGenerator {
    constructor(maxGenerationCount, maxMiddleDisplacement, randomSeed) {
        this.maxGenerationCount = maxGenerationCount;
        this.maxMiddleDisplacement = maxMiddleDisplacement;
        this.randomSeed = randomSeed
        this.displacementDecreaseMultiplierByGeneration = 0.5;

    }

    createLightningShape(origin, target, object) {
        const localOrigin = object.worldToLocal(origin);
        const localTarget = object.worldToLocal(target);
        const initialBranch = this.createInitialBranch(localOrigin, localTarget);
        const branches = [];
        for(let i = 0; i < branches.length; i++) {

        }


    }



    createInitialBranch(origin, target) {
        const points = [];
        const forwardAxis = origin.sub(target).normalize();
        const {rightAxis, upAxis} = this.createOrthogonalAxes(forwardAxis);
        const initialPoint = new LightningPoint(origin, forwardAxis, rightAxis, upAxis, true);
        const impactPoint = new LightningPoint(target, forwardAxis, rightAxis, upAxis, true);
        points.push(initialPoint);
        points.push(impactPoint);

        const branch = new LightningBranch(points, 1, 1, 0, 0);
        return branch;


    }

    createOrthogonalAxes(forwardAxis) {
        let rightAxis;
        if (Math.abs(new THREE.Vector3().subVectors(forwardAxis, new THREE.Vector3(0, 1, 0)).length()) < 0.01) {
            rightAxis = new THREE.Vector3(1, 0, 0);
        } else {
            rightAxis = THREE.Vector3().crossVectors(forwardAxis, new THREE.Vector3(0, 1, 0)).normalize();
        }
        const upAxis = new THREE.Vector3().crossVectors(forwardAxis, rightAxis).normalize();
        return {rightAxis, upAxis };
    }

    GenerateLightningShape(lightningBranch, branches) {
        let initialGeneration = lightningBranch.creationGeneration + 1;

        for(let currentGeneration = initialGeneration; currentGeneration <= this.maxGenerationCount; currentGeneration++) {
            let generationMaxPossibleOffset = this.maxMiddleDisplacement * Math.pow(this.displacementDecreaseMultiplierByGeneration, currentGeneration - 1);
            let points = lightningBranch.listOfPoints;

            for(let pointIndex = 0; pointIndex < (points.length - 1); pointIndex++) {
                let currentPoint = points[pointIndex];
                let nextPoint = points[pointIndex + 1];
                let midPoint = new THREE.Vector3().lerpVectors(currentPoint.position, nextPoint.position, 0.5);

                let pointFowardAxis = currentPoint.fowardAxis;
                let pointRightAxis = currentPoint.rightAxis;
                let pointUpAxis = currentPoint.upAxis;

                let newMidPoint = new LightningPoint(midPoint, currentPoint.fowardAxis, currentPoint.rightAxis, currentPoint.upAxis, true);

                let randomRightOffset = Math.lerp(-generationMaxPossibleOffset, generationMaxPossibleOffset, Math.random());
                let randomUpOffset = Math.lerp(-generationMaxPossibleOffset, generationMaxPossibleOffset, Math.random());
                let rightAxisOffset = randomRightOffset * pointRightAxis;
                let upAxisOffset = randomUpOffset * pointUpAxis;

                midPoint += rightAxisOffset + upAxisOffset;
                newMidPoint.position = midPoint;

                pointFowardAxis = new THREE.Vector3().subVectors(nextPoint.position, currentPoint.position).normalize();
                pointRightAxis, pointUpAxis = this.createOrthogonalAxes(pointFowardAxis);
                currentPoint.fowardAxis = pointFowardAxis;
                currentPoint.rightAxis = pointRightAxis;
                currentPoint.upAxis = pointUpAxis;

                pointFowardAxis = new THREE.Vector3().subVectors(nextPoint.position, midPoint).normalize();
                pointRightAxis, pointUpAxis = this.createOrthogonalAxes(pointFowardAxis);
                newMidPoint.fowardAxis = pointFowardAxis;
                newMidPoint.rightAxis = pointRightAxis;
                newMidPoint.upAxis = pointUpAxis;


                points.splice(pointIndex + 1, 0, newMidPoint);
                pointIndex++;

            }

        }
    }
}