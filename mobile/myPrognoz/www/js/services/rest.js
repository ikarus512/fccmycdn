angular.module('starter.services', [])

.factory('restService', ['$http', function ($http) {
  var serverUrl = (window.cordova) ?
    'https://ikarus512-fccmycdn.herokuapp.com/api/myPrognoz/':
    'http://localhost:5000/api/myPrognoz/' ;
  serverUrl='https://ikarus512-fccmycdn.herokuapp.com/api/myPrognoz/';
  return {
    get: function(area) {
      return $http({
        method: 'GET',
        url: serverUrl + area,
      });
    },
  };
}]);
