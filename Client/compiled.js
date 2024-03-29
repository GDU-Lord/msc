{
let FS_PLUS,FS_SOUND,FS_X,FS_DOTS,VS_PLUS,FS_NOISE,H_DEF,H_PLUS,H_PLUS2,H_SOUND,H_X,H_DOTS,TILE,UI_TEXT,ARMY,QBUTTON,KICK,JOIN,LIST,GROUP_TEXT,GROUP_BG,NEW_GROUP,WINDOW,play_cam,play_bg,play_main,play_map,play_armies,play_ui,MAP,UI,DEFEATED,tiles,tx_invite,tx_voice_invite,tx_voice_kick,tx_kick,tx_username,tx_room,tx_pop,tx_army,tx_level,tx_coins,tx_turns,tx_groups,tx_voice_list,menu_cam,menu_text,menu_bg,menu_buttons,SOCKET_SCRIPT,PASSWORD,login_button,discord_button,socket,USERNAME,ROOM,PASS,GAME_STARTED,ROOM_REQUEST;

// код запускается после загрузки страници

let rjs, Global, Touch, Smart, Fade, DyRes, Drag, Input, new_scene;

window.addEventListener('load', (e) => {

	// инициализация Rect Engine 5
	rjs = new RectJS(rjs => {

		// код выполняется перед инициализацией движка
		// здесь подключается большенство плагинов

		Global = new (function () {
        const pack = JSON.parse(`{
	"name": "global",
	"version": "1.0.0",
	"main": "plugin.js",
	"compiled": "compiled.js",
	"settings": {
        "symbol": "$",
		"global": "window."
	}
}`);
        const code = ((plugin) => {

	
	const exports = plugin.exports = {}; // интерфейс плагина
	const rjs = plugin.engine; // ссылка на движок
	const pack = plugin.pack; // объект загруженный из package.json
	const sets = plugin.pack.settings; // настройки плагина
	const params = plugin.params; // параметры подключения плагина
	const global = plugin.global; // свойства этого объекта после инициализации плагина станут глобальными
	const code = plugin.code; // функция из файла plugin.js
	
    // здесь выполняется код плагина

    exports.literas = {};

    const literas = "abcdefghijklmnopqrstuvwxyz_$";

    for(let i in literas) {
        exports.literas[literas[i]] = i;
    }

    exports._GLOBAL = [];

    exports.Convert = function (char) {

        let changed = false;
        let res = "";
        let readWordMode = false;
        let word = "";

        for(let i in char) {
            const index = parseFloat(i);
            if(readWordMode) {
                if(char[i] in exports.literas)
                    word += char[i];
                else {
                    exports._GLOBAL.push(word);
                    word = "";
                    readWordMode = false;
                }
            }
            if((typeof char[index-1] == "undefined" || char[index-1] == " " || char[index-1] == ";" || char[index-1] == "\t" || char[index-1] == "\v") && char[index] == sets.symbol && char[index+1] in exports.literas) {
               
                res += sets.global;
                readWordMode = true;
                changed = true;
            }
            else
                res += char[index];
        }
        return res;

    };

});
        this.params = [];
        this.exports = undefined;
        this.global = {};
        this.pack = pack;
        this.code = code;
        this.engine = rjs;
        this.fnc = this.code;
        const res = this.fnc(this);
        this.res = typeof res != 'undefined' ? res : null;
        rjs.plugins[this.pack.name] = this;
        for(let i in this.global) {
            window[i] = this.global[i];
        }
        return this.exports;
    })("global");
		Touch = new (function () {
        const pack = JSON.parse(`{
	"name": "touch",
	"version": "1.0.0",
	"main": "plugin.js",
	"settings": {

	}
}`);
        const code = ((plugin) => {

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
	
	


});
        this.params = [];
        this.exports = undefined;
        this.global = {};
        this.pack = pack;
        this.code = code;
        this.engine = rjs;
        this.fnc = this.code;
        const res = this.fnc(this);
        this.res = typeof res != 'undefined' ? res : null;
        rjs.plugins[this.pack.name] = this;
        for(let i in this.global) {
            window[i] = this.global[i];
        }
        return this.exports;
    })("touch");
		Smart = new (function () {
        const pack = JSON.parse(`{
	"name": "smart",
	"version": "1.0.0",
	"main": "plugin.js",
	"compiled": "compiled.js",
	"settings": {

	}
}`);
        const code = (/* jshint -W069 */
(plugin) => {

	const ex = plugin.exports = {};
	const rjs = plugin.engine;
	const config = new Config(plugin.params[0]);

	function Config (_conf = {}) {
		return {
			scene_path: _conf['scene_path'] || 'Scenes/',
			image_path: _conf['image_path'] || 'Sources/images/',
			audio_path: _conf['audio_path'] || 'Sources/audio/',
			json_path: _conf['json_path'] || 'Sources/json/',
			script_path: _conf['script_path'] || 'Scripts/',
			font_path: _conf['font_path'] || 'Sources/fonts/'
		}
	}

	ex.Image = function (src, ...params) {
		return new rjs.Texture(config['image_path']+src, ...params);
	};

	ex.Audio = function (src) {
		return new rjs.Sound(config['audio_path']+src);
	};

	ex.Font = function (name, src) {
		return rjs.loadFont(name, config['font_path']+src);
	};

	ex.reverse = function (arr) {
		const res = [];
		for(let i = arr.length-1; i >= 0; i --) {
			res.push(arr[i]);
		}
		return res;
	}


});
        this.params = [];
        this.exports = undefined;
        this.global = {};
        this.pack = pack;
        this.code = code;
        this.engine = rjs;
        this.fnc = this.code;
        const res = this.fnc(this);
        this.res = typeof res != 'undefined' ? res : null;
        rjs.plugins[this.pack.name] = this;
        for(let i in this.global) {
            window[i] = this.global[i];
        }
        return this.exports;
    })("smart");
		Fade = new (function () {
        const pack = JSON.parse(`{
	"name": "fade",
	"version": "1.0.0",
	"main": "plugin.js",
	"settings": {
		
	}
}`);
        const code = ((plugin) => {

	const ex = plugin.exports = {};
	const rjs = plugin.engine;

	ex.lerp = function (origin, target, k = 0.5, min = 0.001) {
		const diff = target-origin;
		return Math.abs(diff) >= min ? origin + (target-origin)*k : target;
	};

	ex.Objects = {};

	ex.Update = function ({ origin, params, targets, k, id, min, active, callbacks }) {
		if(!active)
			return;
		let params_ready = 0;
		for(let i in params) {
			let obj_prm = "origin";
			const nodes = params[i].split('.');
			for(let j in nodes) {
				obj_prm += "['"+nodes[j]+"']";
			}
			let target = targets[i];
			eval(`${obj_prm} = ex.lerp(${obj_prm}, ${target}, ${k}, ${min})`); // jshint ignore:line
			if(eval(obj_prm) == target) // jshint ignore:line
				params_ready ++;
		}
		if(params_ready == count(params)) {
			for(let i in callbacks) {
				callbacks[i](origin);
			}
			ex.Remove(origin);
		}
	};

	ex.SetTarget = function (origin, params, targets, k = 0.5, callback = () => {}, _id = null, min = 0.001, replace_callback = false) {
		const id = typeof origin.id != 'undefined' ? origin.id : _id;
		if(id == null)
			throw "RectJS.Plugin::"+plugin.pack.name.toUpperCase()+".SetTarget(origin, params, targets, _id) \"_id\" is not defined!";
		let _params = [];
		let _targets = [];
		const __params = [];
		const __targets = [];
		let callbacks = [];
		if(typeof ex.Objects[id] != 'undefined') {
			_params = ex.Objects[id].params;
			_targets = ex.Objects[id].targets;
			for(let i in _params) {
				for(let j in params) {
					if(_params[i] == params[j]) {
						delete _params[i];
						delete _targets[i];
					}
				}
			}
			if(!replace_callback)
				callbacks = ex.Objects[id].callbacks;
		}
		for(let i in _params) {
			__params.push(_params[i]);
			__targets.push(_targets[i]);
		}
		origin.__rjs_fade_config = ex.Objects[id] = {
			origin: origin,
			params: [...params, ...__params],
			targets: [...targets, ...__targets],
			k: k,
			id: id,
			min: min,
			callbacks: [callback, ...callbacks],
			active: true
		};
		return ex.Objects[id];
	};

	ex.Stop = function (c) {
		c.active = false;
	};

	ex.Start = function (c) {
		c.active = true;
	};

	ex.Remove = function (o) {
		delete ex.Objects[o.__rjs_fade_config.id];
		delete o.__rjs_fade_config;
	};

	ex.FadeMode = 'none';
	ex.OutSpeed = 0.1;
	ex.InSpeed = 0.1;
	ex.TransScene = null;
	ex.Opacity = 100;
	ex.TransSceneParams = [];

	ex.FadeTransit = function (scene, fade_out = 50, fade_in = 50, ...params) { // jshint ignore:line
		ex.OutSpeed = 100/fade_out;
		ex.InSpeed = 100/fade_in;
		ex.TransScene = scene;
		ex.TransSceneParams = params;
		ex.FadeMode = 'out';
	};

	ex.Loop = new rjs.GameLoop(() => {
		for(let i in ex.Objects) {
			ex.Update(ex.Objects[i]);
		}
		if(ex.FadeMode == 'out') {
			ex.Opacity -= ex.OutSpeed;
			document.body.style.opacity = ex.Opacity/100;
			if(ex.Opacity <= 0) {
				ex.FadeMode = 'in';
				if(ex.TransScene != null) {
					ex.TransScene.set(...ex.TransSceneParams);
					ex.TransScene = null;
					ex.TransSceneParams = [];
				}
			}
		}
		if(ex.FadeMode == 'in') {
			ex.Opacity += ex.InSpeed;
			document.body.style.opacity = ex.Opacity/100;
			if(ex.Opacity >= 100) {
				ex.FadeMode = 'none';
			}
		}
	});




});
        this.params = [];
        this.exports = undefined;
        this.global = {};
        this.pack = pack;
        this.code = code;
        this.engine = rjs;
        this.fnc = this.code;
        const res = this.fnc(this);
        this.res = typeof res != 'undefined' ? res : null;
        rjs.plugins[this.pack.name] = this;
        for(let i in this.global) {
            window[i] = this.global[i];
        }
        return this.exports;
    })("fade");
		DyRes = new (function () {
        const pack = JSON.parse(`{
	"name": "dyres",
	"version": "1.0.0",
	"main": "plugin.js",
	"settings": {
		"dynamic": false,
		"static": true,
		"static_resoution": 0.8,
		"min_FPS": 25,
		"max_FPS": 40,
		"period": 500,
		"EPP": 10,
		"k": 1.1,
		"max_resolution_scale": 1,
		"min_resolution_scale": 0.35
	}
}`);
        const code = (/* jshint -W069 */
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

});
        this.params = [];
        this.exports = undefined;
        this.global = {};
        this.pack = pack;
        this.code = code;
        this.engine = rjs;
        this.fnc = this.code;
        const res = this.fnc(this);
        this.res = typeof res != 'undefined' ? res : null;
        rjs.plugins[this.pack.name] = this;
        for(let i in this.global) {
            window[i] = this.global[i];
        }
        return this.exports;
    })("dyres");
		Drag = new (function () {
        const pack = JSON.parse(`{
	"name": "drag",
	"version": "1.0.0",
	"main": "plugin.js",
	"settings": {
		"autoloop": false
	}
}`);
        const code = ((plugin) => {

	const ex = plugin.exports = {};
	const rjs = plugin.engine;
	const sets = plugin.pack.settings;

	ex.drag = false;
	ex._drag = false;
	ex.startPoint = vec2(null, null);
	ex.startCam = vec2(null, null);
	ex.AutoLoop = sets.autoloop;
	ex.min_scroll = 0.1;
	ex.max_scroll = 10;
	ex.v_borders = vec2(-1000, 1000);
	ex.h_borders = vec2(-1000, 1000);

	ex.Init = function (scene, layer, mouseUpEvent = rjs.MouseUp, mouseDownEvent = rjs.MouseDown) {
		scene.DragEnabled = true;
		scene.DragLayer = layer;
		scene.DragMu = new mouseUpEvent(e => {
			ex.drag = false;
			ex.startPoint = vec2(null, null);
			ex.startCam = vec2(null, null);
		}, true, scene);
		scene.DragMd = new mouseDownEvent(e => {
			if(scene.DragEnabled) {
				let layer = scene.DragLayer;
				ex.drag = true;
				ex.startPoint = rjs._mouse.get(layer, layer.scale, vec2(0, 0));
				ex.startCam = copy(rjs.currentCamera.pos);
			}
		}, true, scene);
	};

	ex.InitZoom = function (scene, layers = [], step = 1.1, scrollUpEvent = rjs.WheelUp, scrollDownEvent = rjs.WheelDown, fnc = ex.Zoom, min_scroll = ex.min_scroll, max_scroll = ex.max_scroll, v_borders = ex.v_borders, h_borders = ex.h_borders) {
		scene.DragZoom = true;
		scene.DragZoomLayers = layers;
		scene.DragZoomStep = step;
		scene.DragZoomMinScroll = min_scroll;
		scene.DragZoomMaxScroll = max_scroll;
		scene.DragZoomVBorders = v_borders;
		scene.DragZoomHBorders = h_borders;
		scene.DragZoomScrollUpEvent = new scrollUpEvent(e => {
			rjs.currentScene.DragZoomTarget /= rjs.currentScene.DragZoomStep;
		}, true, scene);
		scene.DragZoomScrollDownEvent = new scrollDownEvent(e => {
			rjs.currentScene.DragZoomTarget *= rjs.currentScene.DragZoomStep;
		}, true, scene);
		scene.DragZoomFunction = fnc;
		scene.DragZoomTarget = layers[0].scale.x;
	};

	ex.Zoom = function (layer, val) {
		layer.scale.x = val;
		layer.scale.y = val;
	};

	// var md = new rjs.MouseDown((e, s = false) => {
	// 	ex.drag = true;
	// 	let scene = rjs.currentScene;
	// 	if(ex.drag && scene != null && scene.DragEnabled) {
	// 		let layer = scene.DragLayer;
	// 		ex.startPoint = rjs._mouse.get(layer, layer.scale, vec2(0, 0));
	// 		ex.startCam = copy(rjs.currentCamera.pos);
	// 	}
	// 	if(!s)
	// 		ex._drag = true;
	// });

	// var mu = new rjs.MouseUp((e, s = false) => {
	// 	ex.drag = false;
	// 	ex.startPoint = vec2(null, null);
	// 	ex.startCam = vec2(null, null);
	// 	if(!s)
	// 		ex._drag = false;
	// });

	ex.loop = function () {
		let scene = rjs.currentScene;
		if(ex.drag && scene != null && scene.DragEnabled) {
			let layer = scene.DragLayer;
			let m = rjs._mouse.get(layer, layer.scale, vec2(0, 0));
			let p = ex.startPoint;
			let c = ex.startCam;
			let delta = vec2(m.x-p.x, m.y-p.y);
			rjs.currentCamera.pos.x = c.x-delta.x;
			rjs.currentCamera.pos.y = c.y-delta.y;
			if(rjs.currentCamera.pos.x < scene.DragZoomHBorders.x) {
				p.x -= rjs.currentCamera.pos.x-scene.DragZoomHBorders.x;
				rjs.currentCamera.pos.x = scene.DragZoomHBorders.x;
			}
			if(rjs.currentCamera.pos.x > scene.DragZoomHBorders.y) {
				p.x -= rjs.currentCamera.pos.x-scene.DragZoomHBorders.y;
				rjs.currentCamera.pos.x = scene.DragZoomHBorders.y;
			}
			if(rjs.currentCamera.pos.y < scene.DragZoomVBorders.x) {
				p.y -= rjs.currentCamera.pos.y-scene.DragZoomHBorders.x;
				rjs.currentCamera.pos.y = scene.DragZoomVBorders.x;
			}
			if(rjs.currentCamera.pos.y > scene.DragZoomVBorders.y) {
				p.y -= rjs.currentCamera.pos.y-scene.DragZoomHBorders.y;
				rjs.currentCamera.pos.y = scene.DragZoomVBorders.y;
			}
		}
		if(scene != null && scene.DragZoom) {
			let layers = scene.DragZoomLayers;
			for(let i in layers) {
				let layer = layers[i];
				if(scene.DragZoomTarget > scene.DragZoomMaxScroll)
					scene.DragZoomTarget = scene.DragZoomMaxScroll;
				if(scene.DragZoomTarget < scene.DragZoomMinScroll)
					scene.DragZoomTarget = scene.DragZoomMinScroll;
				if(layer.scale.x != scene.DragZoomTarget || layer.scale.y != scene.DragZoomTarget) {
					scene.DragZoomFunction(layer, scene.DragZoomTarget);
				}
			}
		}
	};

	const loop = new rjs.GameLoop(() => {
		if(ex.AutoLoop)
			ex.loop();
	});

});
        this.params = [];
        this.exports = undefined;
        this.global = {};
        this.pack = pack;
        this.code = code;
        this.engine = rjs;
        this.fnc = this.code;
        const res = this.fnc(this);
        this.res = typeof res != 'undefined' ? res : null;
        rjs.plugins[this.pack.name] = this;
        for(let i in this.global) {
            window[i] = this.global[i];
        }
        return this.exports;
    })("drag");
		Input = new (function () {
        const pack = JSON.parse(`{
	"name": "input",
	"version": "1.0.0",
	"main": "plugin.js",
	"settings": {
		"size": [400, 50],
		"font": "Arial",
		"fontSize": 30,
		"styles": {
			"text-align": "center",
			"background": "white"
		}
	}
}`);
        const code = ((plugin) => {

	
	const exports = plugin.exports = {}; // интерфейс плагина
	const rjs = plugin.engine; // ссылка на движок
	const pack = plugin.pack; // объект загруженный из package.json
	const sets = plugin.pack.settings; // настройки плагина
	const params = plugin.params; // параметры подключения плагина
	const global = plugin.global; // свойства этого объекта после инициализации плагина станут глобальными
	const code = plugin.code; // функция из файла plugin.js
	
	exports.createInputDOM = function () {

		const DOM = document.createElement('input');
		rjs.eventDetector.appendChild(DOM);

		return DOM;

	};

	exports.updateInputDOM = function (input) {

		input.DOM.style.zIndex = 100;
		input.DOM.style.position = "absolute";
		const prop = rjs.con_width / rjs.client.w;
		const x = (rjs.client.w/2+input.pos.x-input.size.x/2)*prop;
		const y = (rjs.client.h/2+input.pos.y-input.size.y/2)*prop;
		const w = input.size.x*prop;
		const h = input.size.y*prop;
		input.DOM.style.left = x+"px";
		input.DOM.style.top = y+"px";
		input.DOM.style.width = w+"px";
		input.DOM.style.height = h+"px";
		input.DOM.style.padding = "0px";
		input.DOM.style.fontFamily = input.font;
		input.DOM.style.fontSize = input.fontSize*prop+"px";
		input.DOM.style.color = input.color.toStringCSS();
		for(let i in input.styles) {
			input.DOM.style[i] = input.styles[i];
		}

	};

	exports.defaultCSS = function () {
		return sets.styles;
	};

	exports.inputs = [];

	exports.Input = function ({ layer, pos = vec2(0, 0), size = vec2(sets.size[0], sets.size[1]), font = sets.font, fontSize = sets.fontSize, styles = {}, color = rgba(0, 0, 0), texture = null, bg_color = null } = {}) {

		this.layer = layer;
		this.pos = pos;
		this.size = size;
		this.font = font;
		this.color = color;
		this.bg_color = bg_color;
		this.fontSize = fontSize;
		this.texture = texture;
		this.styles = exports.defaultCSS();
		this.sprite = new rjs.Sprite({
			pos: this.pos,
			size: this.size,
			texture: this.texture,
			color: this.bg_color,
			layer: this.layer
		});
		for(let i in styles) {
			this.styles[i] = styles[i];
		}
		this.id = exports.inputs.length;
		this.DOM = exports.createInputDOM();
		exports.updateInputDOM(this);

		exports.inputs.push(this);

	};

	exports.Input.prototype.destroy = function () {

		delete exports.inputs[this.id];
		this.DOM.parentNode.removeChild(this.DOM);
		this.sprite.destroy();

	};

	exports.Loop = new rjs.GameLoop(() => {
		for(let i in exports.inputs) {
			exports.updateInputDOM(exports.inputs[i]);
		}	
	});

});
        this.params = [];
        this.exports = undefined;
        this.global = {};
        this.pack = pack;
        this.code = code;
        this.engine = rjs;
        this.fnc = this.code;
        const res = this.fnc(this);
        this.res = typeof res != 'undefined' ? res : null;
        rjs.plugins[this.pack.name] = this;
        for(let i in this.global) {
            window[i] = this.global[i];
        }
        return this.exports;
    })("input");

	}, "Client/");

	// подключение скриптов
	(() => {

	// initialization of mouse and touch
	Mouse = new rjs.Mouse();
	Touch = new rjs.Touch();

})();
	(() => {
	
	// family for tiles
	F_TILES = new rjs.Family();
	// family for all the armies 
	F_ARMIES = new rjs.Family();
	// family for buttons (every clickable thing)
	F_BUTTONS = new rjs.Family();

})();
	(() => {
	
	// loading the shaders for button textures

	FS_PLUS = new rjs.Shader("FRAGMENT", "Sources/glsl/fragment-plus.glsl", "PLUS");
	FS_SOUND = new rjs.Shader("FRAGMENT", "Sources/glsl/fragment-sound.glsl", "SOUND");
	FS_X = new rjs.Shader("FRAGMENT", "Sources/glsl/fragment-x.glsl", "X");
	FS_DOTS = new rjs.Shader("FRAGMENT", "Sources/glsl/fragment-dots.glsl", "DOTS");
	VS_PLUS = new rjs.Shader("VERTEX", "Sources/glsl/vertex-plus.glsl", "PLUS2");

	FS_NOISE = new rjs.Shader("FRAGMENT", "Sources/glsl/fragment-noise.glsl", "DEFAULT2");

	H_DEF = new rjs.Program({
		fragment: FS_NOISE,
		vertex: "DEFAULT",
		id: "DEFAULT"
	});

	H_PLUS = new rjs.Program({
		fragment: FS_PLUS,
		vertex: "DEFAULT",
		id: "PLUS"
	});

	H_PLUS2 = new rjs.Program({
		fragment: FS_PLUS,
		vertex: VS_PLUS,
		id: "PLUS2"
	});

	H_SOUND = new rjs.Program({
		fragment: FS_SOUND,
		vertex: "DEFAULT",
		id: "SOUND"
	});

	H_X = new rjs.Program({
		fragment: FS_X,
		vertex: "DEFAULT",
		id: "X"
	});

	H_DOTS = new rjs.Program({
		fragment: FS_DOTS,
		vertex: "DEFAULT",
		id: "DOTS"
	});

	

})();
	(() => {
	
	// setting up vertices for the hexagons

	let size = 100;
		
	let w = size;
	let h = Math.sqrt(3)/2 * w;
	
	let vert = [
		vec2(w*1/4-w/2, 0-h/2),
		vec2(w*3/4-w/2, 0-h/2),
		vec2(w*4/4-w/2, h/2-h/2),
		vec2(w*3/4-w/2, h-h/2),
		vec2(w*1/4-w/2, h-h/2),
		vec2(w*0/4-w/2, h/2-h/2)
	];

	// tile of the map

	TILE = new rjs.Asset({
		type: "Polygon",
		color: rgb(255, 0, 0),
		vertices: vert,
		families: [F_TILES],
		points: [
			vec2(20, 0)
		]
	});

	// simple text for ui
	UI_TEXT = new rjs.Asset({
		type: "Text",
		font: "Arial",
		text: "Undefined",
		origin: "left-top",
		size: 50,
		color: rgb(0, 0, 0)
	});

	// army asset
	ARMY = new rjs.Asset({
		type: "Sprite",
		size: vec2(30, 30/Math.sqrt(2)),
		color: rgb(0, 0, 255),
		families: [F_ARMIES],
		private: {
			params: null,
			text: null,
			virtual: false,
			remove () {
				// destroys the army
				this.text.destroy();
				this.destroy();
			},
			loop () {
				// update the position of the text attached to army
				this.text.pos.x = this.pos.x;
				this.text.pos.y = this.pos.y-10;
				if(this.params != null)
					this.text.text = String(this.params._amount);
			},
			setPos (tile, moveOthers = true) {
				// set army position on tile
				const arms = [];
				const arm = this;

				// check all armies on the tile
				F_ARMIES.for(army => {

					if(rjs.Collision(tile, army)) {
						if(army.id != arm.id && moveOthers)
							army.setPos(tile, false);
						arms[army.id] = army;
					}

				});

				if(!(arm.id in arms))
					arms[arm.id] = arm;

				// counting up the armies on tile
				const cnt = count(arms);
				
				let c = 0;
				for(let i in arms) {
					if(i == arm.id) {
						// put the army on the center of tile
						if(c == 0 && cnt == 1)
							arm.pos = copy(tile.pos);
						else {
							// put the army on a side of tile
							const a = c/cnt*360;
							arm.pos = tile.getPoint(0, a);
						}
						break;
					}
					c++;
				}

			},
			init () {
				// army amount indicator initialization
				this.text = new rjs.Text({
					pos: vec2(),
					size: 15,
					font: "Arial",
					text: "[][][]",
					layer: this.layer
				});
			}
		}
	});

	// button asset
	QBUTTON = new rjs.Asset({
		type: "Sprite",
		size: vec2(50, 50),
		color: rgb(100, 100, 100),
		families: [F_BUTTONS],
		textOverlap: true,
		private: {
			text: null,
			text_color: rgb(0, 0, 0),
			onclick () {},
			init () {
				if(this.text == null)
					return;
				this.txt = new rjs.Text({
					pos: this.pos,
					size: this.size.y*0.8,
					color: this.text_color,
					font: "Arial",
					text: this.text,
					layer: this.layer
				});

			}
		}
	});

	// KICK = new rjs.Asset({
	// 	type: "Sprite",
	// 	size: vec2(50, 50),
	// 	color: rgb(100, 100, 100),
	// 	families: [F_BUTTONS],
	// 	private: {
	// 		onclick () {}
	// 	}
	// });

	// JOIN = new rjs.Asset({
	// 	type: "Sprite",
	// 	size: vec2(150, 50),
	// 	color: rgb(100, 100, 100),
	// 	families: [F_BUTTONS],
	// 	private: {
	// 		onclick () {}
	// 	}
	// });

	// LIST = new rjs.Asset({
	// 	type: "Sprite",
	// 	size: vec2(100, 50),
	// 	color: rgb(100, 100, 100),
	// 	families: [F_BUTTONS],
	// 	private: {
	// 		onclick () {}
	// 	}
	// });

	// group manage panel elements

	GROUP_TEXT = new rjs.Asset({
		type: "Text",
		size: 30,
		font: "Arial",
		origin: "left-middle",
		colro: rgb(0, 0, 0)
	});

	GROUP_BG = new rjs.Asset({
		type: "Sprite",
		size: vec2(300+10*4, 100+10*2),
		color: rgb(200, 200, 200),
		opacity: 50,
		textOverlap: true,
		origin: vec2((300+10*4)/2, (100+10*2)/2)
	});

	NEW_GROUP = new rjs.Asset({
		type: "Sprite",
		size: vec2(300+10*4, 50),
		color: rgb(100, 100, 100),
		families: [F_BUTTONS],
		origin: vec2((300+10*4)/2, (50)/2),
		program: H_PLUS2,
		textOverlap: true,
		private: {
			onclick () {}
		}
	});

	// alert window asset

	WINDOW = new rjs.Asset({
		type: "Sprite",
		size: vec2(500, 300),
		pos: vec2(0, -rjs.client.h/2+200),
		color: rgba(200, 200, 200, 200),
		textOverlap: true,
		points: [
			vec2(0, -40),
			vec2(0, 30),
			vec2(-100, 100),
			vec2(0, 100),
			vec2(100, 100) // points for buttons, input fields and the text
		],
		private: {
			text: "WARNING!",
			options: {}, // takes the available options (like ok/no/...)
			buttons: {},
			input: false,
			close () {
				// closing the window
				this.destroy();
				this.txt.destroy();
				for(let i in this.buttons) {
					this.buttons[i].destroy();
					this.buttons[i].txt.destroy();
				}
				if(this.input)
					this.input.destroy();
				UI._alert = null;
				rjs.timeStep = 1;
				return null;
			},
			init () {
				// getting the width of the text object
				const lines = this.text.split("\n");
				let max = 0;

				for(let i in lines) {
					max = Math.max(lines[i].length, max);
				}
				
				// increase the size of window if necessary
				this.size.x = Math.max(max*25, this.size.x);

				rjs.timeStep = 0;

				const options = this.options;

				// text initialization
				this.txt = new rjs.Text({
					pos: this.getPoint(0),
					size: 40,
					color: rgb(0, 0, 0),
					font: "Arial",
					layer: this.layer,
					text: this.text
				});

				// options initialization
				const c = count(options);
				let index = 0;

				for (let i in this.options) {

					const point = c == 1 ? 3 : index*2+2;

					// creating the button
					const button = new rjs.Sprite({
						pos: this.getPoint(point),
						layer: this.layer,
						size: vec2(100, 50),
						color: rgb(100, 100, 100),
						families: [F_BUTTONS],
						private: {
							text: i,
							parrent: this,
							onclick () { //jshint ignore:line
								// close the window and execute the option callback
								this.parrent.close();
								options[i](this.parrent);
							},
							init () { //jshint ignore:line
								// button text initialization
								this.txt = new rjs.Text({
									pos: this.pos,
									size: 50,
									color: rgb(255, 255, 255),
									font: "Arial",
									text: this.text,
									layer: this.layer
								});
							}
						}
					});

					this.buttons[i] = button;

					index ++;

				}

				if(this.input) {
					// creating the input field
					this.input = new Input.Input({
						pos: this.getPoint(1),
						layer: this.layer,
						bg_color: rgb(255, 255, 255)
					});
					this.input.DOM.focus();
				}

			}
		}
	});

})();

	// создание сцены "new"
	play_scene = new rjs.Scene({
                init: ((scene) => {
	
	// camera initialization
	play_cam = new rjs.Camera({});

	// layers
	play_bg = new rjs.Layer(scene);
	play_main = new rjs.Layer(scene);
	play_map = new rjs.Layer(scene);
	play_armies = new rjs.Layer(scene);
	play_ui = new rjs.Layer(scene, vec2(0, 0));

	// scene scripts
	MAP = (() => {

    // class initialization
    class MAP {

        // properties containing information about match
        static armies = {};//jshint ignore:line
        static dragArmy = null;//jshint ignore:line
        static select = null;
        static groups = {};
        static friends = {};
        static enemies = {};
        static #_inviteGroup = null;
        static #_inviteVoice = false;
        static #_kickVoice = false;
        static #_kickGroup = null;
        static #_turns = 0;
        static interval = null;

        // updating turn counter
        static get turns () {
            return this._turns;
        }

        static set turns (turns) {
            this._turns = turns;
            tx_turns.text = "Turns: "+turns;
            // change color of inactive armies
            if(turns <= 0) {
                F_ARMIES.for(army => {
                    if(this.getArmyStatus(army.params) == "OWN") {
                        army.opacity = 100;
                        army.filters[10] = rgb(200, 200, 0);
                    }
                });
            }
            else {
                F_ARMIES.for(army => {
                    army.opacity = 100;
                    army.filters[10] = rgb(255, 255, 255);
                });
            }
        }

        // inviting player to the group
        static get inviteGroup () {
            return this._inviteGroup;
        }

        static set inviteGroup (group) {
            this._inviteGroup = group;
            if(group == null)
                tx_invite.render = false;
            else
                tx_invite.render = true;
        }

        // inviting player to the voice chat
        static get inviteVoice () {
            return this._inviteVoice;
        }

        static set inviteVoice (inv) {
            this._inviteVoice = inv;
            tx_voice_invite.render = inv;
        }

        // kcik player from the voice chat
        static get kickVoice () {
            return this._kickVoice;
        }

        static set kickVoice (kick) {
            this._kickVoice = kick;
            tx_voice_kick.render = kick;
        }

        // kcik player from the group
        static get kickGroup () {
            return this._kickGroup;
        }

        static set kickGroup (group) {
            this._kickGroup = group;
            if(group == null)
                tx_kick.render = false;
            else
                tx_kick.render = true;
        }

        // laoding the map
        static load (scene, tiles, map) {

            const sz = 50;
            const w = 100;
            const h = 100*Math.sqrt(3)/2;

            const horiz = w * 3/4;
            const vert = h;

            const mt = map.tiles;

            this.tiles = tiles;
            this.map = map;

            // generating hexagonal map
            for(let i in mt) {
                tiles[i] = {};
                for(let j in mt[i]) {
                    let x = parseFloat(i);
                    let y = parseFloat(j);
                    let pos = vec2(x*horiz, y*vert);
                    let k = Math.random()*0.1+0.9;
                    if(x % 2 == 0)
                        pos.y += vert/2;
                    tiles[i][j] = new TILE({
                        pos: pos,
                        layer: play_map,
                        color: rgb(150*k, 200*k, 150*k),
                        opacity: 80,
                        private: {
                            x: x,
                            y: y
                        }
                    });

                }
            }

        }

        // return tile by position in array
        static getTile (x, y) {
            let res = null;
            F_TILES.for(tile => {
                if(tile.x == x && tile.y == y)
                    res = tile;
            });
            return res;
        }

        // drag and zoom plugin initialization
        static initDrag (scene, layer1, ...layers) {
            Drag.Init(scene, layer1, rjs.MouseUp, rjs.MouseDown);
            Drag.InitZoom(scene, [layer1, ...layers], 1.1, rjs.WheelUp, rjs.WheelDown, (layer, val) => {
                Fade.SetTarget(layer, ['scale.x', 'scale.y'], [val, val], 0.2);
            }, 0.4, 5, vec2(-800, 800), vec2(-800, 800));
        }

        // checks is the tile belong to player
        static tileBelong (tile) {
            const status = this.getStatus(tile.x, tile.y);
            return (
                status == "OWN" ||
                status == "FRIEND"
            );
        }

        // game loop of the match
        static loop () {

            // drag and zoom loop
            Drag.loop();

            this.select = null;

            // moving the army along the mouse
            if(this.dragArmy != null) {
                const m = Mouse.get(this.dragArmy.layer);
                this.dragArmy.pos.x = m.x;
                this.dragArmy.pos.y = m.y;
                // selecting the current tile
                F_TILES.forNearTo(Mouse, tile => {
                    if(rjs.MouseOver(tile)) {
                        let b = false;

                        F_TILES.forNearTo(tile.pos, t => {
                            if(this.tileBelong(t)) {
                                b = true;
                                // t.color = rgb(0,0,0);
                            }
                        }, 100, false);

                        if(b) {
                            this.select = tile;
                        }
                    }
                }, 100);
            }
            // running loop of every army
            F_ARMIES.for(army => {
                army.loop();
            });

        }

        // player initialization
        static initPlayer (player) {
            
            // setting a capital
            const tile = this.getTile(player.capital.x, player.capital.y);
            // creating player nickname on the map
            new rjs.Text({
                pos: tile.pos,
                size: 50,
                font: "Arial",
                text: player.name,
                color: rgba(0, 0, 0, 180),
                layer: tile.layer
            });
            tile.filters[1] = rgb(200, 200, 300);
            // start turn update loop
            this.startInterval();

        }

        // fill tile with color according to the status
        static fillTiles (tiles, status) {

            for(let i in tiles) {
                const tile = this.getTile(tiles[i].x, tiles[i].y);
                if(status == "self")
                    tile.filters[0] = rgb(0, 200, 100);
                if(status == "neutral")
                    tile.filters[0] = rgb(100, 100, 100);
            }

        }

        // update tile (from socket)
        static updateTile (tile) {

            // getting status of tile and setting up its color
            this.map.tiles[tile.pos.x][tile.pos.y] = tile;

            const obj = this.getTile(tile.pos.x, tile.pos.y);
            
            const status = this.getStatus(tile.pos.x, tile.pos.y);
            obj.filters[0] = this.getStatusColor(status);

            if(typeof obj.filters[1] != "undefined")
                delete obj.filters[1];

        }

        // create an army (from socket)
        static initArmy (army, layer) {

            // create a game object
            const obj = this.armies[army.id] = new ARMY({
                pos: copy(this.getTile(army.pos.x, army.pos.y).pos),
                layer: layer,
                private: {
                    params: army
                }
            });

            // paint army with color
            const status = this.getArmyStatus(army);
            obj.color = this.getStatusColor(status);

        }

        // split army by 2
        static splitArmy (army) {

            const a = new ARMY({
                pos: copy(army.pos),
                layer: army.layer,
                private: {
                    params: copy(army.params),
                    virtual: true
                }
            });

            a.params.amount /= 2;
            army.params.amount /= 2;

            return a;

        }

        // update an army (from socket)
        static updateArmy (army, a) {

            a.params = army;
            a.setPos(this.getTile(army.pos.x, army.pos.y));

            const status = this.getArmyStatus(army);
            a.color = this.getStatusColor(status);

        }

        // delete the army
        static deleteArmy (a) {

            a.remove();
            delete this.armies[a.params.id];

        }

        // get the army by its id
        static findArmy (army) {

            if(army.id in this.armies)
                return this.armies[army.id];
            else
                return null;

        }

        // add the group (from socket)
        static addGroup (name, list, enemies, owner, token) {

            this.groups[token] = {
                name: name,
                list: list,
                enemies: enemies,
                owner: owner,
                token: token
            };

            this.updateGroupList();

        }

        // removing the group from list (only for client) by its token
        static removeGroup (token) {

            if(token in this.groups)
                delete this.groups[token];

            this.updateGroupList();

        }

        // get group token by its name
        static getToken (groupName) {

            for(let i in this.groups) {
                if(this.groups[i].name == groupName)
                    return this.groups[i].token;
            }

            return null;

        }

        // update list of groups and controll buttons
        static updateGroupList () {

            UI.Group.removeAll();

            let t = "Groups:";

            for(let i in this.groups) {
                t += "\n  "+this.groups[i].name;
                new UI.Group(this.groups[i].name, this.groups[i].token);
            }

            tx_groups.text = t;

        }

        // returns the status of a tile with coordinates x y
        static getStatus (x, y) {
            const tile = this.map.tiles[x][y];
            if(tile.owner == "")
                return "FREE";
            if(tile.owner == USERNAME)
                return "OWN";
            if(tile.owner in this.friends)
                return "FRIEND";
            if(tile.owner in this.enemies)
                return "ENEMY"
            return "NEUTRAL";
        }

        // returns the status of given army
        static getArmyStatus (army) {
            if(army.player == USERNAME)
                return "OWN";
            if(army.player in this.friends)
                return "FRIEND";
            if(army.player in this.enemies)
                return "ENEMY"
            return "NEUTRAL";
        }

        // returns the color according to a given status
        static getStatusColor (status) {

            let res = null;
            
            switch(status) {

                case "OWN":
                    res = rgb(0, 200, 100);
                    break;
                case "FRIEND":
                    res = rgb(200, 200, 50);
                    break;
                case "ENEMY":
                    res = rgb(200, 100, 0);
                    break;
                case "NEUTRAL":
                    res = rgb(100, 100, 100);
                    break;
                default:
                    res = rgb(255, 255, 255);

            }

            return res;

        }

        // update colors of the tiles on battlemap according to its status
        static updateGroups (friends, enemies) {

            this.friends = friends;
            this.enemies = enemies;

            for(let i in this.map.tiles) {

                for(let j in this.map.tiles[i]) {

                    const tile = this.map.tiles[i][j];
                    const status = this.getStatus(i, j);
                    this.getTile(tile.pos.x, tile.pos.y).filters[0] = this.getStatusColor(status);

                }

            }

        }

        // start the turn loop
        static startInterval () {

            if(this.interval != null) {
                clearInterval(this.interval);
                this.interval = null;
            }

            this.turns = 0;

            this.interval = setInterval(() => {
                if(GAME_STARTED)
                    this.turns ++;
            }, 5000);

        }

        constructor () {

        }

    }

    // script returns MAP
    return MAP;

})();
	UI = (() => {

    // group interface class
    class Group {

        static list = {}; // jshint ignore:line

        // removing all the group interfaces
        static removeAll () {

            for(let i in this.list) {

                const group = this.list[i];
                group.invite.destroy();
                group.join.destroy();
                group.leave.destroy();
                group.info.destroy();
                group.kick.destroy();
                group.text.destroy();
                group.bg.destroy();

            }

            this.list = {};

        }

        constructor (name, token) {

            const c = count(this.constructor.list);
            const m = 10;

            const offset = (m*2+100)*c+50;
            const s = 50;

            // generating background and buttons for the group management

            this.bg = new GROUP_BG({
                pos: vec2(rjs.client.w/2, rjs.client.h/2-offset),
                layer: UI.layer,
                private: {
                    group: this
                }
            });

            // generate buttons
            
            this.invite = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*5+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_PLUS,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // invite player to the group
                        MAP.inviteGroup = this.group;
                    }
                }
            });

            this.kick = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*4+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_X,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // kick the player from the group
                        const group = MAP.groups[this.group.token];
                        if(group.owner == USERNAME)
                            MAP.kickGroup = this.group;
                    }
                }
            });

            this.join = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*3+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_SOUND,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // join voice channel of the group
                        socket.emit("ds-join", this.group.token);
                    }
                }
            });

            this.info = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*2+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_DOTS,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // get list of the players
                        const list = MAP.groups[this.group.token].list;
                        let text = "";
                        for(let i in list) {
                            if(list[i] != null)
                                text += list[i]+"\n";
                        }
                        // call a pop-up window
                        UI.alert(text);
                    }
                }
            });

            this.leave = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*1+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_X,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // leave the group
                        const group = this.group.name;
                        if(group == null || group == "")
                            return;
                        const token = MAP.getToken(group);

                        socket.emit("leave-group", token);
                    }
                }
            });

            // group name

            this.text = new GROUP_TEXT({
                pos: vec2(rjs.client.w/2-50*2-75*2-25*2-m*3, rjs.client.h/2-70-m-offset),
                text: name,
                layer: UI.layer,
                private: {
                    group: this
                }
            });

            this.name = name;
            this.token = token;

            this.constructor.list[token] = this;

        }

    }

    // UI class

    class UI {

        #_id = 0;// jshint ignore:line

        // global properties
        static Group = Group; // reference to Group class
        static layer = 0; // layer of the UI
        static _alert = null; // current alert window

        static click () {

            // click event listener for UI

            if(MAP.inviteGroup != null) {

                F_TILES.for(tile => {

                    if(rjs.MouseOver(tile)) {

                        // invite player to the group
                        const t = MAP.map.tiles[tile.x][tile.y];

                        const status = MAP.getStatus(tile.x, tile.y);

                        if(status == "NEUTRAL" || status == "ENEMY") {
                            const token = MAP.groups[MAP.inviteGroup.token].token;
                            const player = t.owner;
                            if(typeof token == "undefined")
                                return;
                            MAP.inviteGroup = null;
		                    socket.emit("invite-group", [token, player]);
                        }

                    }

                });

            }
            else if(MAP.inviteVoice) {

                F_TILES.for(tile => {

                    if(rjs.MouseOver(tile)) {

                        // invite player to the voice channel

                        const t = MAP.map.tiles[tile.x][tile.y];

                        const status = MAP.getStatus(tile.x, tile.y);

                        if(status != "FREE" && status != "OWN") {
                            const player = t.owner;
                            MAP.inviteVoice = false;
		                    socket.emit("voice-invite", player);
                        }

                    }

                });

            }
            else if(MAP.kickVoice) {

                F_TILES.for(tile => {

                    if(rjs.MouseOver(tile)) {

                        // kick the player from the voice

                        const t = MAP.map.tiles[tile.x][tile.y];

                        const status = MAP.getStatus(tile.x, tile.y);

                        if(status != "FREE" && status != "OWN") {
                            const player = t.owner;
                            MAP.kickVoice = false;
		                    socket.emit("voice-kick", player);
                        }

                    }

                });

            }
            else if(MAP.kickGroup != null) {

                F_TILES.for(tile => {

                    if(rjs.MouseOver(tile)) {

                        // kick the player from the group

                        const t = MAP.map.tiles[tile.x][tile.y];

                        const status = MAP.getStatus(tile.x, tile.y);

                        if(status != "FREE" && status != "OWN") {
                            const player = t.owner;
		                    socket.emit("kick-group", [MAP.kickGroup.token, player]);
                            MAP.kickGroup = null;
                        }

                    }

                });

            }
            else {

                if(DEFEATED && (this._alert == null || this._alert.text != "Defeat!"))
                    return;

                F_BUTTONS.for(button => {
                    // call click event of selected button
                    if(rjs.MouseOver(button) && button.scene == rjs.currentScene) {
                        button.onclick();
                    }
    
                });    
            }
        }

        static get id () {
            return this._id;
        }

        static init (layer) {
            this.layer = layer;
            // "new group" button
            this.new_group = new NEW_GROUP({
                pos: vec2(rjs.client.w/2, rjs.client.h/2),
                layer: this.layer,
                private: {
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // pop-up window appears
                        UI.alert("Create a group\nEnter the group name:", {
                            no () {

                            },
                            ok (msg) {
                                const name = msg.input.DOM.value;
                                if(name == null || name == "")
                                    return;
                                socket.emit("new-group", name);
                            }
                        }, true);
                    }
                }
            });
            // invite to voice button
            this.invite = new QBUTTON({
                pos: vec2(-rjs.client.w/2+60, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_PLUS,
                private: {
                    onclick () {
                        // invite player to the voice
                        if(!GAME_STARTED)
                            return;
                        MAP.inviteVoice = true;
                    }
                }
            });
            // kick player from the voice channel (button)
            this.kick = new QBUTTON({
                pos: vec2(-rjs.client.w/2+170, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_X,
                private: {
                    onclick () {
                        // kick player from voice chat
                        if(!GAME_STARTED)
                            return;
                        MAP.kickVoice = true;
                    }
                }
            });
            // leave private voice
            this.leave = new QBUTTON({
                pos: vec2(-rjs.client.w/2+280, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_X,
                private: {
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        socket.emit("leave-voice", true);
                    }
                }
            });
            // join common voice
            this.common = new QBUTTON({
                pos: vec2(-rjs.client.w/2+390, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_SOUND,
                private: {
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        socket.emit("common-voice", true);
                    }
                }
            });
        }

        // call the pop-up window

        static alert (text, options = {ok () {}}, input = false, layer = this.layer) {

            if(this._alert != null)
                this._alert.close();

            this._alert = new WINDOW({
                layer: layer,
                private: {
                    // parameters of window
                    options: options,
                    input: input,
                    text: text
                }
            });

        }
        
    }

    // UI class interface
    return UI;

})();

	// UI initialization
	UI.init(play_ui);

	DEFEATED = false;

	tiles = {};

	// text message initialization
	tx_invite = new rjs.Text({
		pos: vec2(0, -rjs.client.h/2+300),
		size: 100,
		font: "Arial",
		color: rgb(0, 0, 0),
		text: "Choose player to invite...\n[ESC] to cancel",
		render: false,
		layer: play_ui
	});

	tx_voice_invite = new rjs.Text({
		pos: vec2(0, -rjs.client.h/2+300),
		size: 100,
		font: "Arial",
		color: rgb(0, 0, 0),
		text: "Choose player to invite...\n[ESC] to cancel",
		render: false,
		layer: play_ui
	});

	tx_voice_kick = new rjs.Text({
		pos: vec2(0, -rjs.client.h/2+300),
		size: 100,
		font: "Arial",
		color: rgb(0, 0, 0),
		text: "Choose player to kick...\n[ESC] to cancel",
		render: false,
		layer: play_ui
	});

	tx_kick = new rjs.Text({
		pos: vec2(0, -rjs.client.h/2+300),
		size: 100,
		font: "Arial",
		color: rgb(0, 0, 0),
		text: "Choose player to kick...\n[ESC] to cancel",
		render: false,
		layer: play_ui
	});

	// username

	tx_username = new UI_TEXT({
		pos: vec2(rjs.client.w/2-10, -rjs.client.h/2+10),
		text: "",
		origin: "right-top",
		layer: play_ui
	});

	// room title

	tx_room = new UI_TEXT({
		pos: vec2(rjs.client.w/2-10, -rjs.client.h/2+10+50),
		text: "",
		origin: "right-top",
		layer: play_ui
	});

	// tx_pop = new UI_TEXT({
	// 	pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10),
	// 	text: "Population: NaN",
	// 	layer: play_ui
	// });

	// tx_army = new UI_TEXT({
	// 	pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10+50),
	// 	text: "Army: NaN",
	// 	layer: play_ui
	// });

	// tx_level = new UI_TEXT({
	// 	pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10+100),
	// 	text: "Level: 1",
	// 	layer: play_ui
	// });

	// tx_coins = new UI_TEXT({
	// 	pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10+150),
	// 	text: "Coins: 0$",
	// 	layer: play_ui
	// });

	// ui indicators

	tx_turns = new UI_TEXT({
		pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10),
		text: "Turns: 0",
		layer: play_ui
	});

	tx_groups = new UI_TEXT({
		pos: vec2(-rjs.client.w/2, -rjs.client.h/2+60),
		text: "Groups:",
		layer: play_ui
	});

	tx_voice_list = new UI_TEXT({
		pos: vec2(-rjs.client.w/2+10, rjs.client.h/2-120),
		text: "",
		origin: "left-bottom",
		layer: play_ui
	});

	// drag and drop + zoom initialization

	MAP.initDrag(scene, play_map, play_main, play_armies);

	// const sp = new rjs.KeyDown(e => {
	// 	if(DEFEATED)
	// 		return;
	// 	socket.emit("NEW_ARMY", true);
	// }, 32, true, scene);

	// const kd = new rjs.KeyDown(e => {
	// 	console.log(e.keyCode);
	// }, null, true, scene);

	// 65 71 73

	// const grp = new rjs.KeyDown(e => {
	// 	if(DEFEATED)
	// 		return;
	// 	const name = prompt("Enter the group name:");
	// 	if(name == null || name == "")
	// 		return;
	// 	socket.emit("new-group", name);
	// }, 71, true, scene);

	// const inv = new rjs.KeyDown(e => {
	// 	if(DEFEATED)
	// 		return;
	// 	const group = prompt("Enter the group name:");
	// 	if(group == null || group == "")
	// 		return;
	// 	const token = MAP.getToken(group);
	// 	if(token == null)
	// 		return;
	// 	const player = prompt("Enter the player name:");
	// 	if(player == null || player == "")
	// 		return;
	// 	socket.emit("invite-group", [token, player]);
	// }, 73, true, scene);

	// const inv = new rjs.KeyDown(e => {

	// 	const name = prompt("Enter the player name:");
	// 	if(name == null || name == "")
	// 		return;

	// 	socket.emit("voice-invite", name);

	// }, 73, true, scene);

	// const wr = new rjs.KeyDown(e => {

	// 	if(DEFEATED)
	// 		return;
		
	// 	const name = prompt("Enter the player name:");

	// 	if(name == null || name == "")
	// 		return;

	// 	socket.emit("war", name);

	// }, 87, true, scene);

	// const pc = new rjs.KeyDown(e => {

	// 	if(DEFEATED)
	// 		return;
		
	// 	const name = prompt("Enter the player name:");

	// 	if(name == null || name == "")
	// 		return;

	// 	socket.emit("ask-for-peace", name);

	// }, 80, true, scene);

	// const lv = new rjs.KeyDown(e => {

	// 	if(DEFEATED)
	// 		return;
		
	// 	const group = prompt("Enter the group name:");
	// 	if(group == null || group == "")
	// 		return;
	// 	const token = MAP.getToken(group);

	// 	socket.emit("leave-group", token);

	// }, 76, true, scene);

	// escape button

	const ic = new rjs.KeyDown(e => {

		MAP.inviteGroup = null;
		MAP.inviteVoice = false;
		MAP.kickVoice = false;
		MAP.kickGroup = null;

	}, 27, true, scene);

	// enter button

	const enter = new rjs.KeyDown(e => {

		if(UI._alert != null && "ok" in UI._alert.buttons)
			UI._alert.buttons.ok.onclick();

	}, 13, true, scene);

	// click event
	const click = new rjs.Click(e => {

		if(DEFEATED)
			return;

		// UI click listener call
		UI.click();

		if(MAP.dragArmy == null) {
			if(MAP.turns > 0) {
				F_TILES.for(tile => {
					if(!rjs.MouseOver(tile))
						return;
					F_ARMIES.for(army => {
						// drag the army
						if(army.params.player == USERNAME && rjs.Collision(army, tile)) {
							MAP.dragArmy = army;
							MAP.turns --;
						}
					});
				});
			}
		}
		else {

			if(MAP.select == null) {
				MAP.dragArmy.pos = copy(MAP.getTile(MAP.dragArmy.params.pos.x, MAP.dragArmy.params.pos.y).pos);
				MAP.dragArmy = null;
			}
			else {
				if(!MAP.dragArmy.virtual) {
					MAP.dragArmy.setPos(MAP.select);
					MAP.dragArmy.params.pos = vec2(MAP.select.x, MAP.select.y);
					socket.emit("army-move", {
						id: MAP.dragArmy.params.id,
						pos: MAP.dragArmy.params.pos
					});
				}
				else {
					MAP.dragArmy.remove();
					socket.emit("army-split", {
						id: MAP.dragArmy.params.id,
						pos: vec2(MAP.select.x, MAP.select.y)
					});
				}
				MAP.dragArmy = null;
			}

		}

	}, true, scene);

	// right click event

	const rclick = new rjs.RightClick(e => {

		if(DEFEATED)
			return;

		if(MAP.dragArmy == null) {
			if(MAP.turns > 0) {
				F_TILES.for(tile => {
					if(!rjs.MouseOver(tile))
						return;
					F_ARMIES.for(army => {
						if(army.params.player == USERNAME && rjs.Collision(army, tile) && army.params._amount > 2) {
							MAP.dragArmy = MAP.splitArmy(army);
							MAP.turns --;
						}
					});
				});
			}
		}
		else {

			if(MAP.select == null) {
				// MAP.dragArmy.pos = copy(MAP.getTile(MAP.dragArmy.params.pos.x, MAP.dragArmy.params.pos.y).pos);
				MAP.dragArmy = null;
			}
			else {
				if(!MAP.dragArmy.virtual) {
					MAP.dragArmy.setPos(MAP.select);
					MAP.dragArmy.params.pos = vec2(MAP.select.x, MAP.select.y);
					socket.emit("army-move", {
						id: MAP.dragArmy.params.id,
						pos: MAP.dragArmy.params.pos
					});
				}
				else {
					MAP.dragArmy.remove();
					socket.emit("army-split", {
						id: MAP.dragArmy.params.id,
						pos: vec2(MAP.select.x, MAP.select.y)
					});
				}
				MAP.dragArmy = null;
			}

		}

	});

	const loop = new rjs.GameLoop(() => {

		// map game loop

		MAP.loop();

	}, true, scene);

}),
                start: ((scene, params) => {
	
	// скрипт запускается после перехода на сцену
	// params -  набор параметров запуска сцены
	
	// переключение на камеру "new_cam"
	play_cam.set();

	ROOM_REQUEST();

}),
                end: ((scene, params) => {
	
	

})
            }, 'play', []);
	menu_scene = new rjs.Scene({
                init: ((scene) => {

	menu_cam = new rjs.Camera({});

	menu_text = new rjs.Layer(scene);
	menu_bg = new rjs.Layer(scene);
	menu_buttons = new rjs.Layer(scene);

	// sockets script
	SOCKET_SCRIPT = (() => {

    // socket io start
    socket = io();
    // initializing global variables
    USERNAME = null;
    ROOM = null;
    PASS = null;
    GAME_STARTED = false;

    let login = 0;
    // 0 - not logged in
    // 1 - logged in
    // 2 - joined the room
    
    // let vrf = false;

    // // generating verification code
    // const code = String(Math.round(Math.random()*10000));
    // socket.emit("code", code);

    ROOM_REQUEST = () => {
        setInterval(() => {
            if(login == 1 && (ROOM == null || ROOM == "")) {
                if(UI._alert == null) {
                    // room title window
                    UI.alert("Enter your room name:", {
                        ok (msg) {
                            tx_room.text = ROOM = msg.input.DOM.value;
                        }
                    }, true);
                }
            }
            else if(login == 1 && (PASS == null || PASS == "")) {
                if(UI._alert == null) {
                    // room password window
                    UI.alert("Enter your room password:", {
                        ok (msg) {
                            PASS = msg.input.DOM.value;
                        }
                    }, true);
                }
            }
            else if(login == 1) {
                login = 2;
                // joining the room
                socket.emit("join", [ROOM, PASS]);
            }
        }, 300);
    }

    // // verification listener
    // socket.on("verify", (name) => {
    //     UI.alert("Verified! Your name is\n"+name);
    //     vrf = true;
    //     socket.emit("login", USERNAME);
    // });
    
    // socket.on("login", msg => {
        
    //     login = 1;
        
    // });

    socket.on("map", map => {
        // load battlemap
        MAP.load(play_scene, tiles, map);
    });

    socket.on("player", player => {
        
        // the game starts
        GAME_STARTED = true;
        MAP.initPlayer(player);

    });

    socket.on("army-update", army => {

        // army gets created or just updates
        const a = MAP.findArmy(army);
        if(a == null)
            MAP.initArmy(army, play_armies);
        else
            MAP.updateArmy(army, a);

    });

    socket.on("army-delete", id => {

        // army removing

        const a = MAP.findArmy({id:id});

        if(a != null) {
            MAP.deleteArmy(a);
        }

    });

    socket.on("update-tile", tile => {
        // update tile (from socket)
        MAP.updateTile(tile);
    });

    socket.on("join-group", ({name, list, enemies, owner, token}) => {
        // accepting the invitation to the group
        MAP.addGroup(name, list, enemies, owner, token);
        
    });

    socket.on("leave-group", token => {
        // leaving the group
        MAP.removeGroup(token);
        
    });

    socket.on("invite-group", ({name, list, enemies, owner, token}) => {
        // invite player to group
        UI.alert(`Do you want to join group "${name}"?\nMembers: ${list}\nOwner: ${owner}`, {
            no () {
                
            },
            ok () {
                socket.emit("join-group", token);
            }
        });
        
    });

    socket.on("update-groups", ({friends, enemies}) => {
        // update list og friends and enemies and update their tiles color
        MAP.updateGroups(friends, enemies);

    });

    socket.on("ask-for-peace", name => {

        // peace offer to the player
        const res = confirm(`Player ${name} wants to make peace with you.`);

        if(res)
            socket.emit("peace", name);

    });

    socket.on("defeat", name => {

        // now the player actually is f**n looser!
        UI.alert("Defeat!");

        DEFEATED = true;
        GAME_STARTED = false;

    });

    socket.on("reload", () => {

        // reload the page by server command
        window.location.reload();

    });

    socket.on("voice-invite", name => {

        // voice invitation
        UI.alert("Player "+name+" invites you to a conference.\nAccept?", {
            no () {

            },
            ok () {
                socket.emit("voice-join", name);
            }
        });
            

    });

    socket.on("group-list", ({ list, token }) => {

        // update the list of groups
        const group = MAP.groups[token];

        if(typeof group == "undefined")
            return;
        
        group.list = list;

    });

    socket.on("voice-list", list => {

        // update the list of players in current voice channel
        tx_voice_list.text = list.join("\n");
        
    });

    function verifyCode (code) {
        UI.alert("Type the code "+code+" into a Discord channel", {
            ok () {
                verifyCode(code);
            }
        }, false, menu_buttons);
    }

    socket.on("verify-code", code => {

        verifyCode(code);

    });

    socket.on("verify", name => {

        UI.alert("Your account attached to "+name, { ok () {} }, false, menu_buttons);

    });

    socket.on("login", () => {
        UI.alert("Logged in successfully! ", { ok () {} }, false, menu_buttons);
        login = 1;
        login_button.txt.destroy();
        login_button = login_button.destroy();
        localStorage.USERNAME = USERNAME;
        localStorage.PASSWORD = PASSWORD;
        const play = new QBUTTON({
            pos: vec2(0, 0),
            size: vec2(500, 80),
            layer: menu_buttons,
            private: {
                text: "Play",
                text_color: rgb(255, 255, 255),
                onclick () {
                    if(UI._alert == null)
                        socket.emit("PLAY", true);
                }
            }
        });
        const logout = new QBUTTON({
            pos: vec2(0, 200),
            size: vec2(500, 80),
            layer: menu_buttons,
            private: {
                text: "Sign out",
                text_color: rgb(255, 255, 255),
                onclick () {
                    try {
                        delete localStorage.USERNAME;
                        delete localStorage.PASSWORD;
                    } catch (err) {}
                    window.location.reload();
                }
            }
        });
    });

    socket.on("not-in-voice", () => {
        UI.alert("Join voice channel first!", { ok () {} }, false, menu_buttons);
    });
    
    socket.on("PLAY", () => {
        play_scene.set();
    });

    function callRoomMaxPlayers (password) {
        UI.alert("Set amount of players (2-10):", {
            ok (msg) {
                const str = msg.input.DOM.value;
                const flt = parseFloat(str);
                if(flt.toString() == "NaN")
                    return callRoomMaxPlayers(password);
                if(flt > 10)
                    return callRoomMaxPlayers(password);
                if(flt < 2)
                    return callRoomMaxPlayers(password);
                socket.emit("room-max-players", [flt, password]);
            }
        }, true);
    }

    socket.on("room-max-players", (password) => {

        callRoomMaxPlayers(password);

    });

}
);

	PASSWORD = null;

	login_button = new QBUTTON({
		pos: vec2(0, 0),
		size: vec2(500, 80),
		layer: menu_buttons,
		private: {
			text: "Login",
			text_color: rgb(255, 255, 255),
			onclick () {
				if(UI._alert != null)
					return;
				if("USERNAME" in localStorage && "PASSWORD" in localStorage && localStorage.USERNAME != "null" && localStorage.PASSWORD != "null") {
					tx_username.text = USERNAME = localStorage.USERNAME;
					PASSWORD = localStorage.PASSWORD;
					return socket.emit("LOGIN", [USERNAME, PASSWORD]);
				}
				UI.alert("Username", {
					ok (msg) {
						const name = USERNAME = tx_username.text = msg.input.DOM.value; //jshint ignore:line
						if(name == "")
							return;
						UI.alert("Password", {
							ok (msg2) {
								const pass = PASSWORD = msg2.input.DOM.value;  //jshint ignore:line
								if(pass == "")
									return;
								socket.emit("LOGIN", [name, pass]);
							}
						}, true, menu_buttons);
						UI._alert.input.DOM.type = "password";
					}
				}, true, menu_buttons); 
			}
		}
	});

	discord_button = new QBUTTON({
		pos: vec2(0, 100),
		size: vec2(500, 80),
		layer: menu_buttons,
		private: {
			text: "Join our Discord",
			text_color: rgb(255, 255, 255),
			onclick () {
				if(UI._alert != null)
					return;
				window.open("https://discord.gg/HScPM7KfWj");
			}
		}
	});

	new rjs.Sprite({
		pos: vec2(),
		size: vec2(rjs.client.w, rjs.client.h),
		color: rgb(100, 120, 50),
		opacity: 150,
		layer: menu_bg
	});

	new rjs.Text({
		pos: vec2(-rjs.client.w/2+10, rjs.client.h/2-10),
		size: 30,
		font: "Arial",
		color: rgb(50, 50, 150),
		text: "Lord ØST © 2021",
		origin: "left-bottom",
		layer: menu_text
	});

	new rjs.Text({
		pos: vec2(rjs.client.w/2-10, rjs.client.h/2-10),
		size: 30,
		font: "Arial",
		color: rgb(50, 50, 150),
		text: "Beta-v1.1\n[Brackeys GameJam 2020-1]",
		origin: "right-bottom",
		layer: menu_text
	});

	const title = new rjs.Text({
		pos: vec2(0, -200),
		size: 100,
		color: rgb(255, 0, 0),
		font: "Arial",
		text: "MisConflict",
		layer: menu_text
	});

	const click = new rjs.Click(e => {

		UI.click();

	});

	const loop = new rjs.GameLoop(() => {

		// title.pos.x = Mouse.x;
		// title.pos.y = Mouse.y;

	});

}),
                start: ((scene, params) => {
	
	// скрипт запускается после перехода на сцену
	// params -  набор параметров запуска сцены
	
	// переключение на камеру "new_cam"
	menu_cam.set();

	SOCKET_SCRIPT();

	if("USERNAME" in localStorage && "PASSWORD" in localStorage && localStorage.USERNAME != "null" && localStorage.PASSWORD != "null") {
		tx_username.text = USERNAME = localStorage.USERNAME;
		PASSWORD = localStorage.PASSWORD;
		socket.emit("LOGIN", [USERNAME, PASSWORD]);
	}
}),
                end: ((scene, params) => {
	
	

})
            }, 'menu', []);

	// переход на сцену "new"
	menu_scene.set();

});
}