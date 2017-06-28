angular.module('starter.controllers')

.controller('CityCtrl', function($scope, $stateParams, restService) {

  $scope.cityTitle = $stateParams.cityTitle;

  restService.get($scope.cityTitle)
  .then( function(res) {
    var d = res.data;
    $scope.data = [];
    d.x.forEach(function(e,i){
      var dd = new Date(e);
      $scope.data.push({
        x  : dd,
        d  : '' + dd.getUTCDate(),
        ch : dd.getUTCHours() + ':00',

        t  : d.t[i],
        val: d.val[i],
        ver: d.ver[i],
        wnd: d.wnd[i],
        // p  : d.p ? d.p[i] : null,
        // h  : d.h ? d.h[i] : null,
        // n  : d.n ? d.n[i] : null,
      });
    });

    // Table header (keys of first long data)
    $scope.dataKeys = Object.keys($scope.data[0]);
  })
  .catch( function(res) {console.log(res);});

});
