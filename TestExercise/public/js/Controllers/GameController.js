app.controller('GameController', ['$scope', 'ApiService', 'dataService', function($scope, ApiService, dataService) {
    var accessToken,
        gameToken,
        playerCode,
        canPlay,
        intervalHasPlayerJoin,
        intervalCanIPlay,
        gameField;

    hasPlayerJoin = function() {
        var requestData = {};
        requestData.game_token = gameToken;

        ApiService.hasPlayerJoin().create(requestData).$promise.then(function(response) {
            //console.log(response);
            if (response.code == 6 && response.status != "error") {
                canPlay = true;
                console.log(response.message);
                clearInterval(intervalHasPlayerJoin);
            } else {
                if (response.code == 7 && response.status != "error") {
                    canPlay = false;
                    console.log(response.message);
                }
            }
        });
    };

    makeMove = function(row, column) {
        //console.log("row: " + row);
        //console.log("column: " + column);

        if (canPlay) {
            var requestData = {};
            requestData.game_token = gameToken;
            requestData.row = row;
            requestData.col = column;

            ApiService.makeMove(accessToken).create(requestData).$promise.then(function(response) {
                if (response.code == 8 && response.status != "error") {
                    canPlay = false;
                    console.log(response.message);
                    gameField = response.game_field;
                    deployGameField();
                    //todo спамить сервер пока игроку не разрешат сходить
                    intervalCanIPlay = setInterval("canIPlay()", 4000);
                } else if (response.code == 9 && response.status != "error") {
                    canPlay = true;
                    console.log(response.message);
                } else {

                }
            });
        }
    };

    canIPlay = function() {
        var requestData = {};
        console.log("gameToken " + gameToken);
        requestData.gameToken = gameToken;

        ApiService.canIPlay(accessToken).create(requestData).$promise.then(function(response) {
            if (response.code == 4 && response.status != "error") {
                canPlay = true;
                console.log(response.message);
                gameField = response.game_field;
                deployGameField();
                //todo перестать спамить сервер пока игроку не разрешат сходить
                clearInterval(intervalCanIPlay);
            } else if (response.code == 5 && response.status != "error") {
                canPlay = false;
                console.log(response.message);
                //todo спамить сервер пока игроку не разрешат сходить
            } else {

            }
        });

    };

    deployGameField = function() {
        var gameTable = angular.element(document.querySelector(".table"));
        if (gameTable) {
            gameTable.remove();
        }

        var newGameTable = angular.element('<div class="table"></div>');
        for (var i = 0; i < gameField.length; ++i) {
            var row = angular.element('<div></div>');
            for (var j = 0; j < gameField[i].length; ++j) {
                console.log("i: "+ i + " j: " + j);
                var cell = angular.element('<div class="cell" onclick="makeMove(' + i + ',' + j + ')"></div>');
                if (gameField[i][j] == 1) {
                    cell.addClass('player');
                } else if (gameField[i][j] == 2) {
                    cell.addClass('ai');
                }

                row.append(cell);
            }

            newGameTable.append(row);
        }

        angular.element(document.querySelector(".container")).prepend(newGameTable);
    };

    accessToken = dataService.getAccessToken();
    gameToken = dataService.getGameToken();
    playerCode = dataService.getPlayerCode();
    gameField = dataService.getGameField();

    if (playerCode == 1) {
        var el = angular.element(document.querySelector("#gameToken"));
        el.text(gameToken);
        deployGameField();
        intervalHasPlayerJoin = setInterval("hasPlayerJoin()", 4000);
    } else {
        deployGameField();
        intervalCanIPlay = setInterval("canIPlay()", 4000);
    }
}]);