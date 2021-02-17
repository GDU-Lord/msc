/* jshint -W069*/
const ex = module.exports;
const config = new Config(fs.readFileSync("smart.json"));

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

ex.Scene = function (name, paramsText = "[]") {
    return `rjs.Scene({
                init: require('${config['scene_path']+name}'+'/init.js'),
                start: require('${config['scene_path']+name}'+'/start.js'),
                end: require('${config['scene_path']+name}'+'/end.js')
            }, '${name}', ${paramsText})`;
};

ex.Script = function (src) {
    return `require('${config['script_path']+src}', 'js')`;
};

ex.JSON = function (src) {
    return `require('${config['json_path']+src}', 'json')`;
};