var clicks = 0;

function clickings(number){
    clicks = clicks + number;
    document.getElementById("clicks").innerHTML = clicks;
};

var cursors = 0;

function buyCursor() {
    var cursorCost = Math.floor(10 * Math.pow(1.1,cursors));    //works out cost of this cursor
    if(clicks >= cursorCost){                                   //checks if user/player can afford the cursor
        cursors = cursors + 1;                                   //increases number of cursors
        clicks = clicks - cursorCost;                           //removes the clickers spent
        document.getElementById('cursors').innerHTML = cursors; //updates the number of cursors for the user/player
        document,getElementById('clicks').innerHTML = clicks;  //updates the number of clickers for the user/player
    };
    var nextCost = Math.floor(10* Math.pow(1.1,cursors));       //works out the cost of next cursor
    document.getElementById('cursorCost').innerHTML = nextCost; //updates the next cursor cost for the user/player
};

window.setInterval(function(){
    clickings(cursors);

}, 1000);

function save(){
    var save = {
        clicks: clicks,
        cursors: cursors,
        prestige: prestige
}
};

localStorage.setItem("save", JSON.stringify(save));

function load(){
    var savegame = JSON.parse(localStorage.getItem("save"));
};


if(typeof savegame.clicks !== "undefined") clicks = savegame.clicks;
localStorage.removeItem("save")

function pretty(input){
    var output = Math.round(input * 1000000)/1000000;
    return output;
}

document.getElementById('clicks').innerHTML = pretty(clicks);