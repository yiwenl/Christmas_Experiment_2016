import '../scss/global.scss';
import alfrid, { Camera, GL } from 'alfrid';
import SceneApp from './SceneApp';
import AssetsLoader from 'assets-loader';
import dat from 'dat-gui';
import Stats from 'stats.js';
import Params from './Params';
import SoundCloudBadge from './SoundCloudBadge';
import VIVEUtils from './VIVEUtils';

// let TARGET_SERVER_IP = 'localhost';
// let socket = require('./libs/socket.io-client')(TARGET_SERVER_IP + ':9876');
// window.socket = socket;

let scene;
const assets = [
	{ id:'objTrunk', url:'assets/obj/trunk.obj', type:'text' },
	{ id:'ao', url:'assets/img/ao-trunk.jpg' },
	{ id:'height', url:'assets/img/height.jpg' },
	{ id:'nothing', url:'assets/img/nothing.png' },
	{ id:'normal', url:'assets/img/normal.jpg' },
	{ id:'noise', url:'assets/img/noise.png' },
	{ id:'title', url:'assets/img/title.png' },
	{ id:'fg', url:'assets/img/fg.png' },
	{ id:'fgMobile', url:'assets/img/fgMobile.png' },
	{ id:'gradient', url:'assets/img/gradient.jpg' },
	{ id:'gradientMap', url:'assets/img/gradientMap.jpg' },
	{ id:'tree', url:'assets/img/tree.jpg' },
	{ id:'starsmap', url:'assets/img/starsmap.jpg' },
	{ id:'starsmapMobile', url:'assets/img/starsmapMobile.jpg' },
	{ id:'stroke', url:'assets/img/stroke3.png' },
	{ id:'radiance', url:'assets/img/studio_radiance.dds', type: 'binary' },
	{ id:'irr_posx', url:'assets/img/irr_posx.hdr', type:'binary' },
	{ id:'irr_posx', url:'assets/img/irr_posx.hdr', type:'binary' },
	{ id:'irr_posy', url:'assets/img/irr_posy.hdr', type:'binary' },
	{ id:'irr_posz', url:'assets/img/irr_posz.hdr', type:'binary' },
	{ id:'irr_negx', url:'assets/img/irr_negx.hdr', type:'binary' },
	{ id:'irr_negy', url:'assets/img/irr_negy.hdr', type:'binary' },
	{ id:'irr_negz', url:'assets/img/irr_negz.hdr', type:'binary' },
];

window.getAsset = function(id) {	return window.assets.find( (a) => a.id === id).file;	}

if(document.body) {
	_init();
} else {
	window.addEventListener('DOMContentLoaded', _init);
}


function _init() {

	//	LOADING ASSETS
	if(assets.length > 0) {
		document.body.classList.add('isLoading');

		let loader = new AssetsLoader({
			assets:assets
		}).on('error', function (error) {
			console.error(error);
		}).on('progress', function (p) {
			// console.log('Progress : ', p);
			let loader = document.body.querySelector('.Loading-Bar');
			if(loader) loader.style.width = (p * 100).toFixed(2) + '%';
		}).on('complete', _onImageLoaded)
		.start();
	} else {
		_init3D();
	}

}


function _onImageLoaded(o) {
	//	ASSETS
	console.log('Image Loaded : ', o);
	window.assets = o;
	const loader = document.body.querySelector('.Loading-Bar');
	loader.style.width = '100%';

	_initVR();

	setTimeout(()=> {
		document.body.classList.remove('isLoading');
	}, 250);
}


window.hasVR = false;
window.vrPresenting = false;

function _initVR() {
	VIVEUtils.init( (vrDisplay) => _onVR(vrDisplay));
}

function _onVR(vrDisplay) {
	console.debug('on VR :', vrDisplay);

	if(vrDisplay != null) {
		hasVR = true;
		document.body.classList.add('hasVR');
		let btnVR = document.body.querySelector('#enterVr');
		btnVR.addEventListener('click', ()=> {
			VIVEUtils.present(GL.canvas, ()=> {
				console.log('Scene :', scene, 'present VR now ');
				window.vrPresenting = true;
				scene.resize();
				// scene.setVR();
			});
		});
	} else {

	}

	Params.numParticles = hasVR ? 256 : 128;
	Params.postEffect = hasVR;

	// document.body.classList.add('hasVR');
	// hasVR = true;
	console.debug('Has VR ? ', hasVR, Params);

	_init3D();
	_initSound();

}

function _init3D() {
	//	CREATE CANVAS
	let canvas = document.createElement('canvas');
	canvas.className = 'Main-Canvas';
	document.body.appendChild(canvas);

	//	INIT 3D TOOL
	GL.init(canvas);

	if(GL.isMobile) {
		document.body.classList.add('is-mobile');
	}

	//	INIT DAT-GUI
	window.gui = new dat.GUI({ width:300 });

	//	CREATE SCENE
	scene = new SceneApp();

	//	STATS
	if(!GL.isMobile) {
		const stats = new Stats();
		document.body.appendChild(stats.domElement);
		alfrid.Scheduler.addEF(()=>stats.update());
	}


	// gui.add(Params, 'gamma', 1, 5);
	// gui.add(Params, 'exposure', 1, 25);
	// gui.add(Params, 'seaLevel', 0, 2).step(0.01).onChange(()=> {
	// 	console.log(Params);
	// });
	// gui.add(Params, 'postEffect');

	// const fFog = gui.addFolder('Fog');
	// fFog.add(Params, 'fogDensity', 0.01, 0.1).step(0.01);
	// fFog.open();

	_initControls();
}


function _initControls() {
	const btnStart = document.body.querySelector('.button-start');
	btnStart.addEventListener('click', ()=> {
		scene.nextStop();
	});

	const btnContinue = document.body.querySelector('.button-continue');
	btnContinue.addEventListener('click', ()=> {
		scene.nextStop();
	});

	const btnRestart = document.body.querySelector('.button-restart');
	console.log('btnRestart', btnRestart);
	btnRestart.addEventListener('click', ()=> {
		scene.restart();
	});
}

function _initSound() {
	const songs = [
		'https://soundcloud.com/lukeabbottmusic/modern-driveway-jon-hopkins'
	]

	let song = songs[Math.floor(Math.random() * songs.length)];

	SoundCloudBadge({
		client_id: 'e8b7a335a5321247b38da4ccc07b07a2',
		song: song
	}, _onSound);
}


let soundOn = true;

function _onSound(err, src, json) {
	// console.log('on Sound : ', src, json);
	const audio = new Audio();
	audio.src = src;
	audio.play();
	audio.loop = true;
	audio.volume = 0.2;

	const btnSound = document.body.querySelector('.button-sound');
	btnSound.addEventListener('click', ()=> {
		soundOn = !soundOn;
		btnSound.innerHTML = soundOn ? 'SOUND OFF' : 'SOUND ON';
		audio.volume = soundOn ? 0.2 : 0;
	});
}
