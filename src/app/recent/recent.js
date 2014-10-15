angular.module('myApp.controller.recent', [
  'ui.router',
  'myApp.service.blog'])
  .config(function config($stateProvider) {
    $stateProvider.state('recent', {
      url: '/recent',
      views: {
        'main': {
          controller: 'RecentController',
          templateUrl: 'recent/recent.tpl.html'
        }
      },
      data: { pageTitle: 'Recent' }
    });
  })
  .controller('RecentController', function ($scope, blogService) {
    $scope.comment = [];
    $scope.load = function () {
      blogService.findAllComment().success(function (data) {
        for (var i = data.length - 1; i >= data.length - 5 && i >= 0; i--) {
          $scope.comment.push(data[i]);
        }
      });
    };

    $scope.load();
  });