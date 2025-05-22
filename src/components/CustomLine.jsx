import * as React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three/webgpu'; // For THREE.Color, THREE.Vector3 etc.
import { Line2 } from 'three/examples/jsm/lines/webgpu/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

// Make sure these are available to R3F, if not already extended elsewhere
// import { extend } from '@react-three/fiber'
// extend({ Line2, LineMaterial, LineGeometry }) // Often not needed if drei is also in project as it might extend them

const CustomLine = React.forwardRef(function CustomLine({
  points,                                 // Array of points: THREE.Vector3[] or number[][] or Float32Array
  color = 0xffffff,                       // Default color: white
  vertexColors,                           // Optional: (THREE.Color | string | number)[] or Float32Array
  lineWidth = 1,                          // Default line width
  dashed = false,
  dashScale = 1,
  dashSize = 1,                           // Corresponds to LineMaterial's dashSize property
  gapSize = 1,                            // Corresponds to LineMaterial's gapSize property
  opacity = 1,
  transparent = false,
  alphaToCoverage = false,
  worldUnits = false,                     // Corresponds to LineMaterial's worldUnits property (for linewidth)
  ...rest                                 // Other props to pass to the primitive
}, ref) {

  const { size, camera } = useThree(); // size for material resolution

  // Create the LineMaterial instance
  const material = React.useMemo(() => new THREE.Line2NodeMaterial(), []);

  // Create the LineGeometry instance
  const geometry = React.useMemo(() => new LineGeometry(), []);

  // Create the Line2 object which uses the geometry and material
  // This object will be rendered by the <primitive />
  const line = React.useMemo(() => {
    const lineObj = new Line2(geometry, material);
    console.log(lineObj);
    // Initial computation of line distances is important for various effects like dashed lines

    return lineObj;
  }, [geometry, material]);

  // Update geometry when points or vertexColors change
  React.useLayoutEffect(() => {
    if (!points || points.length === 0) {
      geometry.setPositions(new Float32Array([0,0,0,0,0,0])); // Empty or minimal line
    } else {
      const flatPoints = points.map(p => {
        if (p instanceof THREE.Vector3) return [p.x, p.y, p.z];
        if (Array.isArray(p)) return [p[0] || 0, p[1] || 0, p[2] || 0];
        return p; // Assuming it's already a flat array component if not Vector3 or array
      }).flat();
      geometry.setPositions(flatPoints);
    }

    if (vertexColors && vertexColors.length > 0) {
      const flatColors = vertexColors.map(c => {
        if (c instanceof THREE.Color) return [c.r, c.g, c.b];
        if (typeof c === 'number') { // Hex number
          const tempColor = new THREE.Color(c);
          return [tempColor.r, tempColor.g, tempColor.b];
        }
        if (typeof c === 'string') { // CSS string
           const tempColor = new THREE.Color(c);
          return [tempColor.r, tempColor.g, tempColor.b];
        }
        if (Array.isArray(c)) return [c[0] || 0, c[1] || 0, c[2] || 0]; // Assuming [r,g,b]
        return c;
      }).flat();
      geometry.setColors(flatColors);
      material.vertexColors = true;
    } else {
      material.vertexColors = false;
    }

    // After updating geometry, re-compute line distances
    line.computeLineDistances();

    // Notify renderer that geometry attributes need an update
    geometry.attributes.position && (geometry.attributes.position.needsUpdate = true);
    geometry.attributes.instanceColor && (geometry.attributes.instanceColor.needsUpdate = true); // If using setColors

  }, [points, vertexColors, geometry, material, line]);

  // Update material properties
  React.useLayoutEffect(() => {
    material.color = new THREE.Color(color); // Ensure color is a THREE.Color instance
    material.linewidth = lineWidth; // Note: LineMaterial uses 'linewidth' (all lowercase)
    material.dashed = dashed;
    material.dashScale = dashScale;
    material.dashSize = dashSize;
    material.gapSize = gapSize;
    material.opacity = opacity;
    material.transparent = transparent;
    material.alphaToCoverage = alphaToCoverage;
    material.worldUnits = worldUnits; // if true, linewidth is in world units, otherwise in screen space pixels

    // Resolution is crucial for LineMaterial to work correctly
    console.log('Size:', size);
    console.log("Resolution:", material.resolution);

    material.needsUpdate = true;
  }, [
    color, lineWidth, dashed, dashScale, dashSize, gapSize,
    opacity, transparent, alphaToCoverage, worldUnits,
    size, material
  ]);

  // Dispose of geometry and material on unmount
  React.useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      // line object itself doesn't have a dispose, its geometry and material are handled
    };
  }, [geometry, material]);

  // The <primitive /> tag renders an existing Three.js object
  return <primitive object={line} ref={ref} {...rest} />;
});

export default CustomLine;