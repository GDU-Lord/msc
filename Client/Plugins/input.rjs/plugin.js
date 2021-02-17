(plugin) => {

	
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

}