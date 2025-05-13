import './App.css'
import {OrbitControls, useTexture} from "@react-three/drei";
import * as THREE from 'three/webgpu'
import * as TSL from 'three/tsl'
import {TextureLoader} from 'three/webgpu'
import {vec4, Fn, mix, uniform, vec3, mul, cos, sin, positionLocal, cameraProjectionMatrix, sub, modelViewMatrix} from "three/src/Three.TSL.js";
import {SRGBColorSpace} from "three";
import {useRef} from "react";
import GUI from 'lil-gui'




export default function App() {
    const paper = useRef()
    const gui = new GUI()


    const props = useTexture({
        map: './Paper001_1K-JPG_Color.jpg',
        displacementMap: './Paper001_1K-JPG_Displacement.jpg',
        normalMap: './Paper001_1K-JPG_NormalGL.jpg',
        roughnessMap: './Paper001_1K-JPG_Roughness.jpg',
    })

    props.map.colorSpace = SRGBColorSpace

    const blue = Fn(() => {
        return vec4(236, 232, 223, 255);
    })

    const progress = uniform(0.0);
    gui.add( progress, 'value', 0, 1, 0.01 ).name( 'progress' );

    const vertex = Fn(([progress]) =>
    {
        const p = 3.14159265359;
        const tp = 6.28318530718;
        const radiusBase = 0.2; // Base radius for the roll
        const pos = positionLocal.toVar()
        const rolledPos = pos.toVar()
        const radius = mul(radiusBase, sub(1, pos.x ))
        rolledPos.x = mul(cos(mul(pos.x, tp)), radius);
        rolledPos.y = pos.y
        rolledPos.z = mul(sin(mul(pos.x, tp)), radius);
        const finalPos = mix(pos, rolledPos, progress)

        return cameraProjectionMatrix.mul( modelViewMatrix ).mul( vec4( finalPos, 1.0 ) );
    })

    return <>
        <OrbitControls/>
        <mesh ref={paper} position={[1,-1,4]}>
            <meshStandardNodeMaterial vertexNode={vertex(progress)}{...props} displacementScale={.1} side={THREE.DoubleSide}/>
            <planeGeometry args={[2, 2, 128, 128]}/>
        </mesh>
        <ambientLight intensity={1}/>
    </>
}