() => {

    $socket = io();

    $USERNAME = null;//"LORD"+Math.floor(Math.random()*10);//null;
    $ROOM = null;
    $PASS = null;
    $GAME_STARTED = false;

    let login = 0;
    
    let vrf = false;

    const code = String(Math.round(Math.random()*10000));
    socket.emit("code", code);

    setInterval(() => {
        if(USERNAME == null || USERNAME == "") {
            if(UI._alert == null) {
                UI.alert("Enter your username:", {
                    ok (msg) {
                        tx_username.text = USERNAME = msg.input.DOM.value;
                    }
                }, true);
            }
        }
        else if(!vrf)
            UI.alert("Send code bellow to the Discord channel:\n"+code);
        else if(login == 1 && (ROOM == null || ROOM == "")) {
            if(UI._alert == null) {
                UI.alert("Enter your room name:", {
                    ok (msg) {
                        tx_room.text = ROOM = msg.input.DOM.value;
                    }
                }, true);
            }
        }
        else if(login == 1 && (PASS == null || PASS == "")) {
            if(UI._alert == null) {
                UI.alert("Enter your room password:", {
                    ok (msg) {
                        PASS = msg.input.DOM.value;
                    }
                }, true);
            }
        }
        else if(login == 1) {
            login = 2;
            socket.emit("join", [ROOM, PASS]);
        }
    }, 300);

    socket.on("verify", (name) => {
        UI.alert("Verified! Your name is\n"+name);
        vrf = true;
        socket.emit("login", USERNAME);
    });
    
    socket.on("login", msg => {
        
        login = 1;
        
    });

    socket.on("map", map => {
        MAP.load(play_scene, tiles, map);
    });

    socket.on("player", player => {
        
        GAME_STARTED = true;
        MAP.initPlayer(player);

    });

    socket.on("army-update", army => {

        const a = MAP.findArmy(army);
        if(a == null)
            MAP.initArmy(army, play_armies);
        else
            MAP.updateArmy(army, a);

    });

    socket.on("army-delete", id => {

        const a = MAP.findArmy({id:id});

        if(a != null) {
            MAP.deleteArmy(a);
        }

    });

    socket.on("update-tile", tile => {
        MAP.updateTile(tile);
    });

    socket.on("join-group", ({name, list, enemies, owner, token}) => {

        MAP.addGroup(name, list, enemies, owner, token);
        
    });

    socket.on("leave-group", token => {

        MAP.removeGroup(token);
        
    });

    socket.on("invite-group", ({name, list, enemies, owner, token}) => {

        UI.alert(`Do you want to join group "${name}"?\nMembers: ${list}\nOwner: ${owner}`, {
            no () {
                
            },
            ok () {
                socket.emit("join-group", token);
            }
        });
        
    });

    socket.on("update-groups", ({friends, enemies}) => {
        
        MAP.updateGroups(friends, enemies);

    });

    socket.on("ask-for-peace", name => {

        const res = confirm(`Player ${name} wants to make peace with you.`);

        if(res)
            socket.emit("peace", name);

    });

    socket.on("defeat", name => {

        alert("You lost!");

        DEFEATED = true;
        GAME_STARTED = false;

    });

    socket.on("reload", () => {

        window.location.reload();

    });

    socket.on("voice-invite", name => {

        UI.alert("Player "+name+" invites you to a conference.\nAccept?", {
            no () {

            },
            ok () {
                socket.emit("voice-join", name);
            }
        });
            

    });

    socket.on("group-list", ({ list, token }) => {

        const group = MAP.groups[token];

        if(typeof group == "undefined")
            return;
        
        group.list = list;

    });

    socket.on("voice-list", list => {

        tx_voice_list.text = list.join("\n");
        
    });

}
