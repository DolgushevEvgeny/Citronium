app.controller('JoinGameController', ['$scope', '$location', 'ApiService', 'dataService', function($scope, $location, ApiService, dataService) {
    var accessToken,
        gameToken;

    $scope.joinGame = function() {
        var params = {userName:$scope.userName, gameToken:$scope.gameToken};

        ApiService.joinGame().create(params).$promise.then(function(response) {
            //console.log(response);
            accessToken = response.access_token;
            gameToken = response.game_token;
            dataService.setAccessToken(accessToken);
            dataService.setGameToken(gameToken);
            dataService.setPlayerCode(2);
            console.log(response.message);
            $location.path("/game");
        });
    }
}]);