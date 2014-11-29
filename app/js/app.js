var app = angular.module("app", [
  "ngResource", "ngRoute", "ngTable", "ui.bootstrap", "ngStorage"
]);

app.run(function($rootScope, $location, SessionService, AuthService) {

  moment.locale(navigator.language);

  $rootScope.logout = function() {
    return AuthService.logout(function() {
      $rootScope.loggedUser = '';
      return $location.path("/login");
    });
  };

  $rootScope.onLoggedIn = function(user) {
    $rootScope.loggedUser = user;
  };

  if(SessionService.getCurrentUser()) {
    $rootScope.onLoggedIn(SessionService.getCurrentUser());
  }

  // adds some basic utilities to the $rootScope for debugging purposes
  $rootScope.log = function(thing) {
    console.log(thing);
  };

  $rootScope.alert = function(thing) {
    alert(thing);
  };
});
