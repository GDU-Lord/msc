const DS = require("discord.js");

class Room {

    static list = {}; //jshint ignore:line

    members = {}; //jshint ignore:line

    constructor (name, params = {}, exist = false) {

        const client = Discord.client;
        const guild = Discord.guild;

        const room = this;
        room.name = name;
        
        if(exist) {
            room.channel = guild.channels.cache.find(channel => channel.name === room.name);
            params.CONNECT = params.CONNECT || false;
            params.VIEW_CHANNEL = params.VIEW_CHANNEL || false;
            room.channel.updateOverwrite(guild.roles.everyone, params);
        }
        else {
            guild.channels.create(room.name, {
                type: 'voice'
            }).then(() => {
                room.channel = guild.channels.cache.find(channel => channel.name === room.name);
                params.CONNECT = params.CONNECT || false;
                params.VIEW_CHANNEL = params.VIEW_CHANNEL || false;
                room.channel.updateOverwrite(guild.roles.everyone, params);
            }).catch(console.log);
        }
        

        this.constructor.list[this.name] = this;

    }

    leave () {

    }

    join (member) {
        
    }

    updateList (member) {

        if(typeof member.SOCKET == "undefined")
            return;
        if(typeof member.SOCKET.PLAYER == "undefined")
            return;
        const player = member.SOCKET.PLAYER;

        const room = ROOM.list[player.room];

        if(typeof room == "undefined")
            return;
        
        room.updateVoiceLists();

    }

    connect (member) {
        if(member.voice.channelID == null)
            return;
        this.members[member.id] = member;
        member.voice.setChannel(this.channel).then(() => this.updateList(member));
    }

    disconnect (member) {
        if(!(member.id in this.members))
            return;
        delete this.members[member.id];
        member.voice.setChannel(this.constructor.list.waiting.channel).then(() => this.updateList(member));
    }

}

class Discord {

    static client = null; // jshint ignore:line
    static guild = null;
    static Room = Room;

    static init (callback) {

        const client = this.client = new DS.Client();
        const token = fs.readFileSync(__dirname + "/token.txt").toString();

        client.on("ready", callback);
        client.login(token);

    }
    
}

module.exports = Discord;