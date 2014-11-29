angular.module("app")

.controller('LoginController', function($scope, $rootScope, $location, AuthService) {

  $scope.credentials = { username: "", password: "" };

  $scope.login = function() {
    AuthService.login($scope.credentials, function(err, user) {
      if (err) {
        $scope.error = err;
      } else {
        $rootScope.onLoggedIn(user);
        $location.path("/");
      }
    });
  };

});
