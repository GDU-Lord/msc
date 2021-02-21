const Path = require("path");

const express = require("express");
const Discord = require("./discord");
const { type } = require("os");
const { User } = require("discord.js");
const GameUser = require("./user");

const app = express();

app.use("/Client", express.static(Path.join(DIRNAME, "Client")));

const http = require("http").createServer(app);

app.get("/", (req, res) => {
    res.sendFile(DIRNAME + "/Client/index.html");
});

app.get("/favicon.ico", (req, res) => {
    res.sendFile(DIRNAME + "/Client/Sources/images/icon.ico");
});

http.listen(9909, "31.131.22.158", () => {
    console.log('Initialization completed! Server is running...');
});

const io = require("socket.io")(http);

queue = {};

const sockets = {};

setTimeout(() => {
    for(let i in sockets) {
        sockets[i].emit("reload", true);
    }
}, 2000);

io.on("connection", socket => {

    console.log("Client -> []");
    sockets[socket.id] = socket;

    socket.on("login", (name) => {

        // if(name in Player.list && !Player.list[name].left)
        //     return socket.emit("reload", true);

        // console.log(name + " -> []");

        // socket.emit("login", true);
        // socket.PLAYER = new Player(name, socket);

        
    });

    socket.on("join", ([name, password]) => {

        Room.join(socket.PLAYER, name, password);

    });

    socket.on("army-move", ({ id, pos }) => {

        const player = socket.PLAYER;
        const room = Room.list[player.room];
        const army = player.armies[id];
        if(typeof army == "undefined")
            return;
        const tile = room.map.tiles[army.pos.x][army.pos.y];

        delete tile.armies[id];

        army.move(pos.x, pos.y);

    });

    socket.on("army-split", ({ id, pos}) => {

        const player = socket.PLAYER;
        const room = Room.list[player.room];
        const army = player.armies[id];

        army.moveSplit(pos.x, pos.y);

    });

    socket.on("NEW_ARMY", msg => {

        socket.PLAYER.addArmy(500);

    });

    socket.on("new-group", name => {

        const player = socket.PLAYER;
        const room = Room.list[player.room];

        room.joinGroup(player, "", name);

    });

    socket.on("invite-group", ([token, playerName]) => {

        const player = Player.list[playerName];
        if(typeof player == "undefined")
            return;
        const room = Room.list[player.room];
        const group = room.groups[token];
        if(typeof group == "undefined")
            return;

        group.invite(player);

    });

    socket.on("join-group", token => {

        const player = socket.PLAYER;
        const room = Room.list[player.room];

        room.joinGroup(player, token);

    });

    socket.on("leave-group", token => {

        const player = socket.PLAYER;
        const room = Room.list[player.room];
        const group = room.groups[token];

        if(typeof group == "undefined")
            return;

        group.leave(player.name);

    });

    socket.on("kick-group", ([token, playerName]) => {

        const player = Player.list[playerName];
        if(typeof player == "undefined")
            return;
        const room = Room.list[player.room];
        if(typeof room == "undefined")
            return;
        const group = room.groups[token];
        if(typeof group == "undefined")
            return;
        if(socket.PLAYER.name == group.owner)
            group.leave(player.name);

    });

    socket.on("war", playerName => {

        const player = Player.list[playerName];

        if(typeof player == "undefined")
            return;
        
        const room = Room.list[player.room];
        room.war(socket.PLAYER, player);

    });

    socket.on("peace", playerName => {

        const player = Player.list[playerName];

        if(typeof player == "undefined")
            return;
        
        const room = Room.list[player.room];
        room.peace(socket.PLAYER, player);

    });

    socket.on("ask-for-peace", playerName => {

        const player = Player.list[playerName];

        if(typeof player == "undefined")
            return;
        
        const room = Room.list[player.room];
        room.askForPeace(socket.PLAYER, player);

    });

    socket.on("disconnect", () => {
        if(typeof socket.PLAYER != "undefined") {
            console.log(socket.PLAYER.name + " <- [X]");
            socket.PLAYER.left = true;
            // socket.PLAYER.dsRoom.remove();
            const room = Room.list[socket.PLAYER.room];
            if(typeof room != "undefined")
                room.checkUsersLeft();
        }
        else {
            console.log("Client <- [X]");
        }
        if(typeof socket.MEMBER != "undefined") {
            delete socket.MEMBER.SOCKET;
            Discord.Room.list.waiting.connect(socket.MEMBER);
        }
        delete sockets[socket.id];
    });

    socket.on("ds-join", token => {

        if(typeof socket.PLAYER == "undefined" || typeof socket.MEMBER == "undefined")
            return;
        
        const player = socket.PLAYER;
        const room = Room.list[player.room];

        if(typeof room == "undefined")
            return;

        const group = room.groups[token];

        if(typeof group == "undefined")
            return;

        group.dsRoom.connect(socket.MEMBER);

    });

    socket.on("code", code => {

        queue[code] = socket;

    });

    socket.on("voice-invite", name => {

        const player = Player.list[name];

        if(typeof player == "undefined")
            return;

        if(socket.PLAYER == "undefined")
            return;
        
        if(socket.MEMBER == "undefined")
            return;
        
        socket.PLAYER.dsRoom.connect(socket.MEMBER);

        player.socket.emit("voice-invite", socket.PLAYER.name);

    });

    socket.on("voice-join", name => {

        const player = Player.list[name];

        if(typeof player == "undefined")
            return;

        if(socket.MEMBER == "undefined")
            return;

        player.socket.emit("voice-join", socket.PLAYER.name);
        player.dsRoom.connect(socket.MEMBER);

    });

    socket.on("voice-kick", name => {

        const player = Player.list[name];

        if(typeof player == "undefined")
            return;

        if(socket.MEMBER == "undefined")
            return;

        socket.PLAYER.dsRoom.disconnect(player.socket.MEMBER);

    });

    socket.on("common-voice", msg => {

        if(socket.MEMBER == "undefined")
            return;

        const player = socket.PLAYER;

        if(typeof player == "undefined")
            return;

        const room = Room.list[player.room];

        if(typeof room == "undefined")
            return;

        room.dsRoom.connect(socket.MEMBER);

    });

    socket.on("leave-voice", msg => {

        if(socket.MEMBER == "undefined")
            return;

        const player = socket.PLAYER;

        if(typeof player == "undefined")
            return;
        
        Discord.Room.list.waiting.connect(socket.MEMBER);

    });

    socket.on("LOGIN", ([username, password]) => {

        const user =  GameUser.find(username);
            
        if(user == null) {

            const code = Math.floor(Math.random()*1000);
            socket.emit("verify-code", code);
            socket.LOGIN = {
                username: username,
                password: password
            };
            queue[code] = socket;

        }
        else {

            if(user.password == password) {

                GameUser.list[user.username].login(socket);

            }

        }

    });

    socket.on("PLAY", () => {

        if(typeof socket.MEMBER == "undefined" || socket.MEMBER.voice.channelID == null)
            return socket.emit("not-in-voice", true);
        
        socket.emit("PLAY", true);

    });

    socket.on("room-max-players", ([n, password]) => {

        if(socket.MEMBER == "undefined")
            return;

        const player = socket.PLAYER;

        if(typeof player == "undefined")
            return;

        const room = Room.list[player.room];

        if(typeof room == "undefined")
            return;

        if(room.password == password) {
            room.MAX_PLAYERS = parseFloat(n) || 2;
        }

    });

});