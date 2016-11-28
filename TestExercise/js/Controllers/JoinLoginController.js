app.controller('JoinLoginController', ['$scope', function($scope) {
    $scope.joinToGame = function() {
        $location.path("/join");
    };
}]);