angular.module('myApp.controller.main', [
  'ui.router',
  'myApp.service.blog'
]).config(function config($stateProvider) {
  $stateProvider.state('main', {
    url: '/main',
    views: {
      'main': {
        controller: 'MainController',
        templateUrl: 'main/main.tpl.html'
      }
    },
    data: { pageTitle: 'Main' }
  });
}).controller('MainController', function ($scope, blogService) {

  $scope.load = function () {
    blogService.findAllBlogs().then(function (data) {
      if (data.status === 'ok') {
        $scope.blogs = data.data;
      }
      else {
        console.log(data);
      }

    });
    $scope.postMsg = "";
  };

  $scope.load();

  $scope.sendNewPostMsg = function () {
    blogService.saveOneBlog($scope.postMsg, '0', '0').success(function (data) {
      $scope.postMsg = "";
      // refresh the page;commentMsg
      $scope.load();
    }).error(function (data) {
      console.log(data);
    });
  };
});