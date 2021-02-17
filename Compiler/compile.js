/* jshint -W061 */
fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "..", "/Client/");
const pluginSRC = "Plugins/";

const GLOBAL = [];

const Smart = require(__dirname + "/smart.js");

const req = function (src, type = 'JS') {
    type = type.toUpperCase();
    const text = String(fs.readFileSync(SRC+src, "utf-8"));
    switch(type) {
        case "TEXT" :
            return '"'+text+'"';
        case "JS" :
            return "("+convert(text)+")";
        case "JSON" :
            return `JSON.parse(\`${text}\`)`;
        default:
            console.error('RectJS.require(): Unknown type of data!');
    }
};

const plugin = function (name, paramsText = "[]") {
    const pack = JSON.parse(fs.readFileSync(SRC+pluginSRC+eval(name)+".rjs/package.json", "utf-8"));
    pack.main = typeof pack.compiled == "undefined" ? pack.main : pack.compiled;
    const pack_main = pack.main;
    return `(function () {
        const pack = require('${pluginSRC}'+${name}+'.rjs/package.json', 'json');
        const code = require('${pluginSRC}'+${name}+'.rjs/${pack_main}');
        this.params = ${paramsText};
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
    })`;
};

const replace = {
    "require": req,
    "Smart.Script": Smart.Script,
    "Smart.JSON": Smart.JSON,
    "Smart.Scene": Smart.Scene,
    "rjs.Plugin": plugin
};

const process = {
    "require": function (text) {
        let res = "";
        const name = "require";
        const index = text.search(name);
        if(index < 0)
            return text;
        const args = getArgs(text, index);
        const a = splitArgs(args, true, true);
        res = text.replace(name+args, replace[name](...a));
        return res;
    },
    "Smart.Script": function (text) {
        let res = "";
        const name = "Smart.Script";
        let found = 0;
        const index = text.search(name);
        if(index < 0)
            return text;
        const args = getArgs(text, index);
        const a = splitArgs(args, true);
        res = text.replace(name+args, replace[name](...a));
        return res;
    },
    "Smart.JSON": function (text) {
        let res = "";
        const name = "Smart.JSON";
        const index = text.search(name);
        if(index < 0)
            return text;
        const args = getArgs(text, index);
        const a = splitArgs(args, true);
        res = text.replace(name+args, replace[name](...a));
        return res;
    },
    "Smart.Scene": function (text) {
        let res = "";
        const name = "Smart.Scene";
        const index = text.search(name);
        if(index < 0)
            return text;
        const args = getArgs(text, index);
        const a = splitArgs(args, true);
        res = text.replace(name+args, replace[name](...a));
        return res;
    },
    "rjs.Plugin": function (text, plugin = false) {
        let res = "";
        const name = "rjs.Plugin";
        const index = text.search(name);
        if(index < 0)
            return text;
        const args = getArgs(text, index);
        const a = splitArgs(args, false);
        res = text.replace(name, replace[name](...a));
        return res;
    }
}

function getArgs (text, index) {
    let args = "";
    let open = 0;
    let started = false;
    for(let i = index+1; i < text.length-1; i ++) {
        if(text[i] == "(") {
            open ++;
            started = true;
        }
        if(open > 0)
            args += text[i];
        if(text[i] == ")")
            open --;
        if(started && open <= 0)
            break;
    }
    return args;
}

function convert (char) {
    let changed = false;
    let res = "";
    let readWordMode = false;
    let word = "";

    const sets = {
        symbol: "$",
        global: ""
    };

    const exports = {};

    exports.literas = {};

    const literas = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz_$0123456789";

    for(let i in literas) {
        exports.literas[literas[i]] = i;
    }

    for(let i in char) {
        const index = parseFloat(i);
        if(readWordMode) {
            if(char[i] in exports.literas)
                word += char[i];
            else {
                GLOBAL.push(word);
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
}

function getFile (src) {
    const text = String(fs.readFileSync(src, "utf-8"));
    return text;
}

function processCode (text) {
    //text = process["rjs.Plugin"](text);
    //text = process["require"](text);
    //text = process["Smart.Scene"](text);
    //text = process["require"](text);
    //text = process["require"](text);
    //text = process["require"](text);
    while (issetAny(text)) {
        for(let i in process) {
            text = process[i](text);
        }
    }
    let globalsInit = "let ";
    for(let i in GLOBAL) {
        globalsInit += GLOBAL[i]+",";
    }
    return "{\n"+globalsInit.substring(0, globalsInit.length-1)+";\n\n"+text+"\n}";
}

function isset (text, name) {
    return text.search(name) != -1;
}

function issetAny (text) {
    let res = false;    
    for(let i in process) {
        res = res || isset(text, i);
    }
    return res;
}

function splitArgs (args, ...ev) {
    args = args.replace("(", "");
    const li = args.lastIndexOf(")");
    args = args.substring(0, li);
    let openB1 = 0;
    let openB2 = 0;
    let openB3 = 0;
    let prevI = 0;
    let res = [];
    for(let i in args) {
        if(args[i] == "(")
            openB1 ++;
        else if(args[i] == "{")
            openB2 ++;
        else if(args[i] == "[")
            openB3 ++;
        else if(args[i] == ")")
            openB1 --;
        else if(args[i] == "}")
            openB2 --;
        else if(args[i] == "]")
            openB3 --;
        if(openB1 <= 0 && openB2 <= 0 && openB3 <= 0 && args[i] == ",") {
            res.push(args.substring(prevI, parseFloat(i)));
            prevI = parseFloat(i)+1;
        }
    }
    res.push(args.substring(prevI, args.length));
    for(let i in res) {
        res[i] = res[i].trim();
        if(ev[i])
            res[i] = eval(res[i]);
    }
    return res;
}

const file = getFile(SRC+"main.js");
console.log("Processing...");
const res = processCode(file);
console.log("Done!");
fs.writeFileSync(SRC+"compiled.js", res, "utf-8");