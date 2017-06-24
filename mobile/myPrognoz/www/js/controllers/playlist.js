angular.module('starter.controllers')

.controller('PlaylistCtrl', function($scope, $stateParams, restService) {
  $scope.playlistTitle = $stateParams.playlistTitle;
  restService.get($scope.playlistTitle)
  .then( function(res) {
    var d = res.data;
    $scope.data = d;
    $scope.data1 = {};

    d.arr_temperature.forEach( function(el) {
      var d = new Date(el.x);
      $scope.data1[el.ind] = {
        d  : '' + d.getUTCDate(d),
        ch : d.getUTCHours() + ':00',
        t  : el.y,
      }
    });
    d.arr_precip_val.forEach( function(el) { $scope.data1[el.ind]['val'] = el.y; });
    d.arr_precip_ver.forEach( function(el) { $scope.data1[el.ind]['ver'] = el.y; });
    d.arr_wind_speed.forEach( function(el) { $scope.data1[el.ind]['wnd'] = el.y; });
    if(d.arr_pressure) d.arr_pressure.forEach( function(el) { $scope.data1[el.ind]['p'] = el.y; });
    if(d.arr_humidity) d.arr_humidity.forEach( function(el) { $scope.data1[el.ind]['hum'] = el.y; });
    if(d.arr_phenomenon_name) d.arr_phenomenon_name.forEach( function(el) { $scope.data1[el.ind]['phen'] = el.y; });

    // Table header (keys of first long data)
    $scope.data1Keys = Object.keys($scope.data1[ d.arr_precip_ver[0].ind ]);
  })
  .catch( function(res) {console.log(res);});
});
