
var app = angular.module("app");


// add authentication
app.run(function($rootScope, $location, SessionService) {

  // enumerate routes that don't need authentication
  var routesNoRequiringAuth = ['/login'];

  // check if current location matches route
  routeClean = function(route) {
    return route in routesNoRequiringAuth;
  };


  $rootScope.$on("$routeChangeStart", function(event, next, current) {

    // if route requires auth and user is not logged in
    if ((! routeClean($location.url())) &&
      (! SessionService.isLoggedIn())) {
      // redirect back to login
      $location.path("/login");
    }
  });
});


// automatic redirect to login page when 401 from REST service
// inject authorization header into outgoing reqs
app.config(function($httpProvider) {

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
