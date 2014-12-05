
var _err_handler = function(err){
  alert('request failed: ' + err.statusText + '\n\n' + err.data);
};

angular.module("app")

.controller('UsermanCtlr', [
  '$scope', '$filter', '$modal', 'ngTableParams', 'User', 'Group',
  function($scope, $filter, $modal, NgTableParams, User, Group) {

  $scope.data = User.query();
  $scope.groups = Group.query();
  $scope.selected = {};

  $scope.actionChoices = [
    { text: "Disable", click: "doAction(1);" },
    { text: "Remove", click: "doAction(0);" }
  ];

  function removeSelected() {
    if (confirm('Are you sure you want to remove all selected?')) {
      for(var u in $scope.selected) {
        u.$remove({id: u.id});
      }
      $scope.selected = {};
    }
  }

  function disableSelected() {
    if (confirm('Are you sure you want to disable all selected?')) {
      for(var u in $scope.selected) {
        u.status = 1;
        u.$update({id: u.id});
      }
      $scope.selected = {};
    }
  }

  $scope.doAction = function(action) {
    switch(action) {
    case 0:
      removeSelected();
      break;
    case 1:
      disableSelected();
    }
  };

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