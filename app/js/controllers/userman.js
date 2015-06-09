
var _err_handler = function(err){
  alert('request failed: ' + err.statusText + '\n\n' + err.data);
};

angular.module("app")

.controller('UsermanCtlr', [
  '$scope', '$filter', '$modal', 'ngTableParams', 'User', 'Group',
  function($scope, $filter, $modal, NgTableParams, User, Group) {

  $scope.data = User.query(function() {
    $scope.tableParams.reload();
  });
  $scope.groups = Group.query();
  $scope.selected = {};

  $scope.actionChoices = [
    { text: "Disable", click: "setState2Selected(1);" },
    { text: "Enable", click: "setState2Selected(0);" },
    { "divider": true },
    { text: "Remove", click: "removeSelected();" }
  ];

  function performAction(cb) {
    for(var i=0; i<$scope.data.length; i++) {
      if($scope.data[i].id in $scope.selected) {
        cb($scope.data[i]);
      }
    }
  }

  $scope.removeSelected = function() {
    if (confirm('Are you sure you want to remove all selected?')) {
      performAction(function(user) {
        user.$remove({id: user.id});
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

  $scope.setState2Selected = function(state) {
    if (confirm('Are you sure you want to disable all selected?')) {
      performAction(function(user) {
        user.state = state;
        user.$update({id: user.id});
      });
    }
    $scope.selected = {};
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
    scope: $scope, template: 'user_edit.html', show: false
  });

  $scope.showModal = function(user) {

    if(user) {
      $scope.item = User.get({id: user.id});
    } else {
      $scope.item = new User();
      $scope.item.gid = $scope.groups[0].id;
    }

    myModal.$promise.then(myModal.show);

    $scope.save = function() {
      function _on_persisted(data) {
        if(! user) {
          $scope.data.push(data);
          $scope.tableParams.reload();
        }
        myModal.hide();
      }

      if($scope.item.id === undefined) {
        $scope.item.$save(_on_persisted, _err_handler);
      } else {
        $scope.item.$update({id:$scope.item.id}, _on_persisted, _err_handler);
      }
    };

  };

}]);
