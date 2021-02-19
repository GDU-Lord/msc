(scene) => {
	
	// camera initialization
	$play_cam = new rjs.Camera({});

	// layers
	$play_bg = new rjs.Layer(scene);
	$play_main = new rjs.Layer(scene);
	$play_map = new rjs.Layer(scene);
	$play_armies = new rjs.Layer(scene);
	$play_ui = new rjs.Layer(scene, vec2(0, 0));

	// scene scripts
	$MAP = require("Scenes/play/Scripts/map.js")();
	$UI = require("Scenes/play/Scripts/ui.js")();

	// UI initialization
	UI.init(play_ui);

	$DEFEATED = false;

	$tiles = {};

	// text message initialization
	$tx_invite = new rjs.Text({
		pos: vec2(0, -rjs.client.h/2+300),
		size: 100,
		font: "Arial",
		color: rgb(0, 0, 0),
		text: "Choose player to invite...\n[ESC] to cancel",
		render: false,
		layer: play_ui
	});

	$tx_voice_invite = new rjs.Text({
		pos: vec2(0, -rjs.client.h/2+300),
		size: 100,
		font: "Arial",
		color: rgb(0, 0, 0),
		text: "Choose player to invite...\n[ESC] to cancel",
		render: false,
		layer: play_ui
	});

	$tx_voice_kick = new rjs.Text({
		pos: vec2(0, -rjs.client.h/2+300),
		size: 100,
		font: "Arial",
		color: rgb(0, 0, 0),
		text: "Choose player to kick...\n[ESC] to cancel",
		render: false,
		layer: play_ui
	});

	$tx_kick = new rjs.Text({
		pos: vec2(0, -rjs.client.h/2+300),
		size: 100,
		font: "Arial",
		color: rgb(0, 0, 0),
		text: "Choose player to kick...\n[ESC] to cancel",
		render: false,
		layer: play_ui
	});

	// username

	$tx_username = new UI_TEXT({
		pos: vec2(rjs.client.w/2-10, -rjs.client.h/2+10),
		text: "",
		origin: "right-top",
		layer: play_ui
	});

	// room title

	$tx_room = new UI_TEXT({
		pos: vec2(rjs.client.w/2-10, -rjs.client.h/2+10+50),
		text: "",
		origin: "right-top",
		layer: play_ui
	});

	// $tx_pop = new UI_TEXT({
	// 	pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10),
	// 	text: "Population: NaN",
	// 	layer: play_ui
	// });

	// $tx_army = new UI_TEXT({
	// 	pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10+50),
	// 	text: "Army: NaN",
	// 	layer: play_ui
	// });

	// $tx_level = new UI_TEXT({
	// 	pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10+100),
	// 	text: "Level: 1",
	// 	layer: play_ui
	// });

	// $tx_coins = new UI_TEXT({
	// 	pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10+150),
	// 	text: "Coins: 0$",
	// 	layer: play_ui
	// });

	// ui indicators

	$tx_turns = new UI_TEXT({
		pos: vec2(-rjs.client.w/2+10, -rjs.client.h/2+10),
		text: "Turns: 0",
		layer: play_ui
	});

	$tx_groups = new UI_TEXT({
		pos: vec2(-rjs.client.w/2, -rjs.client.h/2+60),
		text: "Groups:",
		layer: play_ui
	});

	$tx_voice_list = new UI_TEXT({
		pos: vec2(-rjs.client.w/2+10, rjs.client.h/2-120),
		text: "",
		origin: "left-bottom",
		layer: play_ui
	});

	// drag and drop + zoom initialization

	MAP.initDrag(scene, play_map, play_main, play_armies);

	// const sp = new rjs.KeyDown(e => {
	// 	if(DEFEATED)
	// 		return;
	// 	socket.emit("NEW_ARMY", true);
	// }, 32, true, scene);

	// const kd = new rjs.KeyDown(e => {
	// 	console.log(e.keyCode);
	// }, null, true, scene);

	// 65 71 73

	// const grp = new rjs.KeyDown(e => {
	// 	if(DEFEATED)
	// 		return;
	// 	const name = prompt("Enter the group name:");
	// 	if(name == null || name == "")
	// 		return;
	// 	socket.emit("new-group", name);
	// }, 71, true, scene);

	// const inv = new rjs.KeyDown(e => {
	// 	if(DEFEATED)
	// 		return;
	// 	const group = prompt("Enter the group name:");
	// 	if(group == null || group == "")
	// 		return;
	// 	const token = MAP.getToken(group);
	// 	if(token == null)
	// 		return;
	// 	const player = prompt("Enter the player name:");
	// 	if(player == null || player == "")
	// 		return;
	// 	socket.emit("invite-group", [token, player]);
	// }, 73, true, scene);

	// const inv = new rjs.KeyDown(e => {

	// 	const name = prompt("Enter the player name:");
	// 	if(name == null || name == "")
	// 		return;

	// 	socket.emit("voice-invite", name);

	// }, 73, true, scene);

	// const wr = new rjs.KeyDown(e => {

	// 	if(DEFEATED)
	// 		return;
		
	// 	const name = prompt("Enter the player name:");

	// 	if(name == null || name == "")
	// 		return;

	// 	socket.emit("war", name);

	// }, 87, true, scene);

	// const pc = new rjs.KeyDown(e => {

	// 	if(DEFEATED)
	// 		return;
		
	// 	const name = prompt("Enter the player name:");

	// 	if(name == null || name == "")
	// 		return;

	// 	socket.emit("ask-for-peace", name);

	// }, 80, true, scene);

	// const lv = new rjs.KeyDown(e => {

	// 	if(DEFEATED)
	// 		return;
		
	// 	const group = prompt("Enter the group name:");
	// 	if(group == null || group == "")
	// 		return;
	// 	const token = MAP.getToken(group);

	// 	socket.emit("leave-group", token);

	// }, 76, true, scene);

	// escape button

	const ic = new rjs.KeyDown(e => {

		MAP.inviteGroup = null;
		MAP.inviteVoice = false;
		MAP.kickVoice = false;
		MAP.kickGroup = null;

	}, 27, true, scene);

	// enter button

	const enter = new rjs.KeyDown(e => {

		if(UI._alert != null && "ok" in UI._alert.buttons)
			UI._alert.buttons.ok.onclick();

	}, 13, true, scene);

	// click event
	const click = new rjs.Click(e => {

		if(DEFEATED)
			return;

		// UI click listener call
		UI.click();

		if(MAP.dragArmy == null) {
			if(MAP.turns > 0) {
				F_TILES.for(tile => {
					if(!rjs.MouseOver(tile))
						return;
					F_ARMIES.for(army => {
						// drag the army
						if(army.params.player == USERNAME && rjs.Collision(army, tile)) {
							MAP.dragArmy = army;
							MAP.turns --;
						}
					});
				});
			}
		}
		else {

			if(MAP.select == null) {
				MAP.dragArmy.pos = copy(MAP.getTile(MAP.dragArmy.params.pos.x, MAP.dragArmy.params.pos.y).pos);
				MAP.dragArmy = null;
			}
			else {
				if(!MAP.dragArmy.virtual) {
					MAP.dragArmy.setPos(MAP.select);
					MAP.dragArmy.params.pos = vec2(MAP.select.x, MAP.select.y);
					socket.emit("army-move", {
						id: MAP.dragArmy.params.id,
						pos: MAP.dragArmy.params.pos
					});
				}
				else {
					MAP.dragArmy.remove();
					socket.emit("army-split", {
						id: MAP.dragArmy.params.id,
						pos: vec2(MAP.select.x, MAP.select.y)
					});
				}
				MAP.dragArmy = null;
			}

		}

	}, true, scene);

	// right click event

	const rclick = new rjs.RightClick(e => {

		if(DEFEATED)
			return;

		if(MAP.dragArmy == null) {
			if(MAP.turns > 0) {
				F_TILES.for(tile => {
					if(!rjs.MouseOver(tile))
						return;
					F_ARMIES.for(army => {
						if(army.params.player == USERNAME && rjs.Collision(army, tile) && army.params._amount > 2) {
							MAP.dragArmy = MAP.splitArmy(army);
							MAP.turns --;
						}
					});
				});
			}
		}
		else {

			if(MAP.select == null) {
				// MAP.dragArmy.pos = copy(MAP.getTile(MAP.dragArmy.params.pos.x, MAP.dragArmy.params.pos.y).pos);
				MAP.dragArmy = null;
			}
			else {
				if(!MAP.dragArmy.virtual) {
					MAP.dragArmy.setPos(MAP.select);
					MAP.dragArmy.params.pos = vec2(MAP.select.x, MAP.select.y);
					socket.emit("army-move", {
						id: MAP.dragArmy.params.id,
						pos: MAP.dragArmy.params.pos
					});
				}
				else {
					MAP.dragArmy.remove();
					socket.emit("army-split", {
						id: MAP.dragArmy.params.id,
						pos: vec2(MAP.select.x, MAP.select.y)
					});
				}
				MAP.dragArmy = null;
			}

		}

	});

	const loop = new rjs.GameLoop(() => {

		// map game loop

		MAP.loop();

	}, true, scene);

}