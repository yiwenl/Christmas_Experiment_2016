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

let points = [{"x":0.4898148148148148,"y":2.543168085871387,"z":0.8759259259259259,"rx":0.6198826170582594,"ry":0,"radius":72.34874727047912},{"x":0.6527777777777778,"y":1.5785181222649989,"z":0.6564814814814814,"rx":0.6198826170582594,"ry":-0.8273642165722914,"radius":26.308635371083312},{"x":0.6787037037037037,"y":1.5785181222649989,"z":0.4722222222222222,"rx":0,"ry":1.3215621892296738,"radius":26.308635371083312},{"x":0.4888888888888889,"y":1.8854522015943043,"z":0.3768518518518518,"rx":0,"ry":-0.3314581229256839,"radius":73.66417903903329},{"x":0.43148148148148147,"y":1.4469749454095824,"z":0.5212962962962963,"rx":0.42703024730680095,"ry":-1.9844784350810423,"radius":28.939498908191645}];

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


	updatePoints();
}

function getNumber(value, prec = 100) {
	return Math.floor(value * prec) / prec;
}

function _saveJson() {
	// saveJson(points);
	let i =0;
	const toSave = points.map((data)=> {
		const px = -(data.x * 2.0 - 1.0);
		const pz = -(data.z * 2.0 - 1.0);
		const angle = data.ry - Math.PI/2;
		let tx = data.x * size + Math.cos(angle) * data.radius;
		let tz = data.z * size + Math.sin(angle) * data.radius;

		tx = tx / size * 2 - 1;
		tz = tz / size * 2 - 1;

		console.log(i, data, tx, tz);

		return {
			x:px,
			z:pz,
			tx:tx,
			ty:data.y,
			tz:tz,
			rx:data.rx,
			ry:data.ry
		}
	});

	saveJson(toSave);
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
		console.log(i, p);
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


	_onPoint();
	onChange();
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
	if(e) {
		point.x = e.clientX / size;
		point.y = e.clientY / size;	
	}
	

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
