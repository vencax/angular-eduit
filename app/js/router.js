angular.module("app")

.config(function($routeProvider, $locationProvider, visorProvider) {

  $locationProvider.html5Mode(true);

  visorProvider.authenticate = function($q, $rootScope, SessionService, AuthService) {
    if(SessionService.getCurrentUser()) {
      var user = SessionService.getCurrentUser();
      $rootScope.loggedUser = user;
      return $q.when(user);
    } else {
      return $q.reject(null);
    }
	};
	visorProvider.doOnNotAuthorized = function($location,restrictedUrl) {
		$location.url("/access_denied?prevUrl=" + encodeURIComponent(restrictedUrl));
	};

  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginController',
    restrict: function(user){return user === undefined;}
  });

  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeCtlr',
    restrict:function(user){return !!user;}
  });

  $routeProvider.when("/access_denied", {
		templateUrl:"access_denied.html",
		controller: function($scope,$routeParams) {
			$scope.prevUrl = $routeParams.prevUrl;
		}
	});

  $routeProvider.when('/userman', {
    templateUrl: 'users/userman.html',
    controller: 'UsermanCtlr',
    restrict:function(user){return user && user.is_admin;}
  });

  $routeProvider.when('/profile', {
    templateUrl: 'users/profile.html',
    controller: 'ProfileCtlr',
    restrict:function(user){return !!user;}
  });

  $routeProvider.when('/groupman', {
    templateUrl: 'groups/groupman.html',
    controller: 'GroupmanCtlr',
    restrict:function(user){return user && user.is_admin;}
  });

  $routeProvider.when('/pcman', {
    templateUrl: 'pcs/pcmanindex.html',
    controller: 'PcmanIndexCtlr',
    restrict:function(user){return user && user.is_admin;}
  });

  $routeProvider.when('/pcman/:net', {
    templateUrl: 'pcs/pcman.html',
    controller: 'PcmanCtlr',
    restrict:function(user){return user && user.is_admin;}
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

})

// automatic redirect to login page when 401 from REST service
// inject authorization header into outgoing reqs
.config(function($httpProvider) {

  $httpProvider.interceptors.push(function($q, $location, $rootScope, SessionService) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if (SessionService.getCurrentUser()) {
          config.headers.Authorization = 'Bearer ' + SessionService.getCurrentUser().token;
        }
        return config;
      },

      responseError: function(rejection) {
        if (rejection.status === 401) {
          $rootScope.logout();
        }
        return $q.reject(rejection);
      }
    };
  });

});
