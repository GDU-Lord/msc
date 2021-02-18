(scene) => {

	$menu_cam = new rjs.Camera({});

	$menu_bg = new rjs.Layer(scene);
	$menu_buttons = new rjs.Layer(scene);
	$menu_text = new rjs.Layer(scene);

	const login = new QBUTTON({
		pos: vec2(0, 0),
		size: vec2(350, 80),
		layer: menu_buttons,
		private: {
			text: "Login",
			text_color: rgb(255, 255, 255),
			onclick () {
				UI.alert("Username", {
					ok (msg) {
						const v = mag.input.DOM.value;
						UI.alert("Password", {
							ok (msg2) {
								const v2 = msg.input.DOM.value;
								// scoket.emit();
							}
						}, true, menu_buttons);
					}
				}, true, menu_buttons); 
			}
		}
	});

	const click = new rjs.Click(e => {

		UI.click();

	});

	const loop = new rjs.GameLoop(() => {

		

	});

}