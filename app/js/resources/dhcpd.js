angular.module("app")

.factory("DHCPDHost", function($resource, Conf) {

  return $resource(Conf.dhcpd_apiurl + '/dhcphosts/:net/:dhcphost', {}, {
      'update': { method:'PUT' }
  });

});
