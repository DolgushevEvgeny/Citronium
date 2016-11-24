var formidable = require("formidable");
var fs = require("fs");
var url = require("url");
var http = require("http");
var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var app = express();

app.get('/', function(request, response) {
  console.log("Request get / received.");

  //var fileContent;
  //fs.readFile("clientscript.js", "utf8", function(error, text) {
  //  if (error) {
  //    throw error;
  //  }
  //  fileContent = text;
  //});

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.send();
  console.log("Response / sent.");
});

app.get('/js/clientscript.js', function(request, response) {
  console.log("Request get /js/clientscript.js received.");

  //var file;
  //fs.open('clientscript.js', 'r', function(err, fd) {
  //  if (err) {
  //    return console.error(err);
  //  }
  //  file = fd;
  //  console.log("File opened successfully!");
  //});

  var fileContent;
  fs.readFile("client.js", "utf8", function(error, text) {
    if (error) {
      throw error;
    }
    fileContent = text;
    console.log(fileContent);
  });

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.send(fileContent);
  console.log("Response /js/clientscript.js sent.");
});

app.post('/new_game', function(request, response) {
  console.log("Request post /new_game received.");

  var form = new formidable.IncomingForm();
  var userName,
      dimention;
  form.parse(request, function(error, fields, files) {
    userName = fields.userName;
    dimention = fields.dimention;
    console.log("parsing done: " + userName + " " + dimention);
  });
  var answer = {};
  answer.status = "ok";
  answer.game_token = generateGameToken();
  answer.access_token = generateAccessToken();

  MongoClient.connect("mongodb://localhost:27017/gamesdb", function(err, db) {
    if(!err) {
      console.log("We are connected");
      //var collection = db.collection('games');
      //var doc1 = {'games':'alien'};
      //collection.insertOne(doc1);

      db.close();
      console.log("DB closed");
    } else {
      console.log("DB Error");
    }
  });

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader('Content-Type', 'application/json');
  response.json(answer);
});

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

app.get('/test', function(request, response) {
  console.log("Request post /test received.");
  var form = new formidable.IncomingForm();
  var a=5, b=6;
  // form.parse(request, function(error, fields, files) {
  //   console.log(fields.a);
  //   a = fields.a;
  //   b = fields.b;
  //   console.log(fields.b);
	// 	console.log("parsing done");
  // });

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

app.post('/upload', function(request, response) {
  console.log("Request post /upload received.");

  var form = new formidable.IncomingForm();
  form.parse(request, function(error, fields, files) {
    console.log(fields.test1);
    console.log(fields.test2);
    console.log("parsing done");
  });
  response.send('Request to /upload performed.')
});

app.listen(8888, function(err) {
  console.log("Server has started.");
});
