(plugin) => {

	const ex = plugin.exports = {};
	const rjs = plugin.engine;
	const sets = plugin.pack.settings;

	ex.drag = false;
	ex._drag = false;
	ex.startPoint = vec2(null, null);
	ex.startCam = vec2(null, null);
	ex.AutoLoop = sets.autoloop;

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

	ex.InitZoom = function (scene, layers = [], step = 1.1, scrollUpEvent = rjs.WheelUp, scrollDownEvent = rjs.WheelDown, fnc = ex.Zoom) {
		scene.DragZoom = true;
		scene.DragZoomLayers = layers;
		scene.DragZoomStep = step;
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
		}
		if(scene != null && scene.DragZoom) {
			let layers = scene.DragZoomLayers;
			for(let i in layers) {
				let layer = layers[i];
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

}