(plugin) => {

	
	const exports = plugin.exports = {}; // интерфейс плагина
	const rjs = plugin.engine; // ссылка на движок
	const pack = plugin.pack; // объект загруженный из package.json
	const sets = plugin.pack.settings; // настройки плагина
	const params = plugin.params; // параметры подключения плагина
	const global = plugin.global; // свойства этого объекта после инициализации плагина станут глобальными
	const code = plugin.code; // функция из файла plugin.js
	
    // здесь выполняется код плагина

    exports.literas = {};

    const literas = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz_$0123456789";

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
            if((typeof char[index-1] == "undefined" || char[index-1] == " " || char[index-1] == ";" || char[index-1] == "\t" || char[index-1] == "\v" || char[index-1] == "(" || char[index-1] == "{") && char[index] == sets.symbol && char[index+1] in exports.literas) {
               
                res += sets.global;
                readWordMode = true;
                changed = true;
            }
            else
                res += char[index];
        }
        // if(changed)
        //     log(res);
        return res;

    };

    require = rjs._GLOBAL.require = function (src, type = 'JS') {
        type = type.toUpperCase();
        const ajax = new XMLHttpRequest();
        ajax.open('GET', rjs.src(src), false);
        ajax.send();
        const text = ajax.responseText;
        switch(type) {
            case "TEXT" :
                return text;
            case "JS" :
                return eval(exports.Convert(String(text))); // jshint ignore:line
            case "JSON" :
                return JSON.parse(text);
            default:
                error('RectJS.require(): Unknown type of data!');
        }
    };

}