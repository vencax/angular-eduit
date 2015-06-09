
angular.module("app")

.factory('AuthService', function($http, $window, SessionService, Conf) {

  function _initUser(user) {
    if(user.gid === Conf.adminGID || user.groups.indexOf(Conf.adminGID) >= 0) {
      user.is_admin = true;
    }
  }

  // these routes map to stubbed API endpoints in config/server.js
  return {
    login: function(credentials, done) {
      $http.post(Conf.userman_apiurl + '/login', credentials)
        .success(function(user) {
          _initUser(user);
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

    changeProfile: function(profile, loggedUser, cb) {
      var url = Conf.userman_apiurl + '/user/' + loggedUser.id;
      $http.put(url, profile)
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
