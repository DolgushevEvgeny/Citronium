app.controller('GameController', ['$scope', 'ApiService', 'dataService', function($scope, ApiService, dataService) {
    var accessToken,
        gameToken,
        canPlay,
        intervalHasPlayerJoin,
        intervalCanIPlay;

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

            console.log(response.message);
        });
    };

    makeMove = function() {
        var requestData = {};
        requestData.game_token = gameToken;
        requestData.row = 1;
        requestData.col = 2;

        ApiService.makeMove(accessToken).create(requestData).$promise.then(function(response) {
            if (response.code == 8 && response.status != "error") {
                canPlay = false;
                console.log(response.message);
                //todo спамить сервер пока игроку не разрешат сходить
                //intervalCanIPlay = setInterval("canIPlay()", 4000);
            } else if (response.code == 9 && response.status != "error") {
                canPlay = true;
                console.log(response.message);
            } else {

            }
        });
    }

    accessToken = dataService.getAccessToken();
    gameToken = dataService.getGameToken();
    //hasPlayerJoin();
    //makeMove();
    intervalHasPlayerJoin = setInterval("hasPlayerJoin()", 4000);

    //insertElement = function() {
    //    var newDiv = angular.element('<div id="inserted" onclick="alertMessage()">Жми сюда</div>');
    //    var div = angular.element(document.querySelector("#insert"));
    //    div.append(newDiv);
    //};
    //
    //alertMessage = function() {
    //    console.log("CRAP");
    //};
    //insertElement();
}]);