var socket = io();
var config = {};

var playerName = ""//= prompt("Choose a username");
var side = 32;
var canvasHeight = 15;//*side
var canvasWidth = 25;//*side
var fogRadius = 50;
var players, obstacles, energies, golds;
var gameStarted = false;
var gameOver = false;
var onSpace = false;
var playerX;
var playerY;
var playerHasGold = false;
var bases = [{ x: 0, y: 0, color: 'red' },
{ x: (canvasWidth - 2) * side, y: 0, color: 'green' },
{ x: 0, y: (canvasHeight - 2) * side, color: "blue" },
{ x: (canvasWidth - 2) * side, y: (canvasHeight - 2) * side, color: "yellow" }];
var chatDiv = document.getElementById('chat');
var input = document.getElementById('message');
var button = document.getElementById('submit');
var msgDiv = document.getElementById('msg')
var scoreP = document.getElementById("scoreP");
var energyP = document.getElementById("energyP");
var eventsDiv = document.getElementById("events");
var imgs;
// if (gameStarted) {
//     alert("You Are " + config.color);
// }
// socket = io.connect('http://localhost:3000');

function setup() {
    createCanvas(32 * 25, 32 * 15);
    noStroke()
    //load all images
    var x = "gui/Resources/";
    imgs = {
        truck: loadImage("gui/truck/default.png"),
        bg: loadImage(x + "hud.png"),
        bg_1: loadImage(x + "grass.png"),
        bg_2: loadImage(x + "mars.png"),
        bg_3: loadImage(x + "moon.png"),
        bg_4: loadImage(x + "ice.png"),
        bg_5: loadImage(x + "sand.png"),
        B_blue: loadImage(x + "camp_blue.png"),
        B_red: loadImage(x + "camp_red.png"),
        B_yellow: loadImage(x + "camp_yellow.png"),
        B_green: loadImage(x + "camp_green.png"),
        Gold: loadImage(x + "gold.png"),
        Obstacle: loadImage(x + "obstacle_1.png"),
        red_Truck: loadImage(x + "player_red_2.png"),
        green_Truck: loadImage(x + "player_green_2.png"),
        yellow_Truck: loadImage(x + "player_yellow_2.png"),
        blue_Truck: loadImage(x + "player_blue_2.png"),
        Cargo_Gold_left: loadImage(x + "cargo_gold_2.png"),
        Cargo_Gold_up: loadImage(x + "cargo_gold_1.png"),
        Power: loadImage(x + "power.png"),
        PowerUp: loadImage(x + "upgrade_power.png"),
        Laser_left: loadImage(x + "bullet1_1.png"),
        Laser_right: loadImage(x + "bullet1_3.png"),
        Laser_up: loadImage(x + "bullet1_2.png"),
        Laser_down: loadImage(x + "bullet1_4.png")
    };
    console.log("setup")
}
function preLoad() {
    console.log("preload");
}
function draw() {
    if (keyIsDown(13)) {
        handleSubmit();
    }
    // if (gameOver) {
    //     GameOver()
    //     // background("#acacac");
    //     // textSize(58);
    //     // text('GAME OVER', 30, 60);
    //     // textSize(28);
    //     // text('Energy is over', 30, 90);
    //     // textSize(38);
    //     // text('Your Score:' + playerScore, 30, 110);
    // }
    if (gameStarted) {
        // Draw_Bg(); // Clear the screen
        // var img = imgs.bg;
        // image(img, 0, 0, canvasWidth, canvasHeight);
        background("#6dff66");
        drawPlayer(); // Draw the player

        drawResources(); // Draw the resources
        // WAR FOG
        fill('#191919');
        rect(0, 0, playerX - fogRadius, canvasHeight * side);
        rect(0, 0, canvasWidth * side, playerY - fogRadius);
        rect(playerX + side + fogRadius, 0, canvasWidth * side, canvasHeight * side);
        rect(0, playerY + side + fogRadius, canvasWidth * side, canvasHeight * side);

        var eng = Math.floor(playerEnergy);
        energyP.innerHTML = 'Energy:' + eng;

        if (golds.length <= 0) {
            GameOver();
            return;
        }
        if (playerEnergy < 0.5) {
            Energy_Over()
            return;
        }
        // Add elses in this if contruction to lock diagonal movement
        //________________________RIGHT__________________   
        if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && playerX < (width - side)) {
            for (var coords of obstacles) {
                if (Collision_right(coords)) return;
            }
            for (var i in golds) {
                var coords = golds[i];
                if (Collision_right(coords)) {
                    if (playerHasGold) return;
                    playerHasGold = true;
                    golds.splice(i, 1);
                    socket.emit('splice gold', i);
                }
            }
            for (var i in energies) {
                var coords = energies[i];
                if (Collision_right(coords)) {
                    ++playerEnergy;
                    energies.splice(i, 1);
                    socket.emit('splice Energy', i);
                }
            }
            for (var i in bases) {
                if (Base_Collision_right(bases[i])) {
                    if (playerHasGold && bases[i].color == playerColor) {
                        playerHasGold = false;
                        ++playerScore;
                        scoreP.innerHTML = 'Score:' + playerScore; Gold_In_Base(playerScore);
                    }
                    return;
                }
            }
            for (var i in players) {
                if (players[i].color != playerColor) {
                    if (Collision_right(players[i])) {
                        return;
                    }
                }
            }
            playerEnergy -= 0.01;
            playerX += side / 8;
            socket.emit('move', { nick: playerName, x: playerX, y: playerY, color: config.color, hasGold: playerHasGold, energy: Math.floor(playerEnergy), score: playerScore });
        }
        //__________________LEFT_____________________
        if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && playerX > 0) {
            for (var coords of obstacles) {
                if (Collision_left(coords)) return;
            }
            for (var i in golds) {
                var coords = golds[i];
                if (Collision_left(coords)) {
                    if (playerHasGold) return;
                    playerHasGold = true;
                    golds.splice(i, 1);
                    socket.emit('splice gold', i);
                }
            }
            for (var i in energies) {
                var coords = energies[i];
                if (Collision_left(coords)) {
                    ++playerEnergy;
                    energies.splice(i, 1);
                    socket.emit('splice Energy', i);
                }
            }
            for (var i in bases) {
                if (Base_Collision_left(bases[i])) {
                    if (playerHasGold && bases[i].color == playerColor) {
                        playerHasGold = false;
                        ++playerScore;
                        scoreP.innerHTML = 'Score:' + playerScore; Gold_In_Base(playerScore);
                    }
                    return;
                }
            }
            for (var i in players) {
                if (players[i].color != playerColor) {
                    if (Collision_left(players[i])) {
                        return;
                    }
                }
            }
            playerEnergy -= 0.01;
            playerX -= side / 8;
            socket.emit('move', { nick: playerName, x: playerX, y: playerY, color: config.color, hasGold: playerHasGold, energy: Math.floor(playerEnergy), score: playerScore });
        }
        //____________________________UP_______________________
        if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && playerY > 0) {
            for (var coords of obstacles) {
                if (Collision_up(coords)) return;
            }
            for (var i in golds) {
                var coords = golds[i];
                if (Collision_up(coords)) {
                    if (playerHasGold) return;
                    playerHasGold = true;
                    golds.splice(i, 1);
                    socket.emit('splice gold', i);
                }
            }
            for (var i in energies) {
                var coords = energies[i];
                if (Collision_up(coords)) {
                    ++playerEnergy;
                    energies.splice(i, 1);
                    socket.emit('splice Energy', i);
                }
            }
            for (var i in bases) {
                if (Base_Collision_up(bases[i])) {
                    if (playerHasGold && bases[i].color == playerColor) {
                        playerHasGold = false;
                        ++playerScore;
                        scoreP.innerHTML = 'Score:' + playerScore;
                        Gold_In_Base(playerScore);
                    }
                    return;
                }
            }
            for (var i in players) {
                if (players[i].color != playerColor) {
                    if (Collision_up(players[i])) {
                        return;
                    }
                }
            }
            playerEnergy -= 0.01;
            playerY -= side / 8;
            socket.emit('move', { nick: playerName, x: playerX, y: playerY, color: config.color, hasGold: playerHasGold, energy: Math.floor(playerEnergy), score: playerScore });
        }
        //_________________________________DOWN_____________________________
        if ((keyIsDown(DOWN_ARROW) || keyIsDown(83)) && playerY < (height - side)) {
            for (var coords of obstacles) {
                if (Collision_down(coords)) return;
            }
            for (var i in golds) {
                var coords = golds[i];
                if (Collision_down(coords)) {
                    if (playerHasGold) return;
                    playerHasGold = true;
                    golds.splice(i, 1);
                    socket.emit('splice gold', i);
                }
            }
            for (var i in energies) {
                var coords = energies[i];
                if (Collision_down(coords)) {
                    ++playerEnergy;
                    energies.splice(i, 1);
                    socket.emit('splice Energy', i);
                }
            }
            for (var i in bases) {
                if (Base_Collision_down(bases[i])) {
                    if (playerHasGold && bases[i].color == playerColor) {
                        playerHasGold = false;
                        ++playerScore;
                        scoreP.innerHTML = 'Score:' + playerScore;
                        Gold_In_Base(playerScore);
                    }
                    return;
                }
            }
            for (var i in players) {
                if (players[i].color != playerColor) {
                    if (Collision_down(players[i])) {
                        return;
                    }
                }
            }
            playerEnergy -= 0.01;
            playerY += side / 8;
            socket.emit('move', { nick: playerName, x: playerX, y: playerY, color: config.color, hasGold: playerHasGold, energy: Math.floor(playerEnergy), score: playerScore });
        }


    }//game started
    else {
        background("#acacac");
        textSize(38);
        text('Wainting for players to join the game...', 30, 260);
    }
    // if (noSpace) {
    //     background("#acacac");
    //     textSize(38);
    //     text('No space left, please wait until the next session', 30, 60);
    // }
    var serverP = document.getElementsByClassName('serverP')
if(serverP.length > 10){
    serverP[0].remove();
}
var msgP = document.getElementsByClassName('msgP')
if(msgP.length > 11){
    msgP[0].remove();
}
}//draw end
// setInterval(function () {
//     if (playerEnergy > 1) {
//         --playerEnergy;
//         energyP.innerHTML = "Energy:" + playerEnergy;
//     }
//     else if (playerEnergy <= 1) {
//         --playerEnergy;
//         energyP.innerHTML = "Energy:" + playerEnergy;
//         gameOver = true;
//     }
// }, 10000);


socket.on('game started', function (data) {
    gameStarted = true;
    golds = data.golds;
    energies = data.energies;
    obstacles = data.obstacles;
    players = data.players;
});

socket.on('config data', function (data) {
    config = data;
    playerX = config.x;
    playerY = config.y;
    playerColor = config.color;
    playerScore = config.score;
    playerEnergy = config.energy;
    while (playerName === "" || playerName === null) {
        playerName = prompt("Choose a username");
    }
    config.nick = playerName;
    socket.emit('player has join', config);
    alert('You are ' + playerColor);
});

socket.on('main data', function (data) {
    golds = data.golds;
    energies = data.energies;
    obstacles = data.obstacles;
    players = data.players;
});
socket.on('no space', function () {
    var onSpace = true;
});
socket.on('join message', function (data) {
    Join_Msg(data)

});
//chat------
function handleSubmit(evt) {
    var val = input.value;
    if (val != "" || val == undefined) {
        socket.emit("send message", { val: val, nick: playerName });
    }
}
button.onclick = handleSubmit;
function handleMessage(data) {
    var p = document.createElement('p');
    p.setAttribute("class", "msgP");
    var senderP = document.createElement('p');
    senderP.innerText = data.nick + ": ";
    senderP.setAttribute("class", "sender");
    senderP.setAttribute("style", "font-size:20px; color:green; display:inline-block;");
    p.appendChild(senderP);
    p.innerHTML +=/*data.nick+": "+ */data.val;
    msgDiv.appendChild(p);
    input.value = "";
}

socket.on('display message', handleMessage);


// setInterval(function(){
//     var forDel = document.getElementsByClassName("serverP")[0].remove();
//     var forDel = document.getElementsByClassName("msgP")[0].remove();
    
// },10000)