const { UserFlags } = require("discord.js");
const { MongoClient } = require("mongodb");
const Discord = require("./discord");

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

let Client = null;

mongoClient.connect(function(err, client){

    Client = client;

    GameUser.load();

});

class GameUser {

    static list = {}; //jshint ignore:line
    _login = null; //jshint ignore:line

    static load () {

        const db = Client.db("msc_users");
        const users = db.collection("users");

        users.find().toArray((err, res) => {

            for(let i in res) {
                new this(res[i].username, res[i].discordID, res[i].password, true);
            }

        });

    }

    static find (username, password = null) {

        const db = Client.db("msc_users");
        const users = db.collection("users");

        const params = {
            username: username,
            password: password
        }

        for(let i in this.list) {
            if(this.list[i].username == params.username && (this.list[i].password == params.password || params.password == null))
                return this.list[i];
        }

    }

    constructor (username, discordID, password, load = false) {

        this.username = username;
        this.discordID = discordID;
        this.password = password;
        this.socket = null;
        if(!load)
            this.save();

        this.constructor.list[this.username] = this;

    }

    login (socket) {

        this.socket = socket;
        socket.MEMBER = Discord.guild.members.cache.find(member => member.id == this.discordID);
        // Discord.guild.members.fetch().then(console.log).catch(console.error);
        // Discord.guild.members.cache.forEach(member => {
        //     console.log(member);
        // });
        if(typeof socket.MEMBER == "undefined")
            return socket.emit("not-in-voice", true);
            
        socket.MEMBER.SOCKET = socket;

        if(this.username in Player.list && !Player.list[this.username].left)
            return socket.emit("reload", true);

        console.log(this.username + " -> []");

        socket.emit("login", true);
        socket.PLAYER = new Player(this.username, socket);

    }

    save () {

        const db = Client.db("msc_users");
        const users = db.collection("users");
        
        users.findOne({ username: this.username }, (err, res) => {
            
            const login = this._login;
            this._login = null;

            if(res == null) {

                users.insertOne(this, () => {
                    if(login != null)
                        this.login(login);
                });

            }

        });

    }

}

module.exports = GameUser;