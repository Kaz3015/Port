import * as THREE from 'three/webgpu'
import {Fn, uniform, output, min, saturate, fwidth, step, vec2, uv, abs, texture, smoothstep, sub, float, pass, mrt, length, clamp,mul, If,  positionLocal, mix, vec4, normalize, remap, normalView, vec3, time, positionWorld} from "three/tsl";
import GUI from "lil-gui";
import {useTexture} from '@react-three/drei'
import {curlNoise3d} from "./curlNoise3d.js";
import {simpleNoise} from "./simpleNoise.js";


export default function Lightning (props) {
    const noiseTexture = useTexture('./textures/Lightning/noiseTexture.png')
    const LightningTexture = useTexture('./textures/Lightning/LightningMap.jpg')
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping






    const cN = Fn(() => {
        const vuv = uv().toVar()
        const offset = vec2(time).mul(vec2(.8, .5))
        vuv.assign(vuv.add(offset))

        const noise = simpleNoise(vuv, 25)
        const noiseColor = mix(uv(), vec2(noise), vec2(.2))
        const lightning = step(.5, uv().x).mul(step(uv().x, .6))
        const d = abs(sub(noiseColor.mul(2), 1)).sub(vec2(.1, 2))
        d.assign(sub(1, d.div(fwidth(d))))
        const rectangle = saturate(min(d.x, d.y))




        return (
            vec4(rectangle.mul(vec3(0, .2, .8)))
        )

    })

    const mat = new THREE.MeshBasicNodeMaterial()
    mat.colorNode = cN()
    mat.transparent = true
    mat.mrtNode = mrt( {
					bloomIntensity: uniform( 1 )
				} );

    return (
        <mesh material={mat}>
            <planeGeometry/>
        </mesh>
    )
}