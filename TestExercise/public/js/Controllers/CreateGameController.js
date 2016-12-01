app.controller('CreateGameController', ['$scope', '$location', 'ApiService', 'dataService', function($scope, $location, ApiService, dataService) {
    var accessToken,
        gameToken;

    $scope.newGame = function() {
        var params = {userName:$scope.userName, size:$scope.size};

        ApiService.newGame().create(params).$promise.then(function(response) {
            //console.log(response);
            accessToken = response.access_token;
            gameToken = response.game_token;
            dataService.setAccessToken(accessToken);
            dataService.setGameToken(gameToken);
            console.log(response.message);
            $location.path("/game");
        });
    };
}]);