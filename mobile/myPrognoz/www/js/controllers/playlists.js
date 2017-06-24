angular.module('starter.controllers')

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'moscow-area', id: 1 },
    { title: 'nizhegorodskaya-area', id: 2 },
    { title: 'vladimir-area', id: 3 },
  ];
});
