var canPlay;
var accessToken = "";
var gameToken = "";

function newGame() {
  var requestData = {};
  requestData.userName = document.getElementById("loginForm").elements[0].value;
  requestData.size = document.getElementById("loginForm").elements[1].value;

  var params = {
    url: "http://localhost:8888/new_game",
    type: "POST",
    dataType: "json",
    data: requestData,
    success: onResponseSuccess,
    error: onResponseError
  };

  $.ajax(params);
}

function joinGame() {
  var requestData = {};
  requestData.userName = document.getElementById("joinForm").elements[0].value;
  requestData.gameToken = document.getElementById("joinForm").elements[1].value;
  gameToken = requestData.gameToken;

  var params = {
    url: "http://localhost:8888/join_game",
    type: "POST",
    dataType: "json",
    data: requestData,
    success: onResponseSuccess,
    error: onResponseError
  };

  $.ajax(params);
}

function onResponseSuccess(response) {
  var responseCode = response.code;
  switch (responseCode) {
    case 1: gameCreated(response); break;
    case 2: playerJoin(response); break;
    case 3: break;
    case 4: iCanPlay(response); break;
    case 5: iCantPlay(response); break;
    case 6: playerHasJoin(response); break;
    case 7: playerHasntJoin(response); break;
    case 8: playerMakeMove(response); break;
    case 9: cellNotEmpty(response); break;
  }
}

function onResponseError(response) {

}

var intervalHasPlayerJoin;
var intervalCanIPlay;
//приходит игроку, создавшему игру
function gameCreated(response) {
  if (response.status != "error") {
    accessToken = response.access_token;
    gameToken = response.game_token;
    canPlay = false;
    console.log(response.message);

    var newHref = document.location;
    newHref.hash = "#/new_game";
    document.location = newHref;

    intervalHasPlayerJoin = setInterval("hasPlayerJoin()", 4000);
  }
}

//приходит игроку, присоединившемуся к игре
function playerJoin(response) {
  if (response.status != "error") {
    accessToken = response.access_token;
    canPlay = false;
    console.log(response.message);

    var newHref = document.location;
    newHref.hash = "#/join_game";
    document.location = newHref;

    intervalCanIPlay = setInterval("canIPlay()", 4000);
  }
}

function canIPlay() {
  var requestData = {};
  requestData.gameToken = gameToken;
  requestData.accessToken = accessToken;
  var params = {
    url: "http://localhost:8888/can_i_play",
    type: "GET",
    dataType: "json",
    data: requestData,
    success: onResponseSuccess,
    error: onResponseError
  };

  $.ajax(params);
}

function hasPlayerJoin() {
  var requestData = {};
  requestData.gameToken = gameToken;
  var params = {
    url: "http://localhost:8888/has_player_join",
    type: "GET",
    dataType: "json",
    data: requestData,
    success: onResponseSuccess,
    error: onResponseError
  };

  $.ajax(params);
}

//приходит игроку, создавшему игру
function playerHasJoin(response) {
  if (response.status != "error") {
    canPlay = true;
    console.log(response.message);
    clearInterval(intervalHasPlayerJoin);
  }
}

//приходит игроку, создавшему игру
function playerHasntJoin(response) {
  if (response.status != "error") {
    canPlay = false;
    console.log(response.message);
  }
}

function playerMakeMove(response) {
  if (response.status != "error") {
    canPlay = false;
    console.log(response.message);
    //todo спамить сервер пока игроку не разрешат сходить
    intervalCanIPlay = setInterval("canIPlay()", 4000);
    if (response.playerQueue == 1) {
      document.getElementById(cellID).className = 'cell ' + 'player';
    } else {
      document.getElementById(cellID).className = 'cell ' + 'ai';
    }
  }
}

function cellNotEmpty(response) {
  if (response.status != "error") {
    canPlay = true;
    console.log(response.message);
  }
}

function iCanPlay(response) {
  if (response.status != "error") {
    canPlay = true;
    console.log(response.message);
    //todo перестать спамить сервер пока игроку не разрешат сходить
    clearInterval(intervalCanIPlay);
    var lastStep = response.last_step;
    var playerQueue = response.playerQueue;
    makeMove(lastStep, playerQueue);
  }
}

function iCantPlay(response) {
  if (response.status != "error") {
    canPlay = false;
    console.log(response.message);
    //todo спамить сервер пока игроку не разрешат сходить
  }
}

function makeMove(step, queue) {

}