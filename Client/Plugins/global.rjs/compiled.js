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

}