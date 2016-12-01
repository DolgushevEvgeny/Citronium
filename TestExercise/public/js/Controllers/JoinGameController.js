app.controller('JoinGameController', ['$scope', '$location', 'ApiService', 'dataService', function($scope, $location, ApiService, dataService) {
    $scope.joinGame = function() {
        var params = {userName:$scope.userName, gameToken:$scope.gameToken};

        ApiService.joinGame(accessToken).create(params).$promise.then(function(response) {
            console.log(response);
            accessToken = response.access_token;
            $location.path("/game");
        });
    }
}]);