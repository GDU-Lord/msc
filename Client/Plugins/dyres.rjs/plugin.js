/* jshint -W069 */
(plugin) => {

	const ex = plugin.exports = {};
	const rjs = plugin.engine;
	const sets = plugin.pack.settings;

	ex.preTime = Date.now();
	ex.decrease = false;
	ex.increase = false;
	ex.EPP = 0;
	ex.low = false;
	ex.high = false;
	ex.resolutionScale = 1;

	ex.getResolution = function (horiz) {
		if(sets["dynamic"]) {
			const time = Date.now();
			ex.low = rjs.FPS < sets["min_FPS"];
			ex.high = rjs.FPS > sets["max_FPS"];
			if(ex.low || ex.high)
				ex.EPP ++;
			if(time-ex.preTime >= sets["period"] && ex.EPP > sets["EPP"]) {
				ex.decrease = ex.low;
				ex.increase = ex.high;
				ex.preTime = time;
			}
			if(ex.decrease) {
				ex.resolutionScale /= sets.k;
				ex.decrease = false;
			}
			if(ex.increase) {
				ex.resolutionScale *= sets.k;
				ex.increase = false;
			}
			if(ex.resolutionScale > sets["max_resolution_scale"])
				ex.resolutionScale = sets["max_resolution_scale"];
			if(ex.resolutionScale < sets["min_resolution_scale"])
				ex.resolutionScale = sets["min_resolution_scale"];
			
			return {
				innerWidth: window.innerWidth*ex.resolutionScale,
				innerHeight: window.innerHeight*ex.resolutionScale,
			}
		}
		else if(sets["static"]) {
			if(horiz)
				ex.resolutionScale = sets["static_resoution"]*rjs.client.h/window.innerHeight;
			else
				ex.resolutionScale = sets["static_resoution"]*rjs.client.w/window.innerWidth;
			return {
				innerWidth: window.innerWidth*ex.resolutionScale,
				innerHeight: window.innerHeight*ex.resolutionScale,
			}
		}
		else {
			ex.resolutionScale = 1;
			return {
				innerWidth: window.innerWidth,
				innerHeight: window.innerHeight,
			}
		}
	};
	
	

	rjs.resizeCanvas = function () {
		const prop = rjs.client.w / rjs.client.h;
		const con = rjs.container;
		const bg_color = rjs.BG_COLOR.toStringCSS();
		const clear_color = rjs.CLEAR_COLOR.toStringCSS();
		const res = ex.getResolution(window.innerWidth > window.innerHeight * prop);
		if(document.body.style.backgroundColor != bg_color)
			document.body.style.backgroundColor = bg_color;
		if(con.style.backgroundColor != clear_color)
			con.style.backgroundColor = clear_color;
		rjs.ctx.clearRect(0, 0, rjs.canvas_width, rjs.canvas_height);
		if(rjs.prevWindowSize.x != res.innerWidth || rjs.prevWindowSize.y != res.innerHeight) {
			rjs.prevWindowSize = vec2(res.innerWidth, res.innerHeight);
			if(window.innerWidth > window.innerHeight * prop) {

				const w = rjs.canvas_width = res.innerHeight * prop;
				const h = rjs.canvas_height = res.innerHeight;

				const cw = rjs.con_width = window.innerHeight * prop;
				const ch = rjs.con_height = window.innerHeight;

				con.style.width = cw + 'px';
				con.style.height = ch + 'px';
				con.style.position = 'absolute';
				con.style.left = (window.innerWidth - cw) / 2 + 'px';
				con.style.top = 0 + 'px';

				const cvs = con.getElementsByTagName('canvas');

				for(let i = 0; i < cvs.length; i ++) {
					cvs[i].width = w;
					cvs[i].height = h;
					cvs[i].style.width = cw + "px";
					cvs[i].style.height = ch + "px";
					cvs[i].style.position = 'absolute';
					cvs[i].style.left = '0px';
					cvs[i].style.top = '0px';
				}

				const div = con.getElementsByTagName('div');

				for(let i = 0; i < div.length; i ++) {
					div[i].style.width = cw + 'px';
					div[i].style.height = ch + 'px';
					div[i].style.position = 'absolute';
					div[i].style.left = '0px';
					div[i].style.top = '0px';
				}
				
			}
			else {

				const w = rjs.canvas_width = res.innerWidth;
				const h = rjs.canvas_height = res.innerWidth / prop;

				const cw = rjs.con_width = window.innerWidth;
				const ch = rjs.con_height = window.innerWidth / prop;
				
				con.style.width = cw + 'px';
				con.style.height = ch + 'px';
				con.style.position = 'absolute';
				con.style.left = 0 + 'px';
				con.style.top = (window.innerHeight - ch) / 2 + 'px';

				const cvs = con.getElementsByTagName('canvas');

				for(let i = 0; i < cvs.length; i ++) {
					cvs[i].width = w;
					cvs[i].height = h;
					cvs[i].style.width = cw + "px";
					cvs[i].style.height = ch + "px";
					cvs[i].style.position = 'absolute';
					cvs[i].style.left = '0px';
					cvs[i].style.top = '0px';
				}

				const div = con.getElementsByTagName('div');

				for(let i = 0; i < div.length; i ++) {
					div[i].style.width = cw + 'px';
					div[i].style.height = ch + 'px';
					div[i].style.position = 'absolute';
					div[i].style.left = '0px';
					div[i].style.top = '0px';
				}
			}
		}
	};

	ex.Loop = new rjs.GameLoop(() => {
		
	});

}