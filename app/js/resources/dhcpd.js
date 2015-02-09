angular.module("app")

.factory("DHCPDHost", function($resource, Conf) {

  return $resource(Conf.dhcpd_apiurl + '/dhcphosts/:dhcphost', {}, {
      'update': { method:'PUT' }
  });

});
