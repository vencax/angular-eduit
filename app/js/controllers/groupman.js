
var _err_handler = function(err){
  alert('request failed: ' + err.statusText + '\n\n' + err.data);
};

angular.module("app")

.controller('GroupmanCtlr', [
  '$scope', '$filter', '$modal', 'ngTableParams', 'User', 'Group',
  function($scope, $filter, $modal, NgTableParams, User, Group) {

  $scope.data = Group.query(function() {
    $scope.tableParams.reload();
  });
  $scope.selected = {};

  $scope.actionChoices = [
    { text: "Remove", click: "removeSelected();" }
  ];

  function performAction(cb) {
    for(var i in $scope.data) {
      if($scope.data[i].id in $scope.selected) {
        cb($scope.data[i], i);
      }
    }
  }

  $scope.removeSelected = function() {
    if (confirm('Are you sure you want to remove all selected?')) {
      performAction(function(item, idx) {
        item.$remove({id: item.id});
      });
      for (var s in $scope.selected) {
        for (var i=0; i<$scope.data.length; i++) {
          if ($scope.data[i].id.toString() === s) {
            $scope.data.splice(i, 1);
            break;
          }
        }
      }
      $scope.selected = {};
      $scope.tableParams.reload();
    }
  };

  $scope.tableParams = new NgTableParams({
    page: 1,                    // show first page
    count: 10,                  // count per page
    filter: {},                 // initial filter
    sorting: {name: 'asc'}      // initial sorting
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

  var myModal = $modal({
    scope: $scope, template: 'group_edit.html', show: false
  });

  $scope.showModal = function(group) {

    $scope.item = group ? group : new Group();

    myModal.$promise.then(myModal.show);

    $scope.save = function() {
      function _on_persisted(data) {
        if(! group) {
          $scope.data.push(data);
          $scope.tableParams.reload();
        }
        myModal.hide();
      }

      if($scope.item.id) {
        $scope.item.$update({id:$scope.item.id}, _on_persisted, _err_handler);
      } else {
        $scope.item.$save(_on_persisted, _err_handler);
      }
    };

  };

}]);
