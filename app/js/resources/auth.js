angular.module("app")

.factory("User", function($resource, Conf) {

  return $resource(Conf.userman_apiurl + '/users/:id', {}, {
    'update': { method:'PUT' }
  });

})

.factory("Group", function($resource, Conf) {

  return $resource(Conf.userman_apiurl + '/groups/:id', {}, {
    'update': { method:'PUT' }
  });

});
