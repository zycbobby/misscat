angular.module('myApp.directive.post', [])
  .directive('post', function () {
    return {
      restrict: 'E',
      scope: {
        blog: "="
      },
      controller: function ($scope, blogService) {
        $scope.showReply = false;
        $scope.commentMsg = {txt: ""};

        $scope.toggleReply = function () {
          // console.log($scope.blog.replies + " will be expand");
          $scope.showReply = !$scope.showReply;
        };

        $scope.sendNewComment = function (text_id) {

          blogService.saveOneComment(text_id, $scope.commentMsg.txt).success(function (data) {

            // use blog service to reload the blog
            blogService.findOne(text_id).then(function (data) {
              $scope.blog = data.data;
              $scope.commentMsg.txt = "";
            });
          });
        };

        $scope.enter = function (text_id) {
          $scope.sendNewComment(text_id);
        };
      },
      templateUrl: 'post/post.tpl.html',
      link: function ($scope, iElement, iAttr, ctrl) {
      }
    };
  });
