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