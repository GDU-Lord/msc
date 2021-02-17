(plugin) => {

	const ex = plugin.exports = {};
	const rjs = plugin.engine;

	function getPlatform () {
		const agent = window.navigator.userAgent;
		const plt = window.navigator.platform;
		const mobile = [/Linux armv/, /Android/, null, /iPhone/, /iPod/, /iPad/, /iPad Simulator/, /Pike/];
		for(let i in mobile) {
			if(mobile[i] != null && mobile[i].test(plt))
				return 'Mobile';
			else if(mobile[i] == null && plt == null)
				return 'Mobile';
		}
		return 'PC';
	}

	rjs._mouse.touchID = 0;

	ex.Platform = getPlatform();

	if(ex.Platform == 'Mobile') {
		rjs.MouseDown = function (fnc, active = true, scene = null, target = rjs.eventDetector) {
			this.event = new rjs.TouchStart(fnc, null, active, scene, target);
			return this.event;
		};
		rjs.MouseUp = function (fnc, active = true, scene = null, target = rjs.eventDetector) {
			this.event = new rjs.TouchEnd(fnc, null, active, scene, target);
			return this.event;
		};
	}
	
	


}