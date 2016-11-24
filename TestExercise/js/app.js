var app = angular.module('GalleryApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'LogInController',
            templateUrl: 'templates/login.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});