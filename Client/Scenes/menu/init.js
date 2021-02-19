(scene) => {

	$menu_cam = new rjs.Camera({});

	$menu_bg = new rjs.Layer(scene);
	$menu_buttons = new rjs.Layer(scene);
	$menu_text = new rjs.Layer(scene);

	// sockets script
	$SOCKET_SCRIPT = Smart.Script("sockets.js");

	$PASSWORD = null;

	$login_button = new QBUTTON({
		pos: vec2(0, 0),
		size: vec2(350, 80),
		layer: menu_buttons,
		private: {
			text: "Login",
			text_color: rgb(255, 255, 255),
			onclick () {
				if(UI._alert != null)
					return;
				UI.alert("Username", {
					ok (msg) {
						const name = USERNAME = tx_username.text = msg.input.DOM.value; //jshint ignore:line
						if(name == "")
							return;
						UI.alert("Password", {
							ok (msg2) {
								const pass = PASSWORD = msg2.input.DOM.value;  //jshint ignore:line
								if(pass == "")
									return;
								socket.emit("LOGIN", [name, pass]);
							}
						}, true, menu_buttons);
						UI._alert.input.DOM.type = "password";
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