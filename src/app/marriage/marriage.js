angular.module('myApp.controller.marriage', [
  'ui.router',
  'myApp.service.blog'])
  .config(function config($stateProvider) {
    $stateProvider.state('marriage', {
      url: '/marriage',
      views: {
        'main': {
          controller: 'MarriageController',
          templateUrl: 'marriage/marriage.tpl.html'
        }
      },
      data: { pageTitle: 'Marriage' }
    });
  })
  .controller('MarriageController', function ($scope, blogService) {
    $scope.load = function () {
      blogService.findAllMarriageBlogs().then(function (data) {
        if (data.status === 'ok') {
          $scope.blogs = data.data;
        }
        else {
          console.log(data);
        }
      });
      $scope.postMsg = '';
    };

    $scope.load();

    $scope.sendNewMarriageMsg = function () {
      blogService.saveOneBlog($scope.postMsg, '1', '1').success(function (data) {
        $scope.postMsg = "";
        // refresh the page;commentMsg
        $scope.load();
      }).error(function (data) {
        console.log(data);
      });
    };
  });