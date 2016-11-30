app.controller('JoinGameController', ['$scope', '$location', 'ApiService', function($scope, $location, ApiService) {
    $scope.joinGame = function() {
        var params = {userName:$scope.userName, gameToken:$scope.gameToken};

        ApiService.joinGame(accessToken).create(params).$promise.then(function(response) {
            console.log(response);
            accessToken = response.access_token;
            $location.path("/game");
        });
    }
}]);