
function _importCtrl($scope, User, Group) {

  $scope.groups = Group.query()
  $scope.parsed = null
  $scope.error = null
  $scope.group = null

  function createUser(i) {
    try {
      if(i.length < 2) {
        return
      }
      return {
        username: i[2].split('@')[0],
        name: i[0] + ' ' + i[1],
        email: i[2],
        password: i[3],
        gid: $scope.group
      }
    } catch (e) {
      return {
        name: e
      }
    }
  }

  $scope.parseDaFile = function(e) {
    Papa.parse(e.files[0], {
      encoding: 'windows-1250',
      complete: function(results) {
        $scope.$apply(function () {
          $scope.parsed = _.map(results.data, createUser)
        })
      },
      error: function(error) {
        $scope.$apply(function () {
          $scope.error = error
        })
      }
    })
  }

  $scope.reset = function() {
    $scope.parsed = null
    $scope.error = null
    $scope.group = null
  }

  $scope.save = function() {
    for(var u in $scope.parsed) {
      var newU = new User()
      angular.extend(newU, u)
      newU.$save(function(data) {
        u.error = false
      }, function(err) {
        u.error = err
      })
    }
  }

}

angular.module("app").controller('ImportCtlr', [
  '$scope', 'User', 'Group', _importCtrl
])
.filter('groupname', function() {

  return function(value, options) {
    var found = _.find(options, function(i) {
      return i.id === value;
    });
    return found ? found.name : "";
  };

});
