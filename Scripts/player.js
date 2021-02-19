const Discord = require("./discord");

class Army {

    #_amount = 0; //jshint ignore:line

    static id = 0;

    constructor (player, amount, x, y) {
        
        this.player = player.name;
        this.pos = pos(x, y);
        this.id = this.constructor.id;
        this.constructor.id ++;
        this.amount = amount;
        this.position = false;
        return this.move(x, y);

    }

    getStatus (player) {

        const room = Room.list[player.room];
        const owner = room.players[this.player];

        if(this.player == player.name)
            return "OWN";

        if(player.name in owner.enemies)
            return "ENEMY";

        for(let i in owner.groups) {
            const group = room.groups[owner.groups[i].token];
            if(player.name in group.enemies)
                return "ENEMY";
            else if(player.name in group.players)
                return "FRIEND";
        }

        return "NEUTRAL";
        
    }

    move (x, y) {
        const player = Player.list[this.player];
        const room = Room.list[player.room];
        const tile = room.map.tiles[x][y];
        // const status = room.map.getStatus(player, x, y);
        const tile_status = room.map.getStatus(player, x, y);
        for(let i in tile.armies) {
            const army = tile.armies[i];
            const status = army.getStatus(player);
            if(status == "OWN") {
                army.amount += this.amount;
                this.delete();
                room.emit("army-update", army);
                return army;
            }
            else if((status == "NEUTRAL" || status == "ENEMY") && tile_status != "FRIEND") {
                return this.fight(army, x, y);
            }
        }
        this.pos = pos(x, y);
        this.position = true;
        tile.armies[this.id] = this;
        player.armies[this.id] = this;
        const removed = room.expand(player, x, y, this);
        if(!removed)
            room.emit("army-update", this);
        return this;
    }

    moveSplit (x, y) {
        const player = Player.list[this.player];
        const amount = Math.ceil(this.amount/2);
        this.amount = Math.floor(this.amount/2);
        return new this.constructor(player, amount, x, y);
    }

    fight (army, x, y) {

        const a1 = this;
        const a2 = army;
        const p1 = Player.list[a1.player];
        const p2 = Player.list[a2.player];

        const room = Room.list[p1.room];

        const v1 = a1.amount*p1.level;
        const v2 = a2.amount*p2.level;

        if(v1 > v2) {
            a2.delete();
            a1.amount -= a1.amount*(a2.amount*p2.level)/(a1.amount*p1.level);
            if(a1.pos.x != x || a1.pos.y != y || !a1.position)
                a1.move(x, y);
            else   
                room.emit("army-update", a1);
        }
        else if(v1 < v2) {
            a1.delete();
            a2.amount -= a2.amount*(a1.amount*p1.level)/(a2.amount*p2.level);
            if(a2.pos.x != x || a2.pos.y != y || !a2.position)
                a2.move(x, y);
            else   
                room.emit("army-update", a2);

        }
        else {
            a1.delete();
            a2.delete();
        }

    }

    delete () {
        const player = Player.list[this.player];
        const room = Room.list[player.room];
        const tile = room.map.tiles[this.pos.x][this.pos.y];
        if(this.id in tile.armies)
            delete tile.armies[this.id];
        if(this.id in player.armies)
            delete player.armies[this.id];
        room.emit("army-delete", this.id);
    }

    get amount () {
        return this._amount;
    }

    set amount (amount) {
        this._amount = amount;
        const player = Player.list[this.player];
        const room = Room.list[player.room];
        if(typeof room != "undefined") {
            if(amount <= 0)
                return this.delete();
            room.emit("army-update", this);
        }
    }

}

class Player {

    static list = {}; //jshint ignore:line

    constructor (name, socket) {

        this.name = name;
        this.socket = socket;
        this.dsRoom = new Discord.Room(this.name);
        this.clear();

        this.constructor.list[name] = this;

        Discord.Room.list.waiting.connect(this.socket.MEMBER);

    }

    clear () {
        this.room = null;
        this.groups = {};
        this.enemies = {};
        this.tiles = [];
        this.armies = [];
        this.population = 1000;
        this.level = 1;
        this.coins = 0;
        this.defeated = false;
        this.left = false;
    }

    addArmy (amount) {
        const army = new Army(this, amount, this.capital.x, this.capital.y);
    }

    ownTile (pos) {
        const room = Room.list[this.room];
        const tile = room.map.tiles[pos.x][pos.y];
        tile.owner = this.name;
        this.tiles.push(pos);
        room.emit("update-tile", tile);
    }

    setCapital (x, y) {

        this.capital = pos(x, y);
        this.ownTile(this.capital);
        if(x % 2 == 0) {
            this.ownTile(pos(x, y-1));
            this.ownTile(pos(x-1, y));
            this.ownTile(pos(x, y));
            this.ownTile(pos(x+1, y));
            this.ownTile(pos(x-1, y+1));
            this.ownTile(pos(x, y+1));
            this.ownTile(pos(x+1, y+1));
        }
        else {
            this.ownTile(pos(x-1, y-1));
            this.ownTile(pos(x, y-1));
            this.ownTile(pos(x+1, y-1));
            this.ownTile(pos(x-1, y));
            this.ownTile(pos(x, y));
            this.ownTile(pos(x+1, y));
            this.ownTile(pos(x, y+1));
        }

    }

    getStatus (player) {

        const room = Room.list[this.room];

        if(this.name == player.name)
            return "OWN";

        if(player.name in this.enemies)
            return "ENEMY";

        for(let i in this.groups) {
            const group = room.groups[this.groups[i].token];
            if(player.name in group.enemies)
                return "ENEMY";
            else if(player.name in group.players)
                return "FRIEND";
        }

        return "NEUTRAL";

    }

    defeat (occ = null) {

        if(this.defeated)
            return;

        this.defeated = true;

        const room = Room.list[this.room];

        for(let i in this.groups) {
            const group = room.groups[this.groups[i].token];
            group.leave(this.name);
        }

        this.socket.emit("defeat", true);

        for(let i in room.map.tiles) {
            for(let j in room.map.tiles[i]) {
                
                const tile = room.map.tiles[i][j];

                if(tile.owner == this.name) {
                    for(let k in tile.armies) {
                        const army = tile.armies[k];
                        if(army.player == this.name) {
                            army.delete();
                            if(occ != null)
                                new Army(occ, army.amount, army.pos.x, army.pos.y);
                        }
                    }
                    if(occ != null)
                        room.expand(occ, tile.pos.x, tile.pos.y);
                }

            }
        }

        Discord.Room.list.waiting.connect(this.socket.MEMBER);

    }
    
}

module.exports = Player;