import { vec2, dot, sin, fract, Fn, floor, mul, sub, float, mix, int, pow } from 'three/tsl';

export const randomValue = /*#__PURE__*/ Fn( ( [ uv_coord_immutable ] ) => {

	const uv_coord = vec2( uv_coord_immutable ).toVar();

	return fract( sin( dot( uv_coord, vec2( 12.9898, 78.233 ) ) ).mul( 43758.5453 ) );

} ).setLayout( {
	name: 'randomValue',
	type: 'float',
	inputs: [
		{ name: 'uv_coord', type: 'vec2' }
	]
} );

export const valueNoise = /*#__PURE__*/ Fn( ( [ uv_coord_immutable ] ) => {

	const uv_coord = vec2( uv_coord_immutable ).toVar();
	const i = vec2( floor( uv_coord ) ).toVar();
	const f = vec2( fract( uv_coord ) ).toVar();
	const f_smooth = vec2( f.mul( f ).mul( sub( 3.0, mul( 2.0, f ) ) ) ).toVar();
	const c0 = vec2( i.add( vec2( 0.0, 0.0 ) ) ).toVar();
	const c1 = vec2( i.add( vec2( 1.0, 0.0 ) ) ).toVar();
	const c2 = vec2( i.add( vec2( 0.0, 1.0 ) ) ).toVar();
	const c3 = vec2( i.add( vec2( 1.0, 1.0 ) ) ).toVar();
	const r0 = float( randomValue( c0 ) ).toVar();
	const r1 = float( randomValue( c1 ) ).toVar();
	const r2 = float( randomValue( c2 ) ).toVar();
	const r3 = float( randomValue( c3 ) ).toVar();
	const bottomOfGrid = float( mix( r0, r1, f_smooth.x ) ).toVar();
	const topOfGrid = float( mix( r2, r3, f_smooth.x ) ).toVar();
	const noise = float( mix( bottomOfGrid, topOfGrid, f_smooth.y ) ).toVar();

	return noise;

} ).setLayout( {
	name: 'valueNoise',
	type: 'float',
	inputs: [
		{ name: 'uv_coord', type: 'vec2' }
	]
} );

export const simpleNoise = /*#__PURE__*/ Fn( ( [ UV_immutable, Scale_immutable ] ) => {

	const Scale = float( Scale_immutable ).toVar();
	const UV = vec2( UV_immutable ).toVar();
	const t = float( 0.0 ).toVar();
	const freq = float().toVar();
	const amp = float().toVar();
	const NUM_OCTAVES = int( int( 3 ) );
	freq.assign( pow( 2.0, 0.0 ) );
	amp.assign( pow( 0.5, float( NUM_OCTAVES.sub( int( 0 ) ) ) ) );
	t.addAssign( valueNoise( UV.mul( Scale ).div( freq ) ).mul( amp ) );
	freq.assign( pow( 2.0, 1.0 ) );
	amp.assign( pow( 0.5, float( NUM_OCTAVES.sub( int( 1 ) ) ) ) );
	t.addAssign( valueNoise( UV.mul( Scale ).div( freq ) ).mul( amp ) );
	freq.assign( pow( 2.0, 2.0 ) );
	amp.assign( pow( 0.5, float( NUM_OCTAVES.sub( int( 2 ) ) ) ) );
	t.addAssign( valueNoise( UV.mul( Scale ).div( freq ) ).mul( amp ) );

	return t;

} ).setLayout( {
	name: 'simpleNoise',
	type: 'float',
	inputs: [
		{ name: 'UV', type: 'vec2' },
		{ name: 'Scale', type: 'float' }
	]
} );