app.controller('GameController', ['$scope', 'ApiService', function($scope, ApiService) {
    var accessToken,
        gameToken,
        canPlay,
        intervalHasPlayerJoin,
        intervalCanIPlay;

    hasPlayerJoin = function() {
        var requestData = {};
        requestData.gameToken = gameToken;

        ApiService.hasPlayerJoin().create(requestData).$promise.then(function(response) {
            //console.log(response);
            if (response.code == 6 && response.status != "error") {
                canPlay = true;
                console.log(response.message);
                clearInterval(intervalHasPlayerJoin);
            } else {
                if (response.code == 7 && response.status != "error") {
                    canPlay = false;
                    console.log(response.message);
                }
            }

            console.log(response.message);

            var newDiv = angular.element("<div>");
        });
    }

    //hasPlayerJoin();
    intervalHasPlayerJoin = setInterval("hasPlayerJoin()", 4000);
}]);