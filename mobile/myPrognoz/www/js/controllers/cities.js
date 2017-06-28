angular.module('starter.controllers')

.controller('CitiesCtrl', function($scope) {
  $scope.cities = [
    { title: 'moscow-area', id: 1 },
    { title: 'nizhegorodskaya-area', id: 2 },
    { title: 'vladimir-area', id: 3 },
    { title: 'republic-tatarstan', id: 4 },
  ];
});
