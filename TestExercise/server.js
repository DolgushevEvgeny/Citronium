var formidable = require("formidable");
var fs = require("fs");
var url = require("url");
var http = require("http");
var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  console.log("Request get / received.");

  response = setResponseHeaders(response);
  response.sendFile(__dirname + '/public/index.html');
  console.log("Response / sent.");
});

//app.get('/create_game', function(request, response) {
//  console.log("Request get /create_game received.");
//
//  response = setResponseHeaders(response);
//  response.send();
//  console.log("Response /create_game sent.");
//});

app.post('/new_game', function(request, response) {
  console.log("Request post /new_game received.");

  var form = new formidable.IncomingForm();
  var userName,
      size;
  form.parse(request, function(error, fields, files) {
    userName = fields.userName;
    size = fields.size;
    console.log("parsing done: " + userName + " " + size);
  });

  var answer = {};
  answer.game_token = generateGameToken();
  answer.access_token = generateAccessToken();

  MongoClient.connect("mongodb://localhost:27017/gamesdb",
    function(err, db) {
      if(!err) {
        console.log("We are connected");
        var playersCollection = db.collection('players');
        var playerRecord = {'player':userName, 'access_token':answer.access_token, 'queue': 1};
        playersCollection.insertOne(playerRecord,
          function(err, result) {
            var gamesCollection = db.collection('games');
            var gameField = createGameField(size);
            var gameRecord = {'game_token':answer.game_token, 'players_count':1, 'player_step':1,
              'game_field':gameField, 'last_step':[0,0]
            };
            gamesCollection.insertOne(gameRecord);
            db.close();
            answer.status = "ok";
            answer.code = 1;
            answer.message = "Game created";
            console.log("DB closed");
            sendResponse(answer, response);
          }
        );
      } else {
        db.close();
        console.log("DB Error");
        answer.code = 1;
        answer.status = "error";
        answer.message = "Cannot connected to DB";
        sendResponse(answer, response);
      }
    }
  );
});

app.post('/join_game', function(request, response) {
  console.log("Request post /join_game received.");

  var form = new formidable.IncomingForm();
  var userName,
      gameToken;
  form.parse(request, function(error, fields, files) {
    userName = fields.userName;
    gameToken = fields.gameToken;
    console.log("parsing done: " + userName + " " + gameToken);
  });

  var answer = {};
  answer.access_token = generateAccessToken();

  MongoClient.connect("mongodb://localhost:27017/gamesdb",
    function(err, db) {
      if(!err) {
        console.log("We are connected");

        var collection = db.collection('players');
        var playerRecord = {'player':userName, 'access_token':answer.access_token, 'queue': 2};
        collection.insertOne(playerRecord);

        var gamesCollection = db.collection('games');
        gamesCollection.findOne({'game_token':gameToken},
          function(err, item) {
            if (item.players_count == 1) {
              gamesCollection.removeOne({'game_token':gameToken},
                function(err, result) {
                  var newGameRecord = {'game_token':gameToken, 'players_count':2, 'player_step':1,
                    'game_field':item.game_field, 'last_step':[0,0]
                  };
                  gamesCollection.insertOne(newGameRecord);
                  answer.status = "ok";
                  answer.code = 2;
                  answer.message = "Player join";
                  db.close();
                  console.log("added player");
                  sendResponse(answer, response);
                }
              );
            } else {
              answer.status = "ok";
              answer.code = 3;
              answer.message = "Visitor join";
              sendResponse(answer, response);
            }
          }
        );

        console.log("DB closed");
      } else {
        console.log("DB Error");
        answer.status = "error";
        answer.message = "Cannot connected to DB";
      }
    }
  );
});

app.get('/has_player_join', function(request, response) {
  console.log("Request get /has_player_join received.");
  var gameToken = request.query.gameToken;
  //console.log(typeof(gameToken));
  var answer = {};
  MongoClient.connect("mongodb://localhost:27017/gamesdb",
    function(err, db) {
      if(!err) {
        var gamesCollection = db.collection('games');
        gamesCollection.findOne({'game_token':gameToken},
          function(err, item) {
            if (item.players_count == 2) {
              db.close();
              answer.code = 6;
              answer.status = "ok";
              answer.message = "Player join game";
              sendResponse(answer, response);
            } else {
              db.close();
              answer.code = 7;
              answer.status = "ok";
              answer.message = "Player not join game";
              console.log("Player not join game");
              sendResponse(answer, response);
            }
          }
        );
      } else {
        db.close();
        answer.code = 6;
        answer.status = "error";
        answer.message = "Cannot connected to DB";
        sendResponse(answer, response);
      }
    }
  );
});

app.post('/make_a_move', function(request, response) {
  console.log("Request post /make_a_move received.");

  var form = new formidable.IncomingForm();
  var row,
      column,
      gameToken,
      accessToken;
  form.parse(request, function(error, fields, files) {
    row = fields.row;
    column = fields.col;
    gameToken = fields.game_token;
  });
  accessToken = request.headers.access_token;

  var answer = {};
  var gameRecord;
  var playerRecord;
  MongoClient.connect("mongodb://localhost:27017/gamesdb",
    function(err, db) {
      if(!err) {
        var gamesCollection = db.collection('games');
        gamesCollection.findOne({'game_token':gameToken},
          function(err, item) {
            gameRecord = item;
            if (gameRecord.game_field[row][column] != 0) {
              answer.status = "ok";
              answer.code = 9;
              answer.message = "Cell not empty";
              db.close();
              sendResponse(answer, response);
            } else {
              var playersCollection = db.collection('players');
              playersCollection.findOne({'access_token':accessToken},
                function(err, item) {
                  playerRecord = item;
                  gameRecord.game_field[row][column] = playerRecord.queue;
                  var playerStep = playerRecord.queue == 1 ? 2 : 1;
                  gamesCollection.removeOne({'game_token':gameToken}, function(err, result) {
                    var newGameRecord = {'game_token':gameRecord.game_token, 'players_count':2, 'player_step':playerStep,
                      'game_field':gameRecord.game_field, 'last_step':[row, column]
                    };
                    gamesCollection.insertOne(newGameRecord);
                    db.close();
                    answer.code = 8;
                    answer.status = "ok";
                    answer.message = "Player make move";
                    answer.playerQueue = playerRecord.queue;
                    sendResponse(answer, response);
                  });
                }
              );
            }
          }
        );

        console.log("DB closed");
      } else {
        console.log("DB Error");
        answer.status = "error";
        answer.message = "Cannot connected to DB";
      }
    }
  );
});

app.get('/can_i_play', function(request, response) {
  console.log("Request get /can_i_play received.");

  var gameToken = request.query.gameToken;
  var accessToken = request.query.accessToken;

  var answer = {};
  var playerQueue;
  MongoClient.connect("mongodb://localhost:27017/gamesdb",
    function(err, db) {
      if(!err) {
        var playersCollection = db.collection('players');
        playersCollection.findOne({'access_token':accessToken},
          function(err, playerRecord) {
            playerQueue = playerRecord.queue;
            var gamesCollection = db.collection('games');
            gamesCollection.findOne({'game_token':gameToken},
              function(err, gameRecord) {
                if (gameRecord.player_step == playerQueue) {
                  answer.status = "ok";
                  answer.code = 4;
                  answer.message = "You can play";
                  answer.last_step = gameRecord.last_step;
                  answer.playerQueue = playerRecord.queue;
                  db.close();
                  sendResponse(answer, response);
                } else {
                  answer.status = "ok";
                  answer.code = 5;
                  answer.message = "You cant play";
                  db.close();
                  sendResponse(answer, response);
                }
              }
            );
          }
        );
      } else {
        answer.status = "error";
        answer.code = 5;
        answer.message = "Cannot connected to DB";
        sendResponse(answer, response);
      }
    }
  );
});

app.get('/test', function(request, response) {
  console.log("Request post /test received.");

  var answer = {};
  answer.a = 1;
  answer.b = 5;
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader('Content-Type', 'application/json');
  response.json(answer);
  console.log('Request to /test performed.');
});

app.listen(3000, function(err) {
  console.log("Server has started.");
});

function createGameField(size) {
  var gameField = [];
  for (var i = 0; i < size; ++i) {
    var row = [];
    for (var j = 0; j < size; ++j) {
      row.push(0);
    }

    gameField.push(row);
  }

  return gameField;
}

function generateGameToken() {
  var gameToken = "";
  for (var i = 0; i < 6; ++i) {
    var code = Math.floor(Math.random() * (122 - 97 + 1)) + 97;
    var char = String.fromCharCode(code);
    gameToken += char;
  }

  return gameToken;
}

function generateAccessToken() {
  var accessToken = "";
  for (var i = 0; i < 20; ++i) {
    var code = Math.floor(Math.random() * (122 - 97 + 1)) + 97;
    var char = String.fromCharCode(code);
    accessToken += char;
  }

  return accessToken;
}

function sendResponse(answer, response) {
  response = setResponseHeaders(response);
  response.setHeader('Content-Type', 'application/json');
  response.json(answer);
}

function setResponseHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return response;
}