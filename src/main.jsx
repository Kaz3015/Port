import ReactDOM from 'react-dom/client'
import * as THREE from 'three/webgpu'
import {Canvas, extend} from '@react-three/fiber'
import Experience from './App.jsx'
import { useRef, useState } from "react";
import {Canv} from "./components/WebGPUCanv.jsx";

const root = ReactDOM.createRoot(document.querySelector('#root'))
    extend(THREE)



root.render(
    <Canv quality={"default"}>
        <Experience/>
    </Canv>

)