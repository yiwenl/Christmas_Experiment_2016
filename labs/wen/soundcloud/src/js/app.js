import SoundCloudBadge from './SoundCloudBadge';

SoundCloudBadge({
	client_id: 'e8b7a335a5321247b38da4ccc07b07a2',
	song: 'https://soundcloud.com/awintory/abzu-balaenoptera-musculus'
}, _onSound);



function _onSound(err, src, json) {
	console.log('on Sound : ', src, json);
	const audio = new Audio();
	audio.src = src;
	audio.play();
	audio.loop = true;
	audio.volume = 0.5;
}
