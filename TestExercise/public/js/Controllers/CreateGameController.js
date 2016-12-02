app.controller('CreateGameController', ['$scope', '$location', 'ApiService', 'dataService', function($scope, $location, ApiService, dataService) {
    var accessToken,
        gameToken,
        gameField;

    $scope.newGame = function() {
        var params = {userName:$scope.userName, size:$scope.size};

        ApiService.newGame().create(params).$promise.then(function(response) {
            //console.log(response);
            accessToken = response.access_token;
            gameToken = response.game_token;
            gameField = response.game_field;
            dataService.setAccessToken(accessToken);
            dataService.setGameToken(gameToken);
            dataService.setPlayerCode(1);
            dataService.setGameField(gameField);
            console.log(response.message);
            $location.path("/game");
        });
    };
}]);