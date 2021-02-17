() => {

    class MAP {

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

        static get inviteVoice () {
            return this._inviteVoice;
        }

        static set inviteVoice (inv) {
            this._inviteVoice = inv;
            tx_voice_invite.render = inv;
        }

        static get kickVoice () {
            return this._kickVoice;
        }

        static set kickVoice (kick) {
            this._kickVoice = kick;
            tx_voice_kick.render = kick;
        }

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

        static load (scene, tiles, map) {

            const sz = 50;
            const w = 100;
            const h = 100*Math.sqrt(3)/2;

            const horiz = w * 3/4;
            const vert = h;

            const mt = map.tiles;

            this.tiles = tiles;
            this.map = map;

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

        static getTile (x, y) {
            let res = null;
            F_TILES.for(tile => {
                if(tile.x == x && tile.y == y)
                    res = tile;
            });
            return res;
        }

        static initDrag (scene, layer1, ...layers) {
            Drag.Init(scene, layer1, rjs.MouseUp, rjs.MouseDown);
            Drag.InitZoom(scene, [layer1, ...layers], 1.1, rjs.WheelUp, rjs.WheelDown, (layer, val) => {
                Fade.SetTarget(layer, ['scale.x', 'scale.y'], [val, val], 0.2);
            });
        }

        static tileBelong (tile) {
            const status = this.getStatus(tile.x, tile.y);
            return (
                status == "OWN" ||
                status == "FRIEND"
            );
        }

        static loop () {

            Drag.loop();

            this.select = null;

            if(this.dragArmy != null) {
                const m = Mouse.get(this.dragArmy.layer);
                this.dragArmy.pos.x = m.x;
                this.dragArmy.pos.y = m.y;
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

            F_ARMIES.for(army => {
                army.loop();
            });

        }

        static initPlayer (player) {
            
            const tile = this.getTile(player.capital.x, player.capital.y);
            new rjs.Text({
                pos: tile.pos,
                size: 50,
                font: "Arial",
                text: player.name,
                color: rgb(0, 0, 0),
                layer: tile.layer
            });
            tile.filters[1] = rgb(255, 300, 255);
            let status = "neutral";
            if(player.name == USERNAME)
                status = "self";
            // this.fillTiles(player.tiles, status);

        }

        static fillTiles (tiles, status) {

            for(let i in tiles) {
                const tile = this.getTile(tiles[i].x, tiles[i].y);
                if(status == "self")
                    tile.filters[0] = rgb(0, 200, 100);
                if(status == "neutral")
                    tile.filters[0] = rgb(100, 100, 100);
            }

        }

        static updateTile (tile) {

            this.map.tiles[tile.pos.x][tile.pos.y] = tile;

            const obj = this.getTile(tile.pos.x, tile.pos.y);
            
            const status = this.getStatus(tile.pos.x, tile.pos.y);
            obj.filters[0] = this.getStatusColor(status);

            if(typeof obj.filters[1] != "undefined")
                delete obj.filters[1];

        }

        static initArmy (army, layer) {

            const obj = this.armies[army.id] = new ARMY({
                pos: copy(this.getTile(army.pos.x, army.pos.y).pos),
                layer: layer,
                private: {
                    params: army
                }
            });

            const status = this.getArmyStatus(army);
            obj.color = this.getStatusColor(status);

        }

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

        static updateArmy (army, a) {

            a.params = army;
            a.pos = copy(this.getTile(army.pos.x, army.pos.y).pos);

            const status = this.getArmyStatus(army);
            a.color = this.getStatusColor(status);

        }

        static deleteArmy (a) {

            a.remove();
            delete this.armies[a.params.id];

        }

        static findArmy (army) {

            if(army.id in this.armies)
                return this.armies[army.id];
            else
                return null;

        }

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

        static removeGroup (token) {

            if(token in this.groups)
                delete this.groups[token];

            this.updateGroupList();

        }

        static getToken (groupName) {

            for(let i in this.groups) {
                if(this.groups[i].name == groupName)
                    return this.groups[i].token;
            }

            return null;

        }

        static updateGroupList () {

            UI.Group.removeAll();

            let t = "Groups:";

            for(let i in this.groups) {
                t += "\n  "+this.groups[i].name;
                new UI.Group(this.groups[i].name, this.groups[i].token);
            }

            tx_groups.text = t;

        }

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

        static getArmyStatus (army) {
            if(army.player == USERNAME)
                return "OWN";
            if(army.player in this.friends)
                return "FRIEND";
            if(army.player in this.enemies)
                return "ENEMY"
            return "NEUTRAL";
        }

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

        constructor () {

        }

    }

    return MAP;

}