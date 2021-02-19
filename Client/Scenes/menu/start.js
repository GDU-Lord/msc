(scene, params) => {
	
	// скрипт запускается после перехода на сцену
	// params -  набор параметров запуска сцены
	
	// переключение на камеру "new_cam"
	menu_cam.set();

	SOCKET_SCRIPT();

	if("USERNAME" in localStorage && "PASSWORD" in localStorage && localStorage.USERNAME != "null" && localStorage.PASSWORD != "null") {
		tx_username.text = USERNAME = localStorage.USERNAME;
		PASSWORD = localStorage.PASSWORD;
		socket.emit("LOGIN", [USERNAME, PASSWORD]);
	}
}