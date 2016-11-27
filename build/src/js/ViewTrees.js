// ViewTrees.js

import alfrid, { GL, GLTexture } from 'alfrid';
import { Noise } from './libs/perlin';
import ShaderUtils from './ShaderUtils';
import Params from './Params';

import vs from '../shaders/trees.vert';
import fs from '../shaders/trees.frag';
import fsFallback from '../shaders/treeFallback.frag';

const treePositions = [[-36.228691210225534,0,31.742498892474174],[26.989947308038992,0,-28.14405048412889],[4.19934150084611,0,47.54843151917581],[-11.964537003360952,0,1.1817871963943247],[35.76573062078019,0,-38.14926709817419],[48.78533387086483,0,18.86626958084463],[-8.14995765449995,0,46.25510939916178],[5.822149489999148,0,42.16185641251822],[-43.98885324884443,0,-12.936818803334504],[-40.57468916973164,0,-39.63648020912205],[-13.927362869237882,0,13.42370206934254],[40.62801186381435,0,25.6888518712866],[15.299171924045282,0,25.831051042038638],[-29.913877158656632,0,14.830101105776919],[-10.150761834227694,0,-7.838028595851988],[45.72784170517335,0,44.71934247500475],[-31.24660807565469,0,49.63495512708553],[-45.960587469642135,0,13.449017196940318],[-33.821051469936506,0,-43.08995341380326],[-18.12094225232761,0,-32.07687531954046],[-2.798889959751236,0,-2.674051153624845],[-30.67440488278068,0,26.759704003583934],[-39.687353121342085,0,-16.011076287631965],[13.414915965787856,0,18.609801311357742],[34.16811563617988,0,11.609094655153093],[6.392374235399487,0,-40.45565394926882],[-49.77146765109679,0,38.68881512128077],[47.717609545969026,0,-7.248542342973806],[20.38205474994224,0,28.696014955936164],[-47.169044717910054,0,8.895666810800584],[35.08507361897554,0,-41.779759696696004],[-38.09950510571936,0,-9.905667774505169],[-33.62546833867184,0,38.515892404451236],[26.132386274209637,0,26.193838003359772],[-18.82110980914544,0,20.410543336024432],[-26.80590122529516,0,-11.730816831478478],[-34.294375770832055,0,-49.201461174249125],[5.918975222611024,0,32.48509688743006],[5.848558816480363,0,27.366522811171293],[1.4690347008935447,0,-47.691000149166115],[18.507694068146847,0,41.704502138532476],[-44.19800451951479,0,2.468232512858947],[-22.719821297010846,0,26.116120160324854],[-36.14652103159494,0,43.3773793976918],[-11.160762969787719,0,-27.080230966553653],[28.899073629023462,0,-21.052633643435016],[29.196580049093114,0,-17.237005243287307],[-34.664076086829375,0,-40.63363836151497],[15.244541053382306,0,43.951127262744635],[2.560728478661801,0,-3.357457368274794]];
const random = function(min, max) { return min + Math.random() * (max - min);	}
var saveJson = function(obj, name='points') {
	var str = JSON.stringify(obj);
	var data = encode( str );

	var blob = new Blob( [ data ], {
		type: 'application/octet-stream'
	});
	
	var url = URL.createObjectURL( blob );
	var link = document.createElement( 'a' );
	link.setAttribute( 'href', url );
	link.setAttribute( 'download', `${name}.json` );
	var event = document.createEvent( 'MouseEvents' );
	event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	link.dispatchEvent( event );
}


var encode = function( s ) {
	var out = [];
	for ( var i = 0; i < s.length; i++ ) {
		out[i] = s.charCodeAt(i);
	}
	return new Uint8Array( out );
}

const grey = 0.1;
const oUniforms = {
	roughness:1,
	specular:.25,
	metallic:0,
	baseColor:[grey, grey, grey]
}

class ViewTrees extends alfrid.View {
	
	constructor() {
		const useFallback = !GL.getExtension('EXT_shader_texture_lod') || GL.isMobile;
		const _fs = ShaderUtils.addUniforms(useFallback ? fsFallback : fs, oUniforms);

		super(vs, _fs);
		this.useFallback = useFallback;
	}


	_init() {
		const perlin = new Noise(Math.random() * 0xFFFF);

		const positions = [];
		const uvs = [];
		const indices = [];
		let index = 0;

		const height = 100;
		const radius = .2;
		const num = 24;
		const noiseScale = 0.5;
		const noiseSize = 0.5;

		const getPosition = (i, j) => {
			const angle = i / num * Math.PI * 2.0;
			const y = j/num * height;
			const r = radius - j/num * .01;

			let x = Math.cos(-angle) * r;
			let z = Math.sin(-angle) * r;
			
			const noise = perlin.simplex3(x*noiseScale, y*noiseScale, z*noiseScale) * noiseSize;
			x *= 1.0 + noise;
			z *= 1.0 + noise;

			return [x, y, z];
		}

		for(let i=0; i<num; i++) {
			for(let j=0; j<num; j++) {
				positions.push(getPosition(i, j));
				positions.push(getPosition(i+1, j));
				positions.push(getPosition(i+1, j+1));
				positions.push(getPosition(i, j+1));

				uvs.push([i/num, j/num]);
				uvs.push([(i+1)/num, j/num]);
				uvs.push([(i+1)/num, (j+1)/num]);
				uvs.push([i/num, (j+1)/num]);


				indices.push(index*4 + 0);
				indices.push(index*4 + 1);
				indices.push(index*4 + 2);
				indices.push(index*4 + 0);
				indices.push(index*4 + 2);
				indices.push(index*4 + 3);

				index ++;
			}
		}

		const NUM_TREES = 50;
		const positionOffsets = treePositions;
		const rotations = [];
		const { terrainSize } = Params;
		const rz = .1;

		const getTreePosition = () => {
			return [random(-terrainSize, terrainSize), 0, random(-terrainSize, terrainSize)]
		}

		for(let i=0; i<NUM_TREES; i++) {
			// positionOffsets.push(getTreePosition());
			rotations.push([random(-rz, rz), random(-1, 1), random(1.5, 3)]);
		}


		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferIndex(indices);
		this.mesh.bufferInstance(positionOffsets, 'aPosOffset');
		this.mesh.bufferInstance(rotations, 'aExtra');


		this._textureTree = new alfrid.GLTexture(getAsset('tree'));

		// const f = gui.addFolder('tree');
		// f.add(oUniforms, 'roughness', 0, 1);
		// f.add(oUniforms, 'specular', 0, 1);
		// f.add(oUniforms, 'metallic', 0, 1);

		this._treePositions = positionOffsets;
		// window.addEventListener('keydown', (e)=> {
		// 	// console.log(e.keyCode);
		// 	if(e.keyCode === 83) {
		// 		saveJson(this._treePositions);
		// 	}
		// });
	}


	render(textureRad, textureIrr, textureNoise, textureEnv) {
		this.shader.bind();

		this.shader.uniform("textureTree", "uniform1i", 1);
		this._textureTree.bind(1);

		this.shader.uniform("textureNoise", "uniform1i", 2);
		textureNoise.bind(2);

		if(this.useFallback) {
			this.shader.uniform("textureEnv", "uniform1i", 3);
			textureEnv.bind(3);
		} else {
			this.shader.uniform('uRadianceMap', 'uniform1i', 3);
			textureRad.bind(3);

			this.shader.uniform('uIrradianceMap', 'uniform1i', 4);
			textureIrr.bind(4);	
		}

		this.shader.uniform('uExposure', 'float', Params.exposure);
		this.shader.uniform('uGamma', 'float', Params.gamma);
		
		this.shader.uniform('uFogDensity', 'float', Params.fogDensity);
		this.shader.uniform('uFogColor', 'vec3', Params.fogColor);

		ShaderUtils.bindUniforms(this.shader, oUniforms);

		this.shader.uniform("uClipY", "float", Params.clipY);
		this.shader.uniform("uDir", "float", Params.clipDir);
		GL.draw(this.mesh);
	}


}

export default ViewTrees;