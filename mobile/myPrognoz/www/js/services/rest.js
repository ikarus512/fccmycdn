angular.module('starter.services', [])

.factory('restService', ['$http', function ($http) {
  var serverUrl = (window.cordova) ?
    'http://ikarus512-fccmycdn.herokuapp.com/api/myPrognoz/':
    'http://localhost:5000/api/myPrognoz/';
  return {
    get: function(area) {
      return $http({
        method: 'GET',
        url: serverUrl + area,
      });
    },
  };
}]);
