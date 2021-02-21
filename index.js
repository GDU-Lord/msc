const { User } = require("discord.js");
const { join } = require("path");
const { Socket } = require("socket.io");

DIRNAME = __dirname;

fs = require("fs");

pos = function (x, y) {
    return {
        x: x,
        y: y
    }
};

count = function (obj) {

    let res = 0;
    for(let i in obj) {
        res ++;
    }

    return res;

};

GameUser = require(__dirname + "/Scripts/user.js");
Group = require(__dirname + "/Scripts/group.js");
ROOM = Room = require(__dirname + "/Scripts/room.js");
Player = require(__dirname + "/Scripts/player.js");
Discord = require(__dirname + "/Scripts/discord.js");

Discord.init((msg) => {
    require(__dirname + "/Scripts/io.js");
    const client = Discord.client;
    let guild = null;

    client.user.setActivity("MisConflict", { type: "PLAYING"});

    start();

    function start () {
        client.guilds.cache.forEach(g => {
            guild = g;
            Discord.guild = g;
        });
        const channels = guild.channels.cache;
        const roles = guild.roles.cache;

        let waiting = false;

        const channel_list = [];

        channels.forEach(channel => {
            if(channel.name == "bot" || channel.name == "welcome" || channel.name == "open-voice" || channel.name == "guide")
                return;
            if(channel.name == "waiting") {
                waiting = true;
                return;
            }
            channel_list.push(channel);
        });

        
        if(waiting) {
            new Discord.Room("waiting", {
                SPEAK: true,
                CONNECT: true,
                VIEW_CHANNEL: true
            }, waiting);
            guild.members.cache.forEach(member => {
                Discord.Room.list.waiting.connect(member);
            });
        }
        

        setTimeout(() => {
            for(let i in channel_list) {
                channel_list[i].delete();
            }
            setTimeout(() => {
                if(!waiting) {
                    new Discord.Room("waiting", {
                        SPEAK: false,
                        CONNECT: true,
                        VIEW_CHANNEL: true
                    }, waiting);
                }
            }, 1000);
        }, 1000);

        

    }

    client.on("message", msg => {

        if(guild == null) {
            guild = msg.guild;
            Discord.guild = guild;
        }

        const c = msg.content.split(" ");
        
        if(c[0] == "@start") {
           
            if(c[1] != "bss&^@#$@!R@%AASjaslq90288+(")
                return msg.channel.send("Access denied!");

            msg.channel.send("Restarting...");
            start();

        }
        else if(c[0] == "@max") {
            if(c[1] != "bss&^@#$@!R@%AASjaslq90288+(")
                return msg.channel.send("Access denied!");
            Room.MAX_PLAYERS = parseFloat(c[2]);
            msg.channel.send("Maximum amount of players set to "+Room.MAX_PLAYERS);
        }
        else if(msg.content.trim() in queue) {

            if(msg.member.voice.channelID == null) {
                return msg.channel.send(`${msg.member} join voice channel at first!`);
            }
            if(typeof msg.member.SOCKET != "undefined") {
                return msg.channel.send(`${msg.member} you've already got verified!`);
            }
            
            const name = msg.member.user.username;
            const id = msg.member.user.id;
            
            const socket = msg.member.SOCKET = queue[msg.content.trim()];
            queue[msg.content.trim()].emit("verify", name);
            queue[msg.content.trim()].MEMBER = msg.member;
            delete queue[msg.content.trim()];

            const user = new GameUser(socket.LOGIN.username, msg.member.id, socket.LOGIN.password);

            user._login = socket;

            return msg.channel.send(`${msg.member} verified successfully!`);

        }

    });

});