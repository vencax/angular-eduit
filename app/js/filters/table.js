
angular.module('app')

.filter('formattedmac', function(){
  return function(mac) {
     var parts = [
      mac.slice(0, 2),
      mac.slice(2, 4),
      mac.slice(4, 6),
      mac.slice(6, 8),
      mac.slice(8, 10),
      mac.slice(10, 12)
    ];
    return parts.join(":");
  };
})

.filter('networkpart', function(){
  return function(net) {
    return net.split('-').join('.') + '/24';
  };
})


.filter('groupname', function(Group) {
  var grIndex = {};

  var groups = Group.query(function() {
    for (var i=0; i<groups.length; i++) {
      var g = groups[i];
      grIndex[g.id] = g.name;
    }
  });

  return function(input) {

    if(input instanceof Array) {
      var na = [];
      for (var i in input) {
        na.push(grIndex[input[i]]);
      }
      return na.join(', ');
    } else {
      return grIndex[input];
    }
  };
});
