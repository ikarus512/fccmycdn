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


    var x = d.x.map(function(e){return new Date(e);});
    var d1 = { x: x, stocks: {
        t: { id: 't', values: d.t.map(function(e,i){return {x:x[i],y:e};}), },
        ver: { id: 'ver/10', values: d.ver.map(function(e,i){return {x:x[i],y:e/10};}), },
        val: { id: 'val', values: d.val.map(function(e,i){return {x:x[i],y:e};}), },
        wnd: { id: 'wnd', values: d.wnd.map(function(e,i){return {x:x[i],y:e};}), },
      }
    };

    $scope.datat = { x: x, stocks: {
        t: { id: 't', values: d.t.map(function(e,i){return {x:x[i],y:e};}), },
      }
    };
    $scope.data1 = { x: x, stocks: {
        ver: { id: 'ver/10', values: d.ver.map(function(e,i){return {x:x[i],y:e/10};}), },
        val: { id: 'val', values: d.val.map(function(e,i){return {x:x[i],y:e};}), },
      }
    };
    $scope.data2 = { x: x, stocks: {
        wnd: { id: 'wnd', values: d.wnd.map(function(e,i){return {x:x[i],y:e};}), },
      }
    };

  })
  .catch( function(res) {console.log(res);});

});
