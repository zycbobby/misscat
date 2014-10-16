angular.module('myApp', [
  'templates-app',
  'templates-common',
  'ui.router',
  'ngCookies',
  'myApp.controller.login',
  'myApp.controller.main',
  'myApp.controller.recent',
  'myApp.controller.marriage',
  'myApp.service.auth',
  'myApp.service.blog',
  'myApp.directive.post'
])
  .constant('debugState', false)
  .config(function ($urlRouterProvider, blogServiceProvider, debugState) {

    $urlRouterProvider.otherwise('/login');

    blogServiceProvider.setDebugState(debugState);

  })
  .run(function ($rootScope, $state, $cookieStore, AuthObj, debugState) {

    $rootScope.debugState = debugState;

    var t = $cookieStore.get('token') || { 'pwd': ''};
    $rootScope.accessToken = new AuthObj(t.pwd);

    $rootScope.toLogin = function () {
      $state.go('login', {}, {'location': true});
    };

  }).controller('AppCtrl', function ($scope, $state) {

    $scope.$on('$stateChangeSuccess', function (event, toState) {
      if ($scope.accessToken.fail) {
        event.preventDefault();
        $scope.toLogin();
      } else {
        if (angular.isDefined(toState.data.pageTitle)) {
          $scope.pageTitle = toState.data.pageTitle || ' ';
        }
      }
    });

    $scope.exit = function () {
      $scope.accessToken.destroy();
      $scope.toLogin();
    };
  });

