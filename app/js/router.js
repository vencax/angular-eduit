angular.module("app").config(function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeCtlr'
  });

  $routeProvider.when('/userman', {
    templateUrl: 'userman.html',
    controller: 'UsermanCtlr'
  });

  $routeProvider.when('/pcman', {
    templateUrl: 'pcman.html',
    controller: 'PcmanCtlr'
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});
