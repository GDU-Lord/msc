// код запускается после загрузки страници

let rjs, Global, Touch, Smart, Fade, DyRes, Drag, Input, new_scene;

window.addEventListener('load', (e) => {

	// инициализация Rect Engine 5
	rjs = new RectJS(rjs => {

		// код выполняется перед инициализацией движка
		// здесь подключается большенство плагинов

		Global = new rjs.Plugin("global");
		Touch = new rjs.Plugin("touch");
		Smart = new rjs.Plugin("smart");
		Fade = new rjs.Plugin("fade");
		DyRes = new rjs.Plugin("dyres");
		Drag = new rjs.Plugin("drag");
		Input = new rjs.Plugin("input");

	}, "Client/");

	// подключение скриптов
	Smart.Script("config.js")();
	Smart.Script("families.js")();
	Smart.Script("sources.js")();
	Smart.Script("assets.js")();

	// создание сцены "new"
	play_scene = new Smart.Scene("play");
	menu_scene = new Smart.Scene("menu");

	// переход на сцену "new"
	menu_scene.set();

});