angular.module("app").factory('HostStateSrvc', function($http, Conf) {

  return {
    get: function(mac) {
      return $http.get(Conf.dhcpdconfhost + '/hoststate/' + mac);
    },
    wake: function(mac) {
      return $http.put(Conf.dhcpdconfhost + '/hoststate/' + mac, {state: 1});
    }
  };

});
