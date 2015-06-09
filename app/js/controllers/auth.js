angular.module("app")

.controller('LoginController', function($scope, $rootScope, $location, AuthService, visor) {

  $scope.credentials = { username: "", password: "" };

  $scope.login = function() {
    AuthService.login($scope.credentials, function(err, user) {
      if (err) {
        $scope.error = err;
      } else {
        $rootScope.loggedUser = user;
        visor.setAuthenticated(user);
      }
    });
  };

})

.controller('ProfileCtlr', [
  '$scope', '$rootScope', '$location', 'AuthService',
  function($scope, $rootScope, $location, AuthService) {

  $scope.item = {
    password: '',
    pwd2: '',
    realname: $rootScope.loggedUser.realname
  };

  $scope.save = function() {
    $scope.working = true;
    AuthService.changeProfile($scope.item, $rootScope.loggedUser,
        function(err, profile) {
      $location.path('/');
    });
  };

}]);
