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
});