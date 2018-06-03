function drawPlayer() { // Draw the player
    for (var i in players) {
        var col = players[i].color;
        var x = players[i].x;
        var y = players[i].y;
        if (col == "red") {
            var img = imgs.red_Truck;
        }
        else if (col == "blue") {
            var img = imgs.blue_Truck;
        }
        else if (col == "green") {
            var img = imgs.green_Truck;
        }
        else if (col == "yellow") {
            var img = imgs.yellow_Truck;
        }
        image(img, x, y)
        if (players[i].hasGold) {
            var img = imgs.Cargo_Gold_left;
            image(img, x, y);
        }
    }
}

function drawResources() { // Draw the resources
    var img = imgs.Obstacle;
    for (var coords of obstacles) {
        var x = coords.x;
        var y = coords.y;
        image(img, x, y);
    }
    var img = imgs.Gold;
    for (var coords of golds) {
        var x = coords.x;
        var y = coords.y;
        image(img, x, y);
    }
    var img = imgs.Power;
    for (var coords of energies) {
        var x = coords.x;
        var y = coords.y;
        image(img, x, y);
    }
    for (var i in bases) {
        var x = bases[i].x;
        var y = bases[i].y;
        var col = bases[i].color;
        if (col == 'red') {
            var img = imgs.B_red;
        }
        else if (col == 'green') {
            var img = imgs.B_green;
        }
        else if (col == 'blue') {
            var img = imgs.B_blue;
        }
        else if (col == 'yellow') {
            var img = imgs.B_yellow;
        }
        image(img, x, y);
    }
}
function Draw_Bg() {
    var img = imgs.bg_1;
    for (var x = 0; x < canvasWidth; x += side) {
        for (var y = 0; y < canvasHeight; y += side) {
            image(img, x, y);
        }
    }
}
// Detect the collision
function Collision_right(coords) {
    var obstacleX = coords.x;
    var obstacleY = coords.y;

    var playerOX = playerX + (side / 2);
    var playerOY = playerY + (side / 2);

    var objectOX = obstacleX + (side / 2);
    var objectOY = obstacleY + (side / 2);

    if (objectOX - playerOX <= side && objectOX - playerOX >= 0) {
        if (Math.abs(playerOY - objectOY) < side) {
            return true;
        }
    }
    return false;
}

function Collision_left(coords) {
    var obstacleX = coords.x;
    var obstacleY = coords.y;

    var playerOX = playerX + (side / 2);
    var playerOY = playerY + (side / 2);

    var objectOX = obstacleX + (side / 2);
    var objectOY = obstacleY + (side / 2);

    if (playerOX - objectOX <= side && playerOX - objectOX >= 0) {
        if (Math.abs(playerOY - objectOY) < side) {
            return true;
        }
    }
    return false;
}

function Collision_up(coords) {
    var obstacleX = coords.x;
    var obstacleY = coords.y;

    var playerOX = playerX + (side / 2);
    var playerOY = playerY + (side / 2);

    var objectOX = obstacleX + (side / 2);
    var objectOY = obstacleY + (side / 2);

    if (playerOY - objectOY <= side && playerOY - objectOY >= 0) {
        if (Math.abs(playerOX - objectOX) < side) {
            return true;
        }
    }
    return false;
}

function Collision_down(coords) {
    var obstacleX = coords.x;
    var obstacleY = coords.y;

    var playerOX = playerX + (side / 2);
    var playerOY = playerY + (side / 2);

    var objectOX = obstacleX + (side / 2);
    var objectOY = obstacleY + (side / 2);

    if (objectOY - playerOY <= side && objectOY - playerOY >= 0) {
        if (Math.abs(playerOX - objectOX) < side) {
            return true;
        }
    }
    return false;
}

function Base_Collision_left(base) {

    var base1 = { x: base.x + side, y: base.y };
    var base2 = { x: base.x + side, y: base.y + side };
    if (Collision_left(base1) || Collision_left(base2)) {
        return true;
    }
    return false;
}
function Base_Collision_right(base) {

    var base3 = { x: base.x, y: base.y + side };

    if (Collision_right(base) || Collision_right(base3)) {
        return true;
    }
    return false;
}
function Base_Collision_down(base) {
    var base1 = { x: base.x + side, y: base.y };

    if (Collision_down(base) || Collision_down(base1)) {
        return true;
    }
    return false;
}
function Base_Collision_up(base) {
    var base2 = { x: base.x + side, y: base.y + side };
    var base3 = { x: base.x, y: base.y + side };
    
    if (Collision_up(base2) || Collision_up(base3)) {
        return true;
    }
    return false;
}
//__________EVENTS____________
function Energy_Over(){
    playerEnergy = 0;
    background("#acacac");
    fill(0);
    textSize(38);
    text('Your energy is over', 30, 160);
    // var p = document.createElement("p");
    // p.innerHTML = 'Your energy is over.<br> Wait for new game...';
    // p.setAttribute("class", "serverP");
    // eventsDiv.appendChild(p);
}
function GameOver() {
    background("grey");
    fill(0);
    textSize(58);
    text('GAME OVER', 160, 50);

    textSize(30);
    fill("red");
    text(players[0].nick + ' Score: ' + players[0].score + '; Energy: ' + players[0].energy, 30, 100);

    fill("green");
    text(players[1].nick + ' Score: ' + players[1].score + '; Energy: ' + players[1].energy, 30, 140);

    fill("blue");
    text(players[2].nick + '  Score: ' + players[2].score + '; Energy: ' + players[2].energy, 30, 180);

    fill("yellow");
    text(players[3].nick + ' Score: ' + players[3].score + '; Energy: ' + players[3].energy, 30, 220);

    var index = GetTheWinnerIndex();
    fill('0');
    textSize(48);
    text('The Winner Is ' + players[index].nick, 20, 300)

}
function GetTheWinnerIndex() {
    var scores = [];
    for (var player of players) {
        scores.push(player.score);
    }
    var max = Math.max(...scores);
    for (var i in players) {
        if (players[i].score == max) {
            return i;
        }
    }
}
function Join_Msg(player) {
    var p = document.createElement("p");
    p.setAttribute("class", "serverP");
    p.innerHTML = player.nick + ' has joined';
    eventsDiv.appendChild(p);
    p.style.color = player.color;
    if (player.color == 'yellow') {
        Game_Started()
    }
}
function Gold_In_Base(score) {
    var p = document.createElement("p");
    p.setAttribute("class", "serverP");
    p.innerHTML = 'Gold has been moved to base';
    eventsDiv.appendChild(p);
    var p = document.createElement("p");
    p.setAttribute("class", "serverP");
    p.innerHTML = 'Your score is now ' + score;
    eventsDiv.appendChild(p);
}
function Game_Started() {
    var p = document.createElement("p");
    p.innerHTML = 'The game started!!!';
    p.setAttribute("class", "serverP");
    eventsDiv.appendChild(p);
    p.style.fontSize = '20px';
    Players_Msg(players);
}
function Players_Msg(players) {
    for (var player of players) {
        var p = document.createElement("p");
        p.setAttribute("class", "serverP");

        p.innerHTML = player.color + ' >>> ' + player.nick;
        eventsDiv.appendChild(p);
        p.style.color = player.color;
    }
}