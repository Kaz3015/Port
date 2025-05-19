import './App.css'
import {OrbitControls, Text, useTexture} from "@react-three/drei";
import * as THREE from 'three/webgpu'
import * as TSL from 'three/tsl'
import {TextureLoader} from 'three/webgpu'
import {
    vec4,
    Fn,
    mix,
    uniform,
    vec3,
    mul,
    cos,
    sin,
    positionLocal,
    cameraProjectionMatrix,
    sub,
    modelViewMatrix,
    texture, uv
} from "three/src/Three.TSL";
import {SRGBColorSpace} from "three";
import {useRef} from "react";
import GUI from 'lil-gui'
import {useLoader} from "@react-three/fiber";
import ZeusThunderbolt from "./components/Zeus Thunderbolt.jsx";




export default function App() {
    const paper = useRef()
    const gui = new GUI()


    const props = useTexture({

        bumpMap: './Tablet.png',
        alphaMap: './Tablet.png',
    })

    const tabletProps = useTexture({
        normalMap: './textures/Tablet/rock_boulder_dry_nor_gl_1k.jpg',
        roughnessMap: './textures/Tablet/rock_boulder_dry_arm_1k.jpg',
        aoMap: './textures/Tablet/rock_boulder_dry_arm_1k.jpg',
        map: './textures/Tablet/rock_boulder_dry_diff_1k.jpg',

    })

    const textureLoder = new TextureLoader()
    const aboutMeTexture = textureLoder.load('./Tablet.png')
    console.log(aboutMeTexture)

    // props.map.colorSpace = SRGBColorSpace
    // props.bumpMap.repeat = new THREE.Vector2(1, 1)



    const blue = Fn(() => {
        return vec4(0.0, 0.0, 1.0, 1.0);
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
    });

    const wordPlane = Fn(( ) => {
        const final = texture(aboutMeTexture, uv())
        return vec4(0, 0,255, final.r);
        });


    const darkgray = new THREE.Color(0x3b3b3b)
    return <>
        <OrbitControls/>
        {/*<mesh ref={paper} position={[1,-1,4]}>*/}
        {/*    <meshStandardNodeMaterial {...tabletProps} color={darkgray}/>*/}
        {/*    <boxGeometry args={[1.5, 7, 5]}/>*/}
        {/*</mesh>*/}
        {/*<mesh>*/}
        {/*    <meshStandardNodeMaterial colorNode={wordPlane()} transparent side={THREE.DoubleSide}/>*/}
        {/*    <planeGeometry args={[5, 7]}/>*/}
        {/*</mesh>*/}
        <ZeusThunderbolt/>




        <ambientLight intensity={2}/>
        {/*<directionalLight intensity={10} position={[1, -1, 2]}/>*/}
    </>
}