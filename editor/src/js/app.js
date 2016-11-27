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
	ry:0,
	y:2.5,
	radius:10
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

let points = [];

function _init() {

	img = new Image();
	img.addEventListener('load', _onImageLoaded);
	// img.onload = _onImageLoaded
	img.src = 'assets/img/height.jpg';

	window.gui = new dat.GUI({width:300});
	gui.add(params, 'rx', 0, Math.PI/2).onChange(onChange);
	gui.add(params, 'ry', -Math.PI, Math.PI).onChange(onChange);
	gui.add(params, 'y', 0, 5).onChange(onChange);
	gui.add(params, 'radius', 0, 150).onChange(onChange);

	window.addEventListener('keydown', _onKey);
}

let canvas, ctx, size;
let point = {x:0.5, y:0.5}
let divContainer, divTemplate;

function _onImageLoaded() {
	canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	size = Math.min(window.innerWidth, window.innerHeight);
	canvas.width = size;
	canvas.height = size;
	ctx = canvas.getContext('2d');
	canvas.addEventListener('mousedown', _onPoint);

	alfrid.Scheduler.addEF(render);


	const btnAdd = document.body.querySelector('.button-add');
	btnAdd.addEventListener('click', _addPoint);

	const btnSave = document.body.querySelector('.button-save');
	btnSave.addEventListener('click', _saveJson);

	divContainer = document.body.querySelector('.points-container');
	divTemplate = document.body.querySelector('.template-point');
}

function getNumber(value, prec = 100) {
	return Math.floor(value * prec) / prec;
}

function _saveJson() {
	saveJson(points);
}

function _addPoint() {
	const p = {
		x:point.x, 
		y:params.y,
		z:point.y,
		rx:params.rx,
		ry:params.ry,
		radius:params.radius
	}

	points.push(p);

	updatePoints();
}

function updatePoints() {
	while (divContainer.hasChildNodes()) {
		divContainer.removeChild(divContainer.lastChild);
	}

	for(let i=0; i<points.length; i++) {
		let p = points[i];
		const div = divTemplate.cloneNode(true);
		const pTag = div.querySelector('p');
		pTag.innerHTML = `x:${getNumber(p.x)}, y:${getNumber(p.y)}, rx:${getNumber(p.rx)}, ry:${getNumber(p.ry)}`;
		divContainer.appendChild(div);
		div.classList.remove('template');

		let btnRemove = div.querySelector('.btn-remove');
		btnRemove.addEventListener('click', (e) => {
			remove(i);
		});

		let btnSelect = div.querySelector('.btn-select');
		btnSelect.addEventListener('click', (e) => {
			select(i);
		});
	}
}


function select(index) {
	console.log('Select', index);
	const p = points[index];
	console.log(p);

	point.x = p.x;
	point.y = p.z;

	params.y = p.y;
	params.rx = p.rx;
	params.ry = p.ry;
	params.radius = p.radius;
}

function remove(index) {
	points.splice(index, 1);

	updatePoints();
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


	renderPoints();

	const px = point.x * size;
	const py = point.y * size;
	const angle = params.ry - Math.PI/2;
	const tx = px + Math.cos(angle) * params.radius;
	const ty = py + Math.sin(angle) * params.radius;

	circle(px, py, 2);
	circle(tx, ty, 2, '#f6f');


	ctx.save();
	ctx.translate(point.x * size, point.y * size);
	ctx.rotate(params.ry - Math.PI/2);

	const s = 1;
	ctx.fillStyle = '#0f6';
	ctx.fillRect(0, -s, params.radius, s*2);
	ctx.restore();
}


function renderPoints() {
	for(let i=0; i<points.length; i++) {
		_renderPoints(points[i]);
	}
}

function _renderPoints(p) {
	const px = p.x * size;
	const py = p.z * size;
	const angle = params.ry - Math.PI/2;
	const tx = px + Math.cos(angle) * params.radius;
	const ty = py + Math.sin(angle) * params.radius;

	circle(px, py, 2, '#222');
	circle(tx, ty, 2, '#333');


	ctx.save();
	ctx.translate(px, py);
	ctx.rotate(p.ry - Math.PI/2);

	const s = 1;
	ctx.fillStyle = '#555';
	ctx.fillRect(0, -s, p.radius, s*2);
	ctx.restore();
}

function _onPoint(e) {
	// console.log(e.clientX, e.clientY);
	point.x = e.clientX / size;
	point.y = e.clientY / size;

	const px = -(point.x * 2.0 - 1.0);
	const pz = -(point.y * 2.0 - 1.0);

	socket.emit('cameraPos', {x:px, y:0, z:pz});

	onChange();
}

function _onKey(e) {
	console.log(e.keyCode);

	if(e.keyCode === 83) {
		_saveJson();
	} else if(e.keyCode === 65) {
		_addPoint();
	}
	// socket.emit('keyboard', e.keyCode)
}

function onChange() {
	socket.emit('cameraAngle', params);

	const px = -(point.x * 2.0 - 1.0);
	const pz = -(point.y * 2.0 - 1.0);
	const angle = params.ry - Math.PI/2;
	let tx = point.x * size + Math.cos(angle) * params.radius;
	let tz = point.y * size + Math.sin(angle) * params.radius;

	tx = tx / size * 2 - 1;
	tz = tz / size * 2 - 1;
	
	socket.emit('targetPos', {x:tx, y:params.y, z:tz});
}

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
