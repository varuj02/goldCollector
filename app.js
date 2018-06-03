var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

var side = 32;
var width = 25, height = 15;

var obstaclesTokos = 3;
var goldTokos = 2;
var energyTokos = 3;

var Players = [
    { nick: "", x: 2 * side, y: 0, color: "red", hasGold: false, energy: 10, score: 0 },
    { nick: "", x: 2 * side, y: (height - 1) * side, color: "blue", hasGold: false, energy: 10, score: 0 },
    { nick: "", x: (width - 3) * side, y: 0, color: "green", hasGold: false, energy: 10, score: 0 },
    { nick: "", x: (width - 3) * side, y: (height - 1) * side, color: "yellow", hasGold: false, energy: 10, score: 0 }
];

var allCoordinates = [];
var GoldArr = [];
var EnergyArr = [];
var ObstalceArr = [];
var BaseArr = [];
var messages = []
var obstacleCount = width * height * obstaclesTokos / 100;
var goldCount = width * height * goldTokos / 100;
var energyCount = width * height * energyTokos / 100;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, function () {
    console.log("Server is listening on port " + port);
});

var playerColorCounter = 0;

io.on('connection', function (socket) {
    //chat--------
    for (var i in messages) {
        io.sockets.emit("display message", messages[i]);
    }
    socket.on("send message", function (data) {
        messages.push(data.val);
        io.sockets.emit("display message", data);
    })

    //game-------

    if (playerColorCounter == 0) {
        NewGame();
    }
    if (playerColorCounter < 4)
        socket.emit('config data', Players[playerColorCounter]);
    else {
        socket.emit('no space', 'No space left, please wait until the next session');
    }
    socket.on('player has join', function (player) {
        for (var i in Players) {
            if (Players[i].color == player.color) {
                Players[i] = player;
            }
        }
        io.sockets.emit('join message', player);
    })
    ++playerColorCounter;

    if (playerColorCounter == 4) {
        startGame();
        console.log("GAME STARTED");
    }
    console.log("New user connected, playerCount: " + playerColorCounter);

    socket.on('move', function (data) {
        for (let i in Players) {
            if (Players[i].color == data.color) {
                Players[i] = data;
            }
        };
        io.sockets.emit('main data', {
            golds: GoldArr,
            energies: EnergyArr,
            obstacles: ObstalceArr,
            players: Players
        });

    });

    socket.on('disconnect', function () {
        playerColorCounter--;
        console.log('player disconnected; playerCount:' + playerColorCounter);
    });

    socket.on('splice gold', function (index) {
        GoldArr.splice(index, 1);
    });
    socket.on('splice Energy', function (index) {
        EnergyArr.splice(index, 1);
    });

});

function startGame() {
    if (allCoordinates.length == 0) {
        generateMap();
    }
    io.sockets.emit('game started', {
        golds: GoldArr,
        energies: EnergyArr,
        obstacles: ObstalceArr,
        players: Players
    });
}

function generateMap() {
    for (var i = 0; i < goldCount; i++) {
        var x = (2 + random(width - 4)) * side, y = (2 + random(height - 4)) * side;
        if (!allCoordinates.includes(x + '' + y)) {
            GoldArr.push({ x: x, y: y })
            allCoordinates.push(x + '' + y);
        } else i--;
    }
    for (var i = 0; i < energyCount; i++) {
        var x = (2 + random(width - 4)) * side, y = (2 + random(height - 4)) * side;
        if (!allCoordinates.includes(x + '' + y)) {
            EnergyArr.push({ x: x, y: y })
            allCoordinates.push(x + '' + y);
        } else i--;
    }
    for (var i = 0; i < obstacleCount; i++) {
        var x = (2 + random(width - 4)) * side, y = (2 + random(height - 4)) * side;
        if (!allCoordinates.includes(x + '' + y)) {
            ObstalceArr.push({ x: x, y: y })
            allCoordinates.push(x + '' + y);
        } else i--;
    }
}

function random(max) {
    return Math.floor(Math.random() * max);
}
function NewGame() {
    Players = [
        { x: 2 * side, y: 0, color: "red", hasGold: false, energy: 10, score: 0 },
        { x: 2 * side, y: (height - 1) * side, color: "blue", hasGold: false, energy: 10, score: 0 },
        { x: (width - 3) * side, y: 0, color: "green", hasGold: false, energy: 10, score: 0 },
        { x: (width - 3) * side, y: (height - 1) * side, color: "yellow", hasGold: false, energy: 10, score: 0 }
    ];

    allCoordinates = [];
    GoldArr = [];
    EnergyArr = [];
    ObstalceArr = [];
    BaseArr = [];
    messages = [];
    //     socket.emit('New game');

}




