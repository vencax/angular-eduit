
// formatovat mac

var _err_handler = function(err){
  alert('request failed: ' + err.statusText + '\n\n' + err.data);
};

angular.module("app").controller('HomeController', ['$scope', '$filter', '$modal', 'ngTableParams', 'DHCPDHost', 'HostStateSrvc', function($scope, $filter, $modal, NgTableParams, DHCPDHost, HostStateSrvc) {

  $scope.data = DHCPDHost.query();

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
      // use build-in angular filter
      var filteredData = params.filter() ?
              $filter('filter')($scope.data, params.filter()) :
              $scope.data;
      var orderedData = params.sorting() ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              $scope.data;

      params.total(orderedData.length); // set total for recalc pagination
      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  var pcEditModal = $modal({
    scope: $scope, template: 'editForm.html', show: false
  });

  $scope.showModal = function(host) {

    $scope.item = host ? new DHCPDHost(host) : new DHCPDHost();

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
          _copyHost($scope.item, host);
        } else {
          $scope.data.push($scope.item);
          $scope.tableParams.reload();
        }
        pcEditModal.hide();
      }

      if('res' in $scope.item && $scope.item.res === true) {

        if($scope.item.mac !== host.mac) {
          // we have chaged primary ID, so remove the old item and add a newone
          host.$remove({dhcphost: host.mac}, function(data){
            $scope.item.$save(_on_persisted, _err_handler);
          }, _err_handler);
        } else {
          $scope.item.$update({dhcphost:$scope.item.mac}, _on_persisted, _err_handler);
        }

      } else {
        $scope.item.$save(_on_persisted, _err_handler);
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
      host.$remove({dhcphost: host.mac});
    } else {
      // Do nothing!
    }
  };

}]);
