var app = angular.module('GalleryApp', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'RootController',
            templateUrl: 'templates/root.html'
        })
        .when('/create_game', {
            controller: 'LogInController',
            templateUrl: 'templates/login.html'
        })
        .when('/join', {
            controller: 'JoinLoginController',
            templateUrl: 'templates/join1.html'
        })
        .when('/new_game', {
            controller: 'NewGameController',
            templateUrl: 'templates/game.html'
        })
        .when('/join_game', {
            controller: 'JoinGameController',
            templateUrl: 'templates/game.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});