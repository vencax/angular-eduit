angular.module("app").config(function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeController'
  });

  $routeProvider.when('/userman', {
    templateUrl: 'userman.html',
    controller: 'UsermanCtlr'
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});
