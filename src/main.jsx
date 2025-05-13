import ReactDOM from 'react-dom/client'
import * as THREE from 'three/webgpu'
import {Canvas, extend} from '@react-three/fiber'
import Experience from './App.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))
    extend(THREE)

root.render(
    <Canvas
        camera={ { fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] } }
        gl={async (props) => {
      const renderer = new THREE.WebGPURenderer(props)
      await renderer.init()
      return renderer
    }}
    >
        <Experience />
    </Canvas>
)