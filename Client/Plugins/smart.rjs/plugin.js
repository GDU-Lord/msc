/* jshint -W069 */
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

	ex.Scene = function (name, ...params) {
		return new rjs.Scene({
			init: require(config['scene_path']+name+'/init.js'),
			start: require(config['scene_path']+name+'/start.js'),
			end: require(config['scene_path']+name+'/end.js')
		}, name, ...params);
	};

	ex.Script = function (src) {
		return require(config['script_path']+src, 'js');
	};

	ex.JSON = function (src) {
		return require(config['json_path']+src, 'json');
	};

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


}