app.controller('JoinGameController', ['$scope', '$location', 'ApiService', function($scope, $location, ApiService) {
    $scope.joinToGame = function() {
        $location.path("/join_game");
    };
}]);