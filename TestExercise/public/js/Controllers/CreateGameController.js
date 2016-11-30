app.controller('CreateGameController', ['$scope', '$location', 'ApiService', function($scope, $location, ApiService) {
    var accessToken,
        gameToken,
        canPlay,
        intervalHasPlayerJoin,
        intervalCanIPlay;
    $scope.newGame = function() {
        var params = {userName:$scope.userName, size:$scope.size};

        ApiService.newGame(accessToken).create(params).$promise.then(function(response) {
            console.log(response);
            accessToken = response.access_token;
            gameToken = response.game_token;
            canPlay = false;
            console.log(response.message);
            $location.path("/game");
        });
    }

    insertElement = function() {
        var newDiv = angular.element('<div id="inserted" onclick="alertMessage()">∆ми сюда</div>');
        var div = angular.element(document.querySelector("#insert"));
        div.append(newDiv);
    }

    alertMessage = function() {
        console.log("CRAP");
    }

    //insertElement();
}]);