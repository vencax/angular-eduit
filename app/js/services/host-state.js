angular.module("app").factory('HostStateSrvc', function($http, Conf) {

  return {
    get: function(mac) {
      return $http.get(Conf.dhcpd_apiurl + '/hoststate/' + mac);
    },
    wake: function(mac) {
      return $http.put(Conf.dhcpd_apiurl + '/hoststate/' + mac, {state: 1});
    }
  };

});
