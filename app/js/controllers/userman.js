
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
    { text: "Remove", click: "removeSelected();" }
  ];

  function performAction(cb) {
    for(var i=0; i<$scope.data.length; i++) {
      if($scope.data[i].id in $scope.selected) {
        cb($scope.data[i]);
      }
    }
    $scope.selected = {};
  }

  $scope.removeSelected = function() {
    if (confirm('Are you sure you want to remove all selected?')) {
      performAction(function(user) {
        u.$remove({id: u.id});
      });
      $scope.tableParams.reload();
    }
  };

  $scope.setState2Selected = function(state) {
    if (confirm('Are you sure you want to disable all selected?')) {
      performAction(function(user) {
        u.state = state;
        u.$update({id: u.id});
      });
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
    scope: $scope, template: 'user_edit.html', show: false
  });

  $scope.showModal = function(user) {

    $scope.item = user ? user : new User();
    if(! user) {
      $scope.item.gid = $scope.groups[0].id;
    }

    myModal.$promise.then(myModal.show);

    $scope.save = function() {
      function _on_persisted(data) {
        $scope.data.push(data);
        $scope.tableParams.reload();
        myModal.hide();
      }

      if($scope.item.id) {
        $scope.item.$update({id:$scope.item.id}, _on_persisted, _err_handler);
      } else {
        $scope.item.$save(_on_persisted, _err_handler);
      }
    };

  };

  $scope.groupname = function(gid) {
    for(var i; i<$scope.groups.length; i++) {
      var g = $scope.groups[i];
      if(g.id === gid) { return g.name; }
    }
  };

}]);
