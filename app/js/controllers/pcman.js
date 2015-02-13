
// formatovat mac

var _err_handler = function(err){
  alert('request failed: ' + err.statusText + '\n\n' + err.data);
};

angular.module("app")

.controller('PcmanIndexCtlr', function($scope, $location) {
  $scope.path = $location.path();
  $scope.data = ['192-168-1'];
})

.controller('PcmanCtlr', [
  '$scope', '$filter', '$modal', '$routeParams', 'ngTableParams', 'DHCPDHost', 'HostStateSrvc',
  function($scope, $filter, $modal, $routeParams, NgTableParams, DHCPDHost, HostStateSrvc)
{

  $scope.data = DHCPDHost.query({net: $routeParams.net});
  $scope.route = $routeParams;

  $scope.tableParams = new NgTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    filter: {
      name: ''       // initial filter
    },
    sorting: {
      ip: 'asc'     // initial sorting
    }
  }, {
    total: $scope.data.length, // length of data
    getData: function($defer, params) {
      var filter = params.filter();

      if(filter.mac) {
        // leave only hexa chars
        filter.mac = filter.mac.replace(/[^A-Fa-f0-9]/g, "").toLowerCase();
      }

      // use build-in angular filter
      var filteredData = filter ?
              $filter('filter')($scope.data, filter) :
              $scope.data;
      var orderedData = params.sorting() ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              $scope.data;

      params.total(orderedData.length); // set total for recalc pagination
      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  var pcEditModal = $modal({
    scope: $scope, template: 'pc_edit.html', show: false
  });

  $scope.showModal = function(host) {

    if(host) {
      $scope.item = new DHCPDHost(host);
    } else {
      $scope.item = new DHCPDHost();
    }

    pcEditModal.$promise.then(pcEditModal.show);

    var _copyHost = function(src, dest) {
      dest.ip = src.ip;
      dest.desc = src.desc;
      dest.mac = src.mac;
      dest.name = src.name;
      dest.res = src.res;
    };

    $scope.save = function() {

      function _on_persisted(data) {
        if(host) {
          _copyHost(data, host);
        } else {
          $scope.data.push(data);
          $scope.tableParams.reload();
        }
        pcEditModal.hide();
      }

      var item = new DHCPDHost($scope.item);

      if('res' in item && item.res === true) {

        if(item.mac !== host.mac) {
          // we have chaged primary ID, so remove the old item and add a newone
          host.$remove({
            dhcphost: host.mac, net: $routeParams.net
          }, function(data){
            item.$save({net: $routeParams.net}, _on_persisted, _err_handler);
          }, _err_handler);
        } else {
          item.$update({
            dhcphost:$scope.item.mac, net: $routeParams.net
          }, _on_persisted, _err_handler);
        }

      } else {
        item.$save({net: $routeParams.net}, _on_persisted, _err_handler);
      }

    };
  };

  $scope.wakeHost = function($event, host){
    HostStateSrvc.wake(host.mac).
      success(function(data){
        alert('waking ' + host.name + ':\n' + data);
      }).
      error(_err_handler);
  };

  $scope.remove = function($event, host){
    if (confirm('Are you sure you want to remove reservation for ' + host.name)) {
      host.$remove({dhcphost: host.mac, net: $routeParams.net});
    } else {
      // Do nothing!
    }
  };

}]);
