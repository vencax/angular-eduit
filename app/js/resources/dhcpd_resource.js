angular.module("app")

.factory("DHCPDHost", function($resource, Conf) {

  return $resource(Conf.dhcpdconfhost + '/dhcphosts/:dhcphost', {}, {
      'update': { method:'PUT' }
  });

});
