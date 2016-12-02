app.controller('JoinGameController', ['$scope', '$location', 'ApiService', 'dataService', function($scope, $location, ApiService, dataService) {
    var accessToken,
        gameToken,
        gameField;

    $scope.joinGame = function() {
        var params = {userName:$scope.userName, gameToken:$scope.gameToken};

        ApiService.joinGame().create(params).$promise.then(function(response) {
            //console.log(response);
            accessToken = response.access_token;
            gameToken = $scope.gameToken;
            gameField = response.game_field;
            dataService.setAccessToken(accessToken);
            dataService.setGameToken(gameToken);
            dataService.setPlayerCode(2);
            dataService.setGameField(gameField);
            console.log(response.message);
            $location.path("/game");
        });
    }
}]);