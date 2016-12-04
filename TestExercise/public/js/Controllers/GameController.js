app.controller('GameController', ['$scope', 'ApiService', 'dataService', function($scope, ApiService, dataService) {
    var accessToken,
        gameToken,
        playerCode,
        canPlay,
        intervalHasPlayerJoin,
        intervalCanIPlay,
        gameField,
        messagesSection;

    hasPlayerJoin = function() {
        var requestData = {};
        requestData.game_token = gameToken;

        ApiService.hasPlayerJoin().create(requestData).$promise.then(function(response) {
            //console.log(response);
            if (response.code == 6 && response.status != "error") {
                canPlay = true;
                createParagraph(response.message);
                //console.log(response.message);
                clearInterval(intervalHasPlayerJoin);
            } else {
                if (response.code == 7 && response.status != "error") {
                    canPlay = false;
                    createParagraph(response.message);
                    //console.log(response.message);
                }
            }
        });
    };

    makeMove = function(row, column) {
        if (canPlay) {
            var requestData = {};
            requestData.game_token = gameToken;
            requestData.row = row;
            requestData.col = column;

            ApiService.makeMove(accessToken).create(requestData).$promise.then(function(response) {
                if (response.code == 8 && response.status != "error") {
                    canPlay = false;
                    createParagraph(response.message);
                    //console.log(response.message);
                    gameField = response.game_field;
                    deployGameField();
                    //todo спамить сервер пока игроку не разрешат сходить
                    intervalCanIPlay = setInterval("canIPlay()", 4000);
                } else if (response.code == 9 && response.status != "error") {
                    canPlay = true;
                    createParagraph(response.message);
                    //console.log(response.message);
                } else if (response.code == 10 && response.status != "error") {
                    clearInterval(intervalCanIPlay);
                    canPlay = false;
                    createParagraph(response.message);
                    //console.log(response.message);
                    gameField = response.game_field;
                    deployGameField();
                    alert("YOU WIN!");
                } else if (response.code == 11 && response.status != "error") {
                    clearInterval(intervalCanIPlay);
                    canPlay = false;
                    createParagraph(response.message);
                    //console.log(response.message);
                    gameField = response.game_field;
                    deployGameField();
                    alert("DRAW!");
                }
            });
        }
    };

    canIPlay = function() {
        var requestData = {};
        requestData.gameToken = gameToken;

        ApiService.canIPlay(accessToken).create(requestData).$promise.then(function(response) {
            if (response.code == 4 && response.status != "error") {
                canPlay = true;
                createParagraph(response.message);
                //console.log(response.message);
                gameField = response.game_field;
                deployGameField();
                //todo перестать спамить сервер пока игроку не разрешат сходить
                clearInterval(intervalCanIPlay);
            } else if (response.code == 5 && response.status != "error") {
                canPlay = false;
                console.log(response.message);
                //todo спамить сервер пока игроку не разрешат сходить
            } else if (response.code == 11 && response.status != "error") {
                canPlay = false;
                createParagraph(response.message);
                //console.log(response.message);
                gameField = response.game_field;
                deployGameField();
                clearInterval(intervalCanIPlay);
                alert("DRAW!");
            } else if (response.code == 12 && response.status != "error") {
                canPlay = false;
                createParagraph(response.message);
                //console.log(response.message);
                gameField = response.game_field;
                deployGameField();
                clearInterval(intervalCanIPlay);
                alert("YOU LOSE!");
            }
        });

    };

    deployGameField = function() {
        var gameTable = angular.element(document.querySelector(".table"));
        if (gameTable) {
            gameTable.remove();
        }

        var newGameTable = angular.element('<section class="table col-lg-6"></section>');
        for (var i = 0; i < gameField.length; ++i) {
            var row = angular.element('<section></section>');
            for (var j = 0; j < gameField[i].length; ++j) {
                var cell = angular.element('<section class="cell" onclick="makeMove(' + i + ',' + j + ')"></section>');
                if (gameField[i][j] == 1) {
                    cell.addClass('player');
                } else if (gameField[i][j] == 2) {
                    cell.addClass('ai');
                }

                row.append(cell);
            }

            newGameTable.append(row);
        }

        angular.element(document.querySelector(".main")).prepend(newGameTable);
    };

    createParagraph = function(message) {
        var messageParagraph = angular.element('<p class="message"></p>');
        messageParagraph.text(message);
        messagesSection.append(messageParagraph);
    };

    accessToken = dataService.getAccessToken();
    gameToken = dataService.getGameToken();
    playerCode = dataService.getPlayerCode();
    gameField = dataService.getGameField();
    messagesSection = angular.element(document.querySelector(".messages"));

    if (playerCode == 1) {
        var gameTokenField = angular.element(document.querySelector(".gameToken"));
        gameTokenField.text(gameToken);
        deployGameField();
        intervalHasPlayerJoin = setInterval("hasPlayerJoin()", 4000);
    } else {
        deployGameField();
        intervalCanIPlay = setInterval("canIPlay()", 4000);
    }
}]);