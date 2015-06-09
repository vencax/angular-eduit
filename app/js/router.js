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
    templateUrl: 'users/userman.html',
    controller: 'UsermanCtlr'
  });

  $routeProvider.when('/groupman', {
    templateUrl: 'groups/groupman.html',
    controller: 'GroupmanCtlr'
  });

  $routeProvider.when('/pcman', {
    templateUrl: 'pcs/pcmanindex.html',
    controller: 'PcmanIndexCtlr'
  });

  $routeProvider.when('/pcman/:net', {
    templateUrl: 'pcs/pcman.html',
    controller: 'PcmanCtlr'
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});
