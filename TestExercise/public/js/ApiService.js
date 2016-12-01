angular.module('GalleryApp').factory('ApiService', function($resource) {
    var url = 'http://localhost:3000/';

    return {
        newGame: function() {
            return $resource(url + 'new_game', {}, {
                create: {
                    method: 'POST'
                }
            });
        },
        joinGame: function() {
            return $resource(url + 'join_game', {}, {
                create: {
                    method: 'POST'
                }
            });
        },
        hasPlayerJoin: function(requestData) {
            return $resource(url + 'has_player_join', {}, {
                create: {
                    method: 'GET',
                    data: requestData
                }
            });
        },
        makeMove: function (accessToken, requestData) {
            return $resource(url + 'make_a_move', {}, {
                create: {
                    method: 'POST',
                    headers: { 'access_token': accessToken
                    },
                    data: requestData
                }
            });
        }
    }
});