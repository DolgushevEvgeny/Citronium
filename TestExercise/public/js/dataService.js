angular.module('GalleryApp').factory('dataService', function() {
    var accessToken,
        gameToken,
        playerCode;

    return {
        setAccessToken: function(access_token) {
            accessToken = access_token;
        },
        getAccessToken: function() {
            return accessToken;
        },
        setGameToken: function(game_token) {
            gameToken = game_token;
        },
        getGameToken: function() {
            return gameToken;
        },
        setPlayerCode: function(code) {
            playerCode = code;
        },
        getPlayerCode: function() {
            return playerCode;
        }
    }
});