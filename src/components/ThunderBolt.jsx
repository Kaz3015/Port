import * as THREE from 'three/webgpu';
import CustomLine from './CustomLine.jsx';


export default function ThunderBolt() {
    const positions = [];
				const colors = [];
				const points = [];
				for ( let i = - 50; i < 50; i ++ ) {

					const t = i / 3;
					points.push( new THREE.Vector3( t * Math.sin( 2 * t ), t, t * Math.cos( 2 * t ) ) );

				}

				const spline = new THREE.CatmullRomCurve3( points );
				const divisions = Math.round( 3 * points.length );
				const point = new THREE.Vector3();
				const color = new THREE.Color();

				for ( let i = 0, l = divisions; i < l; i ++ ) {

					const t = i / l;

					spline.getPoint( t, point );
					positions.push( point.x, point.y, point.z );

					color.setHSL( t, 1.0, 0.5, THREE.SRGBColorSpace );
					colors.push( color.r, color.g, color.b );

				}

                return <>
                    <CustomLine points={positions} />
                </>




}