var app = angular.module("app", [
  "ngResource", "visor", "ngRoute",
  "ngTable", "ngStorage", "mgcrea.ngStrap", "gettext"
]);

app.run(function($rootScope, $location, SessionService, AuthService, visor) {

  moment.locale(navigator.language);

  $rootScope.logout = function() {
    return AuthService.logout(function() {
      visor.setUnauthenticated();
      $rootScope.loggedUser = '';
      $location.path("/login");
    });
  };

  // adds some basic utilities to the $rootScope for debugging purposes
  $rootScope.log = function(thing) {
    console.log(thing);
  };

  $rootScope.alert = function(thing) {
    alert(thing);
  };
});
