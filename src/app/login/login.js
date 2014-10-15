angular.module('myApp.controller.login', [
  'ui.router',
  'myApp.service.auth'
]).config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    views: {
      'main': {
        controller: 'LoginController',
        templateUrl: 'login/login.tpl.html'
      }
    },
    data: { pageTitle: 'Login' }
  });
}).controller('LoginController', function ($scope, $state) {

  $scope.loginFail = false;

  $scope.login = function () {
    $scope.accessToken.login();
    if (!$scope.accessToken.fail) {
      $state.go('main');
    } else {
      $scope.loginFail = true;
    }
  };

  $scope.enter = function ($event) {
    if (13 === $event.keyCode) {
      $scope.login();
    }
  };

});