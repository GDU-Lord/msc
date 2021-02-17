() => {

    class Group {

        static list = {}; // jshint ignore:line

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

            this.bg = new GROUP_BG({
                pos: vec2(rjs.client.w/2, rjs.client.h/2-offset),
                layer: UI.layer,
                private: {
                    group: this
                }
            });
            
            this.invite = new QBUTTON({
                pos: vec2(rjs.client.w/2-(s+m)*5+s/2, rjs.client.h/2-25-m-offset),
                layer: UI.layer,
                program: H_PLUS,
                private: {
                    group: this,
                    onclick () {
                        if(!GAME_STARTED)
                            return;
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
                        const list = MAP.groups[this.group.token].list;
                        let text = "";
                        for(let i in list) {
                            if(list[i] != null)
                                text += list[i]+"\n";
                        }
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
                        const group = this.group.name;
                        if(group == null || group == "")
                            return;
                        const token = MAP.getToken(group);

                        socket.emit("leave-group", token);
                    }
                }
            });

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

    class UI {

        #_id = 0;// jshint ignore:line

        static Group = Group;
        static layer = 0;
        static _alert = null;

        static click () {

            if(MAP.inviteGroup != null) {

                F_TILES.for(tile => {

                    if(rjs.MouseOver(tile)) {

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
            this.new_group = new NEW_GROUP({
                pos: vec2(rjs.client.w/2, rjs.client.h/2),
                layer: this.layer,
                private: {
                    onclick () {
                        if(!GAME_STARTED)
                            return;
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
            this.invite = new QBUTTON({
                pos: vec2(-rjs.client.w/2+60, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_PLUS,
                private: {
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        MAP.inviteVoice = true;
                    }
                }
            });
            this.kick = new QBUTTON({
                pos: vec2(-rjs.client.w/2+170, rjs.client.h/2-60),
                size: vec2(100, 100),
                layer: this.layer,
                program: H_X,
                private: {
                    onclick () {
                        if(!GAME_STARTED)
                            return;
                        MAP.kickVoice = true;
                    }
                }
            });
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

        static alert (text, options = {ok () {}}, input = false) {

            if(this._alert != null)
                this._alert.close();

            this._alert = new WINDOW({
                layer: this.layer,
                private: {
                    options: options,
                    input: input,
                    text: text
                }
            });

        }
        
    }

    return UI;

}