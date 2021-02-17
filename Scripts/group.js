class Group {

    players = {}; //jshint ignore:line

    static getToken () {

        const token = "AFsFdsak_"+Math.floor(Math.random()*1000000);
        return token;

    }

    constructor (room, player, name) {

        this.room = room.name;
        this.owner = player.name;
        this.token = this.constructor.getToken();
        this.name = name;
        this.list = [];
        this.players = {};
        this.enemies = {};
        this.dsRoom = new Discord.Room(this.name);
        
        room.groups[this.token] = this;

    }

    leave (name) {

        const player = Player.list[name];
        const room = Room.list[player.room];

        if(!(name in this.players))
            return;

        delete this.list[this.players[name].index];
        delete this.players[name];
        delete player.groups[this.token];

        player.socket.emit("leave-group", this.token);
        this.dsRoom.disconnect(player.socket.MEMBER);

        if(player.name == this.owner) {
            for(let i in this.list) {
                const p = Player.list[this.list[i]];
                this.leave(p.name);
            }
        }
        else {
            for(let i in this.list) {
                const p = Player.list[this.list[i]];
                p.socket.emit("group-list", {
                    list: this.list,
                    token: this.token
                });
            }
        }

        

        room.armiesComeBack();
        room.updateGroups();

    }

    join (player) {

        const room = Room.list[player.room];

        this.players[player.name] = player.groups[this.token] = {
            name: player.name,
            index: this.list.length,
            role: "member",
            token: this.token
        };

        const enemies = [];

        this.list.push(player.name);

        for(let i in this.list) {
            const p = Player.list[this.list[i]];
            if(player.name != p.name) {
                room.peace(player, p);
                p.socket.emit("group-list", {
                    list: this.list,
                    token: this.token
                });
            }
            
        }
        
        for(let i in this.enemies) {
            enemies.push(i);
        }

        player.socket.emit("join-group", {
            name: this.name,
            list: this.list,
            enemies: enemies,
            owner: this.owner,
            token: this.token
        });

        room.updateGroups();

    }

    invite (player) {

        const enemies = [];
        
        for(let i in this.enemies) {
            enemies.push(i);
        }

        player.socket.emit("invite-group", {
            name: this.name,
            list: this.list,
            enemies: enemies,
            owner: this.owner,
            token: this.token
        });

    }

}

module.exports = Group;