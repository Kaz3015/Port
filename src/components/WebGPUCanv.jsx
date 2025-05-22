import { Canvas, extend } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three/webgpu";
import { ResizeHandler } from "./ResizeHandler";

extend(THREE);

export function Canv({ quality, children }) {
  const rendererRef = useRef();
  const [frameloop, setFrameloop] = useState("never");
  return (
    <Canvas
      onCreated={(state) => {
        state.setSize(window.innerWidth, window.innerHeight);
      }}
      frameloop={frameloop}
      dpr={quality === "default" ? 1 : [1, 1.5]}
      camera={{
        position: [18.6, -0.6, 0],
        near: 0.1,
        far: 50,
        fov: 65,
        // zoom: 1,
      }}
      shadows={"variance"}
      gl={async (canvas) => {
        const renderer = new THREE.WebGPURenderer(
          canvas
        );

        // Initialize WebGPU and store renderer reference
        await renderer.init().then(() => setFrameloop("always"));
        rendererRef.current = renderer;
        return renderer;
      }}
    >
      {children}
      <ResizeHandler quality={quality} rendererRef={rendererRef} />
    </Canvas>
  );
}