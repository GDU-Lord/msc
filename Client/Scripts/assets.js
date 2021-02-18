() => {
	
	// setting up vertices for the hexagons

	let size = 100;
		
	let w = size;
	let h = Math.sqrt(3)/2 * w;
	
	let vert = [
		vec2(w*1/4-w/2, 0-h/2),
		vec2(w*3/4-w/2, 0-h/2),
		vec2(w*4/4-w/2, h/2-h/2),
		vec2(w*3/4-w/2, h-h/2),
		vec2(w*1/4-w/2, h-h/2),
		vec2(w*0/4-w/2, h/2-h/2)
	];

	// tile of the map

	$TILE = new rjs.Asset({
		type: "Polygon",
		color: rgb(255, 0, 0),
		vertices: vert,
		families: [F_TILES],
		points: [
			vec2(20, 0)
		]
	});

	// simple text for ui
	$UI_TEXT = new rjs.Asset({
		type: "Text",
		font: "Arial",
		text: "Undefined",
		origin: "left-top",
		size: 50,
		color: rgb(0, 0, 0)
	});

	// army asset
	$ARMY = new rjs.Asset({
		type: "Sprite",
		size: vec2(30, 30/Math.sqrt(2)),
		color: rgb(0, 0, 255),
		families: [F_ARMIES],
		private: {
			params: null,
			text: null,
			virtual: false,
			remove () {
				// destroys the army
				this.text.destroy();
				this.destroy();
			},
			loop () {
				// update the position of the text attached to army
				this.text.pos.x = this.pos.x;
				this.text.pos.y = this.pos.y-10;
				if(this.params != null)
					this.text.text = String(this.params._amount);
			},
			setPos (tile, moveOthers = true) {
				// set army position on tile
				const arms = [];
				const arm = this;

				// check all armies on the tile
				F_ARMIES.for(army => {

					if(rjs.Collision(tile, army)) {
						if(army.id != arm.id && moveOthers)
							army.setPos(tile, false);
						arms[army.id] = army;
					}

				});

				if(!(arm.id in arms))
					arms[arm.id] = arm;

				// counting up the armies on tile
				const cnt = count(arms);
				
				let c = 0;
				for(let i in arms) {
					if(i == arm.id) {
						// put the army on the center of tile
						if(c == 0 && cnt == 1)
							arm.pos = copy(tile.pos);
						else {
							// put the army on a side of tile
							const a = c/cnt*360;
							arm.pos = tile.getPoint(0, a);
						}
						break;
					}
					c++;
				}

			},
			init () {
				// army amount indicator initialization
				this.text = new rjs.Text({
					pos: vec2(),
					size: 15,
					font: "Arial",
					text: "[][][]",
					layer: this.layer
				});
			}
		}
	});

	// button asset
	$QBUTTON = new rjs.Asset({
		type: "Sprite",
		size: vec2(50, 50),
		color: rgb(100, 100, 100),
		families: [F_BUTTONS],
		private: {
			text: null,
			text_color: rgb(0, 0, 0),
			onclick () {},
			init () {
				if(this.text == null)
					return;
				this.txt = new rjs.Text({
					pos: this.pos,
					size: this.size.y*0.8,
					color: this.text_color,
					font: "Arial",
					text: this.text,
					layer: this.layer
				});

			}
		}
	});

	// $KICK = new rjs.Asset({
	// 	type: "Sprite",
	// 	size: vec2(50, 50),
	// 	color: rgb(100, 100, 100),
	// 	families: [F_BUTTONS],
	// 	private: {
	// 		onclick () {}
	// 	}
	// });

	// $JOIN = new rjs.Asset({
	// 	type: "Sprite",
	// 	size: vec2(150, 50),
	// 	color: rgb(100, 100, 100),
	// 	families: [F_BUTTONS],
	// 	private: {
	// 		onclick () {}
	// 	}
	// });

	// $LIST = new rjs.Asset({
	// 	type: "Sprite",
	// 	size: vec2(100, 50),
	// 	color: rgb(100, 100, 100),
	// 	families: [F_BUTTONS],
	// 	private: {
	// 		onclick () {}
	// 	}
	// });

	// group manage panel elements

	$GROUP_TEXT = new rjs.Asset({
		type: "Text",
		size: 30,
		font: "Arial",
		origin: "left-middle",
		colro: rgb(0, 0, 0)
	});

	$GROUP_BG = new rjs.Asset({
		type: "Sprite",
		size: vec2(300+10*4, 100+10*2),
		color: rgb(200, 200, 200),
		opacity: 50,
		origin: vec2((300+10*4)/2, (100+10*2)/2)
	});

	$NEW_GROUP = new rjs.Asset({
		type: "Sprite",
		size: vec2(300+10*4, 50),
		color: rgb(100, 100, 100),
		families: [F_BUTTONS],
		origin: vec2((300+10*4)/2, (50)/2),
		program: H_PLUS2,
		private: {
			onclick () {}
		}
	});

	// alert window asset

	$WINDOW = new rjs.Asset({
		type: "Sprite",
		size: vec2(400, 300),
		pos: vec2(0, -rjs.client.h/2+200),
		color: rgba(200, 200, 200, 200),
		points: [
			vec2(0, -40),
			vec2(0, 30),
			vec2(-100, 100),
			vec2(0, 100),
			vec2(100, 100) // points for buttons, input fields and the text
		],
		private: {
			text: "WARNING!",
			options: {}, // takes the available options (like ok/no/...)
			buttons: {},
			input: false,
			close () {
				// closing the window
				this.destroy();
				this.txt.destroy();
				for(let i in this.buttons) {
					this.buttons[i].destroy();
					this.buttons[i].txt.destroy();
				}
				if(this.input)
					this.input.destroy();
				UI._alert = null;
				rjs.timeStep = 1;
				return null;
			},
			init () {
				// getting the width of the text object
				const lines = this.text.split("\n");
				let max = 0;

				for(let i in lines) {
					max = Math.max(lines[i].length, max);
				}
				
				// increase the size of window if necessary
				this.size.x = Math.max(max*25, this.size.x);

				rjs.timeStep = 0;

				const options = this.options;

				// text initialization
				this.txt = new rjs.Text({
					pos: this.getPoint(0),
					size: 40,
					color: rgb(0, 0, 0),
					font: "Arial",
					layer: this.layer,
					text: this.text
				});

				// options initialization
				const c = count(options);
				let index = 0;

				for (let i in this.options) {

					const point = c == 1 ? 3 : index*2+2;

					// creating the button
					const button = new rjs.Sprite({
						pos: this.getPoint(point),
						layer: this.layer,
						size: vec2(100, 50),
						color: rgb(100, 100, 100),
						families: [F_BUTTONS],
						private: {
							text: i,
							parrent: this,
							onclick () { //jshint ignore:line
								// close the window and execute the option callback
								this.parrent.close();
								options[i](this.parrent);
							},
							init () { //jshint ignore:line
								// button text initialization
								this.txt = new rjs.Text({
									pos: this.pos,
									size: 50,
									color: rgb(255, 255, 255),
									font: "Arial",
									text: this.text,
									layer: this.layer
								});
							}
						}
					});

					this.buttons[i] = button;

					index ++;

				}

				if(this.input) {
					// creating the input field
					this.input = new Input.Input({
						pos: this.getPoint(1),
						layer: this.layer,
						bg_color: rgb(255, 255, 255)
					});
					this.input.DOM.focus();
				}

			}
		}
	});

}