var app = angular.module('GalleryApp', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'RootController',
            templateUrl: 'public/templates/root.html'
        })
        .when('/create_game', {
            controller: 'CreateGameController',
            templateUrl: 'public/templates/createGame.html'
        })
        .when('/joinGame', {
            controller: 'JoinGameController',
            templateUrl: 'public/templates/joinGame.html'
        })
        .when('/game', {
            controller: 'GameController',
            templateUrl: 'public/templates/game.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});