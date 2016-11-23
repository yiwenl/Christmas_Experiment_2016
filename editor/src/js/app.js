import '../scss/global.scss';
import alfrid, { GL } from 'alfrid';
import SceneApp from './SceneApp';
import AssetsLoader from 'assets-loader';
import dat from 'dat-gui';
import Stats from 'stats.js';

let TARGET_SERVER_IP = 'localhost';
let socket = require('./libs/socket.io-client')(TARGET_SERVER_IP + ':9876');
let isLocked = false;


window.params = {
	rx:0,
	ry:0
}

const assets = [
	// { id:'noise', url:'assets/img/noise.jpg' }
];

if(document.body) {
	_init();
} else {
	window.addEventListener('DOMContentLoaded', _init);
}

let img;

function _init() {

	img = new Image();
	img.addEventListener('load', _onImageLoaded);
	// img.onload = _onImageLoaded
	img.src = 'assets/img/height.jpg';

	window.gui = new dat.GUI({width:300});
	gui.add(params, 'rx', 0, Math.PI/2).onChange(onChange);
	gui.add(params, 'ry', 0, Math.PI * 2.0).onChange(onChange);


	window.addEventListener('keydown', _onKey);
}

let canvas, ctx, size;
let point = {x:0.5, y:0.5}
function _onImageLoaded() {
	canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	size = Math.min(window.innerWidth, window.innerHeight);
	canvas.width = size;
	canvas.height = size;
	ctx = canvas.getContext('2d');
	canvas.addEventListener('mousedown', _onPoint);

	alfrid.Scheduler.addEF(render);
}

function circle(x, y, radius=2, color='#f00') {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	ctx.fillStyle = color;
	ctx.fill();
}



function render() {
	ctx.clearRect(0, 0, size, size);
	ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, size, size);

	circle(point.x * size, point.y * size, 10);

	ctx.save();
	ctx.translate(point.x * size, point.y * size);
	ctx.rotate(params.ry - Math.PI/2);

	const s = 5;
	ctx.fillStyle = '#0f6';
	ctx.fillRect(0, -s, 50, s*2);
	ctx.restore();
}


function _onPoint(e) {
	// console.log(e.clientX, e.clientY);
	point.x = e.clientX / size;
	point.y = e.clientY / size;

	const tx = -(point.x * 2.0 - 1.0);
	const tz = -(point.y * 2.0 - 1.0);

	socket.emit('cameraPos', {x:tx, y:0, z:tz});
}


function _onKey(e) {
	console.log(e.keyCode);
	socket.emit('keyboard', e.keyCode)
}



function onChange() {
	console.log('on Change :', params);
	socket.emit('cameraAngle', params);
}
