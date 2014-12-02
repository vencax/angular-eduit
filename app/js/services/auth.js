
angular.module("app")

.factory('AuthService', function($http, $window, SessionService, Conf) {

  // these routes map to stubbed API endpoints in config/server.js
  return {
    login: function(credentials, done) {
      $http.post(Conf.userman_apiurl + '/login', credentials)
        .success(function(user) {
          SessionService.setCurrentUser(user, user.token);
          return done(null, user);
        })
        .error(function(err){
          return done(err);
        });
    },

    logout: function(done) {
      SessionService.logout();
      return done();
    },


    changePwd: function(pwd, cb) {
      $http.post(Conf.userman_apiurl + '/setpasswd', {'passwd': pwd})
        .success(function(data) {
          return cb(null, data);
        })
        .error(function(err) {
          return cb(err);
        });
    }

  };
})

.factory('SessionService', function($localStorage, $location) {

  var _cuKey = $location.host() + $location.port() + 'currentUser';

  return {
    setCurrentUser: function(currentUser, token) {
      currentUser.token = token;
      $localStorage[_cuKey] = currentUser;
    },

    getCurrentUser: function() {
      return $localStorage[_cuKey] || null;
    },

    isLoggedIn: function() {
      return $localStorage.hasOwnProperty(_cuKey);
    },

    logout: function() {
      delete $localStorage[_cuKey];
    }
  };

});
