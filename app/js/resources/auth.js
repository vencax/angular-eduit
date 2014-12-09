angular.module("app")

.factory("User", function($resource, Conf) {

  return $resource(Conf.userman_apiurl + '/user/:id', {}, {
    'update': { method:'PUT' }
  });

})

.factory("Group", function($resource, Conf) {

  return $resource(Conf.userman_apiurl + '/group/:id', {}, {
    'update': { method:'PUT' }
  });

});
