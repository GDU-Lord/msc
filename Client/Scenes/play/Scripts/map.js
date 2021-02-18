() => {

    // class initialization
    class MAP {

        // properties containing information about match
        static armies = {};//jshint ignore:line
        static dragArmy = null;//jshint ignore:line
        static select = null;
        static groups = {};
        static friends = {};
        static enemies = {};
        static #_inviteGroup = null;
        static #_inviteVoice = false;
        static #_kickVoice = false;
        static #_kickGroup = null;
        static #_turns = 0;
        static interval = null;

        // updating turn counter
        static get turns () {
            return this._turns;
        }

        static set turns (turns) {
            this._turns = turns;
            tx_turns.text = "Turns: "+turns;
            // change color of inactive armies
            if(turns <= 0) {
                F_ARMIES.for(army => {
                    if(army.params.player == USERNAME)
                        army.opacity = 50;
                        army.filters[10] = rgb(255, 200, 255);
                });
            }
            else {
                F_ARMIES.for(army => {
                    army.opacity = 100;
                    army.filters[10] = rgb(255, 255, 255);
                });
            }
        }

        // inviting player to the group
        static get inviteGroup () {
            return this._inviteGroup;
        }

        static set inviteGroup (group) {
            this._inviteGroup = group;
            if(group == null)
                tx_invite.render = false;
            else
                tx_invite.render = true;
        }

        // inviting player to the voice chat
        static get inviteVoice () {
            return this._inviteVoice;
        }

        static set inviteVoice (inv) {
            this._inviteVoice = inv;
            tx_voice_invite.render = inv;
        }

        // kcik player from the voice chat
        static get kickVoice () {
            return this._kickVoice;
        }

        static set kickVoice (kick) {
            this._kickVoice = kick;
            tx_voice_kick.render = kick;
        }

        // kcik player from the group
        static get kickGroup () {
            return this._kickGroup;
        }

        static set kickGroup (group) {
            this._kickGroup = group;
            if(group == null)
                tx_kick.render = false;
            else
                tx_kick.render = true;
        }

        // laoding the map
        static load (scene, tiles, map) {

            const sz = 50;
            const w = 100;
            const h = 100*Math.sqrt(3)/2;

            const horiz = w * 3/4;
            const vert = h;

            const mt = map.tiles;

            this.tiles = tiles;
            this.map = map;

            // generating hexagonal map
            for(let i in mt) {
                tiles[i] = {};
                for(let j in mt[i]) {
                    let x = parseFloat(i);
                    let y = parseFloat(j);
                    let pos = vec2(x*horiz, y*vert);
                    let k = Math.random()*0.1+0.9;
                    if(x % 2 == 0)
                        pos.y += vert/2;
                    tiles[i][j] = new TILE({
                        pos: pos,
                        layer: play_map,
                        color: rgb(150*k, 200*k, 150*k),
                        opacity: 80,
                        private: {
                            x: x,
                            y: y
                        }
                    });

                }
            }

        }

        // return tile by position in array
        static getTile (x, y) {
            let res = null;
            F_TILES.for(tile => {
                if(tile.x == x && tile.y == y)
                    res = tile;
            });
            return res;
        }

        // drag and zoom plugin initialization
        static initDrag (scene, layer1, ...layers) {
            Drag.Init(scene, layer1, rjs.MouseUp, rjs.MouseDown);
            Drag.InitZoom(scene, [layer1, ...layers], 1.1, rjs.WheelUp, rjs.WheelDown, (layer, val) => {
                Fade.SetTarget(layer, ['scale.x', 'scale.y'], [val, val], 0.2);
            });
        }

        // checks is the tile belong to player
        static tileBelong (tile) {
            const status = this.getStatus(tile.x, tile.y);
            return (
                status == "OWN" ||
                status == "FRIEND"
            );
        }

        // game loop of the match
        static loop () {

            // drag and zoom loop
            Drag.loop();

            this.select = null;

            // moving the army along the mouse
            if(this.dragArmy != null) {
                const m = Mouse.get(this.dragArmy.layer);
                this.dragArmy.pos.x = m.x;
                this.dragArmy.pos.y = m.y;
                // selecting the current tile
                F_TILES.forNearTo(Mouse, tile => {
                    if(rjs.MouseOver(tile)) {
                        let b = false;

                        F_TILES.forNearTo(tile.pos, t => {
                            if(this.tileBelong(t)) {
                                b = true;
                                // t.color = rgb(0,0,0);
                            }
                        }, 100, false);

                        if(b) {
                            this.select = tile;
                        }
                    }
                }, 100);
            }
            // running loop of every army
            F_ARMIES.for(army => {
                army.loop();
            });

        }

        // player initialization
        static initPlayer (player) {
            
            // setting a capital
            const tile = this.getTile(player.capital.x, player.capital.y);
            // creating player nickname on the map
            new rjs.Text({
                pos: tile.pos,
                size: 50,
                font: "Arial",
                text: player.name,
                color: rgba(0, 0, 0, 180),
                layer: tile.layer
            });
            tile.filters[1] = rgb(255, 300, 255);
            // start turn update loop
            this.startInterval();

        }

        // fill tile with color according to the status
        static fillTiles (tiles, status) {

            for(let i in tiles) {
                const tile = this.getTile(tiles[i].x, tiles[i].y);
                if(status == "self")
                    tile.filters[0] = rgb(0, 200, 100);
                if(status == "neutral")
                    tile.filters[0] = rgb(100, 100, 100);
            }

        }

        // update tile (from socket)
        static updateTile (tile) {

            // getting status of tile and setting up its color
            this.map.tiles[tile.pos.x][tile.pos.y] = tile;

            const obj = this.getTile(tile.pos.x, tile.pos.y);
            
            const status = this.getStatus(tile.pos.x, tile.pos.y);
            obj.filters[0] = this.getStatusColor(status);

            if(typeof obj.filters[1] != "undefined")
                delete obj.filters[1];

        }

        // create an army (from socket)
        static initArmy (army, layer) {

            // create a game object
            const obj = this.armies[army.id] = new ARMY({
                pos: copy(this.getTile(army.pos.x, army.pos.y).pos),
                layer: layer,
                private: {
                    params: army
                }
            });

            // paint army with color
            const status = this.getArmyStatus(army);
            obj.color = this.getStatusColor(status);

        }

        // split army by 2
        static splitArmy (army) {

            const a = new ARMY({
                pos: copy(army.pos),
                layer: army.layer,
                private: {
                    params: copy(army.params),
                    virtual: true
                }
            });

            a.params.amount /= 2;
            army.params.amount /= 2;

            return a;

        }

        // update an army (from socket)
        static updateArmy (army, a) {

            a.params = army;
            a.setPos(this.getTile(army.pos.x, army.pos.y));

            const status = this.getArmyStatus(army);
            a.color = this.getStatusColor(status);

        }

        // delete the army
        static deleteArmy (a) {

            a.remove();
            delete this.armies[a.params.id];

        }

        // get the army by its id
        static findArmy (army) {

            if(army.id in this.armies)
                return this.armies[army.id];
            else
                return null;

        }

        // add the group (from socket)
        static addGroup (name, list, enemies, owner, token) {

            this.groups[token] = {
                name: name,
                list: list,
                enemies: enemies,
                owner: owner,
                token: token
            };

            this.updateGroupList();

        }

        // removing the group from list (only for client) by its token
        static removeGroup (token) {

            if(token in this.groups)
                delete this.groups[token];

            this.updateGroupList();

        }

        // get group token by its name
        static getToken (groupName) {

            for(let i in this.groups) {
                if(this.groups[i].name == groupName)
                    return this.groups[i].token;
            }

            return null;

        }

        // update list of groups and controll buttons
        static updateGroupList () {

            UI.Group.removeAll();

            let t = "Groups:";

            for(let i in this.groups) {
                t += "\n  "+this.groups[i].name;
                new UI.Group(this.groups[i].name, this.groups[i].token);
            }

            tx_groups.text = t;

        }

        // returns the status of a tile with coordinates x y
        static getStatus (x, y) {
            const tile = this.map.tiles[x][y];
            if(tile.owner == "")
                return "FREE";
            if(tile.owner == USERNAME)
                return "OWN";
            if(tile.owner in this.friends)
                return "FRIEND";
            if(tile.owner in this.enemies)
                return "ENEMY"
            return "NEUTRAL";
        }

        // returns the status of given army
        static getArmyStatus (army) {
            if(army.player == USERNAME)
                return "OWN";
            if(army.player in this.friends)
                return "FRIEND";
            if(army.player in this.enemies)
                return "ENEMY"
            return "NEUTRAL";
        }

        // returns the color according to a given status
        static getStatusColor (status) {

            let res = null;
            
            switch(status) {

                case "OWN":
                    res = rgb(0, 200, 100);
                    break;
                case "FRIEND":
                    res = rgb(200, 200, 50);
                    break;
                case "ENEMY":
                    res = rgb(200, 100, 0);
                    break;
                case "NEUTRAL":
                    res = rgb(100, 100, 100);
                    break;
                default:
                    res = rgb(255, 255, 255);

            }

            return res;

        }

        // update colors of the tiles on battlemap according to its status
        static updateGroups (friends, enemies) {

            this.friends = friends;
            this.enemies = enemies;

            for(let i in this.map.tiles) {

                for(let j in this.map.tiles[i]) {

                    const tile = this.map.tiles[i][j];
                    const status = this.getStatus(i, j);
                    this.getTile(tile.pos.x, tile.pos.y).filters[0] = this.getStatusColor(status);

                }

            }

        }

        // start the turn loop
        static startInterval () {

            if(this.interval != null) {
                clearInterval(this.interval);
                this.interval = null;
            }

            this.turns = 0;

            this.interval = setInterval(() => {
                if(GAME_STARTED)
                    this.turns ++;
            }, 5000);

        }

        constructor () {

        }

    }

    // script returns MAP
    return MAP;

}