// index.js
'use strict';
const PORT_SOCKET = 9876;
let app    = require('express')();
let server = app.listen(PORT_SOCKET);
let io     = require('socket.io')(server);


//	OSC EMITTER

const PORT_EMIT_OSC = 8885;
const OscEmitter = require("osc-emitter");

let emitter = new OscEmitter();
emitter.add('localhost', PORT_EMIT_OSC);
emitter.add('localhost', PORT_EMIT_OSC+1);


//	WEB SOCKETS

io.on('connection', (socket)=>_onConnected(socket));

function _onConnected(socket) {
	console.log('A user is connected : ', socket.id);

	socket.on('disconnect', ()=>_onDisconnected() );
	socket.on('keyboard', (keyCode)=>{
		// console.log('KeyCode:', keyCode);
	});

	socket.on('cameraAngle', (angles)=>_onCameraAngle(angles));
	socket.on('cameraPos', (pos)=>_onCameraPos(pos));
}


function _onCameraAngle(angles) {
	console.log('Camera angles : ', angles);
	io.emit('cameraAngleChange', angles);
}

function _onCameraPos(pos) {
	console.log('Camera Position :', pos);
	io.emit('cameraPositionChange', pos);
}

function _onDisconnected() {
	console.log(' A user has disconnected');
}