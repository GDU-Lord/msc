const { DiscordAPIError } = require("discord.js");

class Tile {

    armies = [];//jshint ignore:line
    owner = "";

    constructor (pos, type) {
        this.pos = pos;
        this.type = type;
    }
    
}

class Map {

    static randomPoint (map) {

        const w = map.w-6;
        const h = map.h-6;

        let x = Math.floor(Math.random()*w)-w/2;
        let y = Math.floor(Math.random()*h)-h/2;

        x = Math.round(x/4)*4;
        y = Math.round(y/4)*4;

        return pos(x, y);

    }

    constructor (w, h) {

        this.w = w;
        this.h = h;

        this.generate();

    }

    generate () {

        this.tiles = {};
        for(let i = -this.w/2; i < this.w/2; i ++) {
            this.tiles[i] = {};
            for(let j = -this.h/2; j < this.h/2; j ++) {
                this.tiles[i][j] = new Tile(pos(i, j), "field");
            }
        }

    }

    getStatus (player, x, y) {

        const tile = this.tiles[x][y];
        const room = Room.list[player.room];
        const owner = room.players[tile.owner];

        

        if(typeof owner == "undefined")
            return "NEUTRAL";

        if(tile.owner == player.name)
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

    getOwner (x, y) {

        const tile = this.tiles[x][y];

        return tile.owner;

    }
    
}

class Room {

    static join (player, roomName, password) {

        if(roomName in this.list) {
            this.list[roomName].join(player, password);
        }
        else {
            const room = new this(roomName, password);
            room.join(player, password);
        }

    }

    static Map = Map; //jshint ignore:line
    static list = {};
    static MAX_PLAYERS = 2;

    players = {};
    map = {};
    groups = {};
    capitals = {};
    started = false;

    joinGroup (player, token, name) {

        if(token in this.groups) {
            const group = this.groups[token];
            if(typeof group == "undefined")
                return;
            group.join(player);
        }
        else {
            (new Group(this, player, name)).join(player);
        }

    }

    constructor (name, password) {

        this.name = name;
        this.password = password;

        this.map = new Map(20, 20);
        this.MAX_PLAYERS = this.constructor.MAX_PLAYERS;
        this.constructor.list[this.name] = this;

        console.log("+ "+this.name);

    }

    emit (tag, msg) {

        for(let i in this.players) {
            const player = this.players[i];
            player.socket.emit(tag, msg);
        }
        
    }

    expand (player, x, y) {

        const tile = this.map.tiles[x][y];
        const status = this.map.getStatus(player, x, y);
        const owner = Player.list[tile.owner];
        if(status == "NEUTRAL" || status == "ENEMY") {
            tile.owner = player.name;
            this.emit("update-tile", tile);
            if(`${tile.pos.x}_${tile.pos.y}` in this.capitals) {
                delete this.capitals[`${tile.pos.x}_${tile.pos.y}`];
                owner.defeat(player);
            }
        }
        if(status == "NEUTRAL" && typeof owner != "undefined")
            this.war(player, owner);

    }

    armiesComeBack () {

        for(let i in this.map.tiles) {
            for(let j in this.map.tiles[i]) {

                const tile = this.map.tiles[i][j];

                for(let k in tile.armies) {

                    const army = tile.armies[k];
                    const player = Player.list[army.player];
                    const status = this.map.getStatus(player, i, j);

                    if(status == "ENEMY" || status == "NEUTRAL") {

                        army.move(player.capital.x, player.capital.y);

                    }

                }

            }
        }

    }

    war (a, b) {

        const status = b.getStatus(a);

        if(status == "FRIEND")
            return;

        a.enemies[b.name] = true;
        b.enemies[a.name] = true;
        
        for(let i in a.groups) {
            const group = a.groups[i];
            for(let i in group.list) {
                const player = Player.list[group.list[i]];
                const statusB = b.getStatus(player);
                if(statusB != "FRIEND") {
                    player.enemies[b.name] = true;
                    b.enemies[player.name] = true;
                }
            }
        }

        this.updateGroups();

    }

    askForPeace (a, b) {
        
        if(!(a.name in b.enemies))
            return;
        
        b.socket.emit("ask-for-peace", a.name);

    }

    peace (a, b) {

        if(a.name in b.enemies)
            delete b.enemies[a.name];
        if(b.name in a.enemies)
            delete a.enemies[b.name];

        this.updateGroups();

    }

    start (player) {

        this.started = true;
        player.clear();
        player.room = this.name;
        let p = Map.randomPoint(this.map);
        while(`${p.x}_${p.y}` in this.capitals)
            p = Map.randomPoint(this.map);
        this.capitals[`${p.x}_${p.y}`] = player.name;
        player.setCapital(p.x, p.y);

        player.addArmy(1000);
        player.addArmy(1000);

        this.emit("player", {
            name: player.name,
            tiles: player.tiles,
            armies: player.armies,
            population: player.population,
            level: player.level,
            capital: player.capital,
            groups: player.groups
        });
        console.log(player.name+" -> "+this.name);
    }

    join (player, password) {

        if(this.started ||password != this.password)
            return player.socket.emit("reload", true);
        
        this.players[player.name] = player;
        
        player.socket.emit("map", this.map);

        if(count(this.players) == this.MAX_PLAYERS) {
            for(let i in this.players) {
                this.start(this.players[i]);
            }
        }

    }

    updateGroups () {

        for(let i in this.players) {

            const player = this.players[i];
            const friends = {};
            const enemies = {};

            for(let j in player.groups) {

                const group = this.groups[player.groups[j].token];
                
                for(let k in group.list) {
                    friends[group.list[k]] = true;
                }

                for(let k in group.enemies) {
                    enemies[k] = true;
                }

            }

            for(let j in player.enemies) {
                enemies[j] = true;
            }

            player.socket.emit("update-groups", {
                friends: friends,
                enemies: enemies
            });

        }

        for(let i in this.players) {

            const player = this.players[i];
            
            for(let j in player.armies) {

                this.emit("army-update", player.armies[j]);

            }

        }

    }

    checkUsersLeft () {

        let cnt = 0;
        
        for(let i in this.list) {

            const player = Player.list[this.list[i]];

            if(!player.left)
                cnt ++;

        }

        if(cnt < 2) {
            this.close();
        }

    }

    updateVoiceLists () {

        for(let i in this.players) {

            const player = this.players[i];

            const member = player.socket.MEMBER;

            if(typeof member != "undefined" && member.voice.channelID != null) {

                let list = [];

                const channel = Discord.guild.channels.cache.find(channel => channel.id == member.voice.channelID);

                

                if(channel.name != "waiting") {
                    list.push(`"${channel.name}"`);
                    list.push("");
                    channel.members.forEach(member => { // jshint ignore:line
    
                        list.push(member.SOCKET.PLAYER.name);
        
                    });
                }
        
                player.socket.emit("voice-list", list);

            }

        }
        
    }

    close () {

        this.emit("reload");
        delete this.constructor.list[this.name];

    }


}

module.exports = Room;
