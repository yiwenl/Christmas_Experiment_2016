// UIUtils.js

const utils = {

}


utils.clearAllstops = function() {
	for(let i=0; i<9; i++) {
		let className = `stop-${i}`;
		document.body.classList.remove(className);
		document.body.classList.remove('stop-final');
		document.body.classList.remove('complete');
	}
}

utils.setStop = function(mStop) {
	utils.clearAllstops();

	document.body.classList.add(mStop);
}


export default utils;