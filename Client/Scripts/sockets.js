() => {

    // socket io start
    $socket = io();
    // initializing global variables
    $USERNAME = null;
    $ROOM = null;
    $PASS = null;
    $GAME_STARTED = false;

    let login = 0;
    // 0 - not logged in
    // 1 - logged in
    // 2 - joined the room
    
    // let vrf = false;

    // // generating verification code
    // const code = String(Math.round(Math.random()*10000));
    // socket.emit("code", code);

    $ROOM_REQUEST = () => {
        setInterval(() => {
            if(login == 1 && (ROOM == null || ROOM == "")) {
                if(UI._alert == null) {
                    // room title window
                    UI.alert("Enter your room name:", {
                        ok (msg) {
                            tx_room.text = ROOM = msg.input.DOM.value;
                        }
                    }, true);
                }
            }
            else if(login == 1 && (PASS == null || PASS == "")) {
                if(UI._alert == null) {
                    // room password window
                    UI.alert("Enter your room password:", {
                        ok (msg) {
                            PASS = msg.input.DOM.value;
                        }
                    }, true);
                }
            }
            else if(login == 1) {
                login = 2;
                // joining the room
                socket.emit("join", [ROOM, PASS]);
            }
        }, 300);
    }

    // // verification listener
    // socket.on("verify", (name) => {
    //     UI.alert("Verified! Your name is\n"+name);
    //     vrf = true;
    //     socket.emit("login", USERNAME);
    // });
    
    // socket.on("login", msg => {
        
    //     login = 1;
        
    // });

    socket.on("map", map => {
        // load battlemap
        MAP.load(play_scene, tiles, map);
    });

    socket.on("player", player => {
        
        // the game starts
        GAME_STARTED = true;
        MAP.initPlayer(player);

    });

    socket.on("army-update", army => {

        // army gets created or just updates
        const a = MAP.findArmy(army);
        if(a == null)
            MAP.initArmy(army, play_armies);
        else
            MAP.updateArmy(army, a);

    });

    socket.on("army-delete", id => {

        // army removing

        const a = MAP.findArmy({id:id});

        if(a != null) {
            MAP.deleteArmy(a);
        }

    });

    socket.on("update-tile", tile => {
        // update tile (from socket)
        MAP.updateTile(tile);
    });

    socket.on("join-group", ({name, list, enemies, owner, token}) => {
        // accepting the invitation to the group
        MAP.addGroup(name, list, enemies, owner, token);
        
    });

    socket.on("leave-group", token => {
        // leaving the group
        MAP.removeGroup(token);
        
    });

    socket.on("invite-group", ({name, list, enemies, owner, token}) => {
        // invite player to group
        UI.alert(`Do you want to join group "${name}"?\nMembers: ${list}\nOwner: ${owner}`, {
            no () {
                
            },
            ok () {
                socket.emit("join-group", token);
            }
        });
        
    });

    socket.on("update-groups", ({friends, enemies}) => {
        // update list og friends and enemies and update their tiles color
        MAP.updateGroups(friends, enemies);

    });

    socket.on("ask-for-peace", name => {

        // peace offer to the player
        const res = confirm(`Player ${name} wants to make peace with you.`);

        if(res)
            socket.emit("peace", name);

    });

    socket.on("defeat", name => {

        // now the player actually is f**n looser!
        UI.alert("You lost!");

        DEFEATED = true;
        GAME_STARTED = false;

    });

    socket.on("reload", () => {

        // reload the page by server command
        window.location.reload();

    });

    socket.on("voice-invite", name => {

        // voice invitation
        UI.alert("Player "+name+" invites you to a conference.\nAccept?", {
            no () {

            },
            ok () {
                socket.emit("voice-join", name);
            }
        });
            

    });

    socket.on("group-list", ({ list, token }) => {

        // update the list of groups
        const group = MAP.groups[token];

        if(typeof group == "undefined")
            return;
        
        group.list = list;

    });

    socket.on("voice-list", list => {

        // update the list of players in current voice channel
        tx_voice_list.text = list.join("\n");
        
    });

    function verifyCode (code) {
        UI.alert("Type the code "+code+" into a Discord channel", {
            ok () {
                verifyCode(code);
            }
        }, false, menu_buttons);
    }

    socket.on("verify-code", code => {

        verifyCode(code);

    });

    socket.on("verify", name => {

        UI.alert("Your account attached to "+name, { ok () {} }, false, menu_buttons);

    });

    socket.on("login", () => {
        UI.alert("Logged in successfully! ", { ok () {} }, false, menu_buttons);
        login = 1;
        login_button.txt.destroy();
        login_button = login_button.destroy();
        localStorage.USERNAME = USERNAME;
        localStorage.PASSWORD = PASSWORD;
        const play = new QBUTTON({
            pos: vec2(0, 0),
            size: vec2(350, 80),
            layer: menu_buttons,
            private: {
                text: "Play",
                text_color: rgb(255, 255, 255),
                onclick () {
                    if(UI._alert == null)
                        socket.emit("PLAY", true);
                }
            }
        });
    });

    socket.on("not-in-voice", () => {
        UI.alert("Join voice channel first!", { ok () {} }, false, menu_buttons);
    });
    
    socket.on("PLAY", () => {
        play_scene.set();
    });

}
