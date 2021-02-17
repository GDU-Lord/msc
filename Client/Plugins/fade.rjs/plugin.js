(plugin) => {

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




}