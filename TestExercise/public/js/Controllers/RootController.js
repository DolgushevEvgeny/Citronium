app.controller('RootController', ['$scope', '$location', 'ApiService', function($scope, $location, ApiService) {
    $scope.goToNewGame = function() {
        $location.path("/create_game");
    };

    $scope.goToJoinGame = function() {
        $location.path("/joinGame");
    };

    //ApiService.newGame('1').create({userName:"Egor", size:3}).$promise.then(function() {
    //    console.log("work");
    //});
}]);