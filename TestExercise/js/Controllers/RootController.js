app.controller('RootController', ['$scope', '$location', 'ApiService', function($scope, $location, ApiService) {
    $scope.goToNewGame = function() {
        $location.path("/create_game");
    };

    $scope.goToJoinGame = function() {
        $location.path("/join");
    };

    //ApiService.newGame('1').create().$promise.then(function() {
    //    console.log("work");
    //});
}]);