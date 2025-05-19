import * as THREE from 'three/webgpu'
import {Fn, uniform, length, clamp, positionLocal, mix, vec4, normalize, normalView, vec3, time, positionWorld} from "three/tsl";
import {postprocessing} from "three/tsl/postprocessing";
import React, {useRef} from 'react'
import {useGLTF} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import {outline} from "three/examples/jsm/tsl/display/OutlineNode.js";




export default function ZeusThunderbolt(props) {
    const selectedObjects = useRef([])
    const {nodes, materials} = useGLTF('./Models/zeus_thunderbolt.glb')
    selectedObjects.current = [nodes.pCube1_lambert1_0]
    const {gl, camera, scene} = useThree()
    const innerColor = uniform(new THREE.Color(0xFFFFFF))
    const outerColor = uniform(new THREE.Color(0x90D5FF))

    const edgeStrength = uniform( 3.0 );
    const edgeGlow = uniform( 0.0 );
    const edgeThickness = uniform( 1.0 );
    const pulsePeriod = uniform( 0 );
    const visibleEdgeColor = uniform( new THREE.Color( 0xffffff ) );

    const postProcessing = new THREE.PostProcessing( gl )
    const outlinePass = outline( scene, camera, {
					selectedObjects,
					edgeGlow,
					edgeThickness
				} );
    const color = Fn(() => {


        const fresnel = normalView.dot(vec3(0, 1, 0)).abs().oneMinus().pow(5)
        const falloff = fresnel.smoothstep(0.8, 0.2)
        const alpha = fresnel.add(fresnel.mul(1.25)).mul(falloff)
        const finalColor = mix(innerColor, outerColor, fresnel.mul(2))

    return vec4(finalColor, alpha)

    })
    const mat = new THREE.MeshBasicNodeMaterial()
    mat.colorNode = color()


    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.pCube1_lambert1_0.geometry}
                material={mat}
                scale={.1}
                rotation={[Math.PI / 2, 0, 0]}
            />
        </group>
    )
}

useGLTF.preload('./Models/zeus_thunderbolt  .glb')