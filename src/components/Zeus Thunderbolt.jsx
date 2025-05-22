import * as THREE from 'three/webgpu'
import {Fn, uniform, output, min, saturate, fwidth, step, vec2, uv, abs, texture, smoothstep, sub, float, pass, mrt, length, clamp,mul, If,  positionLocal, mix, vec4, normalize, remap, normalView, vec3, time, positionWorld} from "three/tsl";
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

import React, {useRef} from 'react'
import {useGLTF} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import GUI from "lil-gui";

import Lightning from './Lightning.jsx'
import {simpleNoise} from "./simpleNoise.js";
import ThunderBolt from "./ThunderBolt.jsx";





export default function ZeusThunderbolt(props) {
    const selectedObjects = useRef([])
    const {nodes, materials} = useGLTF('./Models/zeus_thunderbolt.glb')
    selectedObjects.current = [nodes.pCube1_lambert1_0]
    console.log(nodes.pCube1_lambert1_0.geometry)
    const {gl, camera, scene} = useThree()
    const innerColor = uniform(new THREE.Color(0xFFFFFF))
    const outerColor = uniform(new THREE.Color(0x0088ff))
    const maxHeight = uniform(nodes.pCube1_lambert1_0.geometry.boundingBox.max.x + 1)
    const progress = uniform(0)
    const edge = uniform(0.05)
    const gui = new GUI()
    const progressGUI = gui.add(progress, 'value', 0, 1).name('Progress')
    const innercolorGUI = gui.addColor(innerColor, 'value').name('Inner Color')
    const outercolorGUI = gui.addColor(outerColor, 'value').name('Outer Color')



    const cN = Fn(() => {
        const vuv = uv().toVar()
        const offset = vec2(time).mul(vec2(.8, .5))
        vuv.assign(vuv.add(offset))

        const noise = simpleNoise(vuv, 25)
        const noiseColor = mix(uv(), vec2(noise), vec2(.2))
        const d = abs(sub(noiseColor.mul(2), 1)).sub(vec2(.1, 2))
        d.assign(sub(1, d.div(fwidth(d))))
        const rectangle = saturate(min(d.x, d.y))

        return (
            vec4(rectangle.mul(vec3(0, .2, .8)))
        )

    })

    const color = Fn(() => {
        const height = remap(positionLocal.x, mul(-1, maxHeight), maxHeight, 0, 1).toVar()

        const fresnel = normalView.dot(vec3(0, 1, 0)).abs().oneMinus().pow(5)
        const falloff = fresnel.smoothstep(0.8, 0.2)
        const alpha = fresnel.add(fresnel.mul(1.25)).mul(falloff)
        const finalColor = mix(innerColor, outerColor, fresnel.mul(2))

        const edgeWidth = edge.add(progress).toVar()
        height.lessThan(progress).discard()
        const col = vec4(finalColor, alpha).toVar();
        const edgeColor = mix(vec4(outerColor, .3), vec4(1, 1, 1, 1), edgeWidth)
        const maxProg = 0.0


        If(height.greaterThan(progress).and(height.lessThan(edgeWidth)), () => {
            col.assign(edgeColor)
        })

        const dist = length(positionLocal)

        const whiteIntensity = smoothstep(6, maxHeight, dist)
        col.rgb = mix(col.rgb, vec3(1, 1, 1), whiteIntensity)




        return col

    })
    const mat = new THREE.MeshBasicNodeMaterial()
    mat.colorNode = color()
    mat.transparent = true
    mat.mrtNode = mrt( {
					bloomIntensity: uniform( 0 )
				} );


    //Post processing
    const scenePass = pass( scene, camera );
			scenePass.setMRT( mrt( {
				output,
				bloomIntensity: float( 0 ) // default bloom intensity
			} ) );

				const outputPass = scenePass.getTextureNode();
				const bloomIntensityPass = scenePass.getTextureNode( 'bloomIntensity' );

				const bloomPass = bloom( outputPass.mul(bloomIntensityPass) );

				const postProcessing = new THREE.PostProcessing( gl );
				postProcessing.outputNode = outputPass.add( bloomPass );

                useFrame(() => {
                    postProcessing.render()
                },1)

    const bloomFolder = gui.addFolder( 'bloom' );
			bloomFolder.add( bloomPass.threshold, 'value', 0.0, 1.0 ).name( 'threshold' );
			bloomFolder.add( bloomPass.strength, 'value', 0.0, 3 ).name( 'strength' );
			bloomFolder.add( bloomPass.radius, 'value', 0.0, 1.0 ).name( 'radius' );


    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.pCube1_lambert1_0.geometry}
                material={mat}
                scale={.1}
                rotation={[Math.PI / 2, 0, 0]}
            />
            <ThunderBolt />
        </group>
    )
}

useGLTF.preload('./Models/zeus_thunderbolt  .glb')