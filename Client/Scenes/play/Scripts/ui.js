() => {

    // group interface class
    class Group {

        static list = {}; // jshint ignore:line

        // removing all the group interfaces
        static removeAll () {

            for(let i in this.list) {

                const group = this.list[i];
                group.invite.destroy();
                group.join.destroy();
                group.leave.destroy();
                group.info.destroy();
                group.kick.destroy();
                group.text.destroy();
                group.bg.destroy();

            }

            this.list = {};

        }

        constructor (name, token) {

            const c = count(this.constructor.list);
            const m = 10;

            const offset = (m*2+100)*c+50;
            const s = 50;

            // generating background and buttons for the group management

            this.bg = new GROUP_BG({
                pos: vec2(rjs.client.w/2, rjs.client.h/2-offset),
                layer: UI.layer,
                private: {
                    group: this
                }
            });

            // generate buttons
            
            this.invite = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*5+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_PLUS,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // invite player to the group
                        MAP.inviteGroup = this.group;
                    }
                }
            });

            this.kick = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*4+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_X,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // kick the player from the group
                        const group = MAP.groups[this.group.token];
                        if(group.owner == USERNAME)
                            MAP.kickGroup = this.group;
                    }
                }
            });

            this.join = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*3+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_SOUND,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // join voice channel of the group
                        socket.emit("ds-join", this.group.token);
                    }
                }
            });

            this.info = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*2+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_DOTS,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // get list of the players
                        const list = MAP.groups[this.group.token].list;
                        let text = "";
                        for(let i in list) {
                            if(list[i] != null)
                                text += list[i]+"\n";
                        }
                        // call a pop-up window
                        UI.alert(text);
                    }
                }
            });

            this.leave = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*1+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_X,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // leave the group
                        const group = this.group.name;
                        if(group == null || group == "")
                            return;
                        const token = MAP.getToken(group);

                        socket.emit("leave-group", token);
                    }
                }
            });

            // group name

            this.text = new GROUP_TEXT({
                pos: vec2(rjs.client.w/2-50*2-75*2-25*2-m*3, rjs.client.h/2-70-m-offset),
                text: name,
                layer: UI.layer,
                private: {
                    group: this
                }
            });

            this.name = name;
            this.token = token;

            this.constructor.list[token] = this;

        }

    }

    // UI class

    class UI {

        #_id = 0;// jshint ignore:line

        // global properties
        static Group = Group; // reference to Group class
        static layer = 0; // layer of the UI
        static _alert = null; // current alert window

        static click () {

            // click event listener for UI

            if(MAP.inviteGroup != null) {

                F_TILES.for(tile => {

                    if(rjs.MouseOver(tile)) {

                        // invite player to the group
                        const t = MAP.map.tiles[tile.x][tile.y];

                        const status = MAP.getStatus(tile.x, tile.y);

                        if(status == "NEUTRAL" || status == "ENEMY") {
                            const token = MAP.groups[MAP.inviteGroup.token].token;
                            const player = t.owner;
                            if(typeof token == "undefined")
                                return;
                            MAP.inviteGroup = null;
		                    socket.emit("invite-group", [token, player]);
                        }

                    }

                });

            }
            else if(MAP.inviteVoice) {

                F_TILES.for(tile => {

                    if(rjs.MouseOver(tile)) {

                        // invite player to the voice channel

                        const t = MAP.map.tiles[tile.x][tile.y];

                        const status = MAP.getStatus(tile.x, tile.y);

                        if(status != "FREE" && status != "OWN") {
                            const player = t.owner;
                            MAP.inviteVoice = false;
		                    socket.emit("voice-invite", player);
                        }

                    }

                });

            }
            else if(MAP.kickVoice) {

                F_TILES.for(tile => {

                    if(rjs.MouseOver(tile)) {

                        // kick the player from the voice

                        const t = MAP.map.tiles[tile.x][tile.y];

                        const status = MAP.getStatus(tile.x, tile.y);

                        if(status != "FREE" && status != "OWN") {
                            const player = t.owner;
                            MAP.kickVoice = false;
		                    socket.emit("voice-kick", player);
                        }

                    }

                });

            }
            else if(MAP.kickGroup != null) {

                F_TILES.for(tile => {

                    if(rjs.MouseOver(tile)) {

                        // kick the player from the group

                        const t = MAP.map.tiles[tile.x][tile.y];

                        const status = MAP.getStatus(tile.x, tile.y);

                        if(status != "FREE" && status != "OWN") {
                            const player = t.owner;
		                    socket.emit("kick-group", [MAP.kickGroup.token, player]);
                            MAP.kickGroup = null;
                        }

                    }

                });

            }
            else {

                if(DEFEATED)
                    return;

                F_BUTTONS.for(button => {
                    // call click event of selected button
                    if(rjs.MouseOver(button)) {
                        button.onclick();
                    }
    
                });    
            }
        }

        static get id () {
            return this._id;
        }

        static init (layer) {
            this.layer = layer;
            // "new group" button
            this.new_group = new NEW_GROUP({
                pos: vec2(rjs.client.w/2, rjs.client.h/2),
                layer: this.layer,
                private: {
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        // pop-up window appears
                        UI.alert("Create a group\nEnter the group name:", {
                            no () {

                            },
                            ok (msg) {
                                const name = msg.input.DOM.value;
                                if(name == null || name == "")
                                    return;
                                socket.emit("new-group", name);
                            }
                        }, true);
                    }
                }
            });
            // invite to voice button
            this.invite = new QBUTTON({
                pos: vec2(-rjs.client.w/2+60, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_PLUS,
                private: {
                    onclick () {
                        // invite player to the voice
                        if(!GAME_STARTED)
                            return;
                        MAP.inviteVoice = true;
                    }
                }
            });
            // kick player from the voice channel (button)
            this.kick = new QBUTTON({
                pos: vec2(-rjs.client.w/2+170, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_X,
                private: {
                    onclick () {
                        // kick player from voice chat
                        if(!GAME_STARTED)
                            return;
                        MAP.kickVoice = true;
                    }
                }
            });
            // leave private voice
            this.leave = new QBUTTON({
                pos: vec2(-rjs.client.w/2+280, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_X,
                private: {
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        socket.emit("leave-voice", true);
                    }
                }
            });
            // join common voice
            this.common = new QBUTTON({
                pos: vec2(-rjs.client.w/2+390, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_SOUND,
                private: {
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        socket.emit("common-voice", true);
                    }
                }
            });
        }

        // call the pop-up window

        static alert (text, options = {ok () {}}, input = false, layer = this.layer) {

            if(this._alert != null)
                this._alert.close();

            this._alert = new WINDOW({
                layer: layer,
                private: {
                    // parameters of window
                    options: options,
                    input: input,
                    text: text
                }
            });

        }
        
    }

    // UI class interface
    return UI;

}