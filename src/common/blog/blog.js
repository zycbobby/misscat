angular.module('myApp.service.blog', [])
  .factory('Blog', function () {

    var Blog = function (text_id, text_content, text_type, media_type, post_time) {
      this.text_id = text_id;
      this.text_content = text_content;
      this.text_type = text_type;
      this.media_type = media_type;
      this.post_time = post_time;
      this.replies = [];
    };

    Blog.prototype.appendReply = function (reply) {
      this.replies.push(reply);
    };

    Blog.prototype.extractMyReply = function (allReplies) {
      for (var i = 0; i < allReplies.length; i++) {
        if (allReplies[i].reply_to === this.text_id) {
          this.replies.push(allReplies[i]);
        }
      }
    };

    return Blog;
  })
  .factory('Reply', function () {
    var Reply = function (text_id, text_content, post_time, reply_to) {
      this.text_id = text_id;
      this.text_content = text_content;
      this.post_time = post_time;
      this.reply_to = reply_to;
    };

    return Reply;
  })
  .provider('blogService', function () {

    var debug = false;

    this.setDebugState = function (debugState) {
      debug = debugState;
    };

    this.$get = function ($http, $q, Blog) {

      function BlogService() {
        this.self = this;
      }

      BlogService.prototype.findAllBlogs = function () {
        var self = this;
        var deferred = $q.defer();
        var blogs = [];
        if (debug) {
          $http.get("/json/blog.json").success(function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].text_type === '0') {
                blogs.push(new Blog(data[i].text_id, data[i].text_content, data[i].text_type, data[i].media_type, data[i].post_time));
              }
            }
            self.findAllComment().success(function (commentData) {
              for (var i = 0; i < blogs.length; i++) {
                blogs[i].extractMyReply(commentData);
              }
              deferred.resolve({
                status: "ok",
                "data": blogs
              });
            });
          });
        } else {
          $http.get("/php/blog.php").success(function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].text_type === '0') {
                blogs.push(new Blog(data[i].text_id, data[i].text_content, data[i].text_type, data[i].media_type, data[i].post_time));
              }
            }
            self.findAllComment().success(function (commentData) {
              for (var i = 0; i < blogs.length; i++) {
                blogs[i].extractMyReply(commentData);
              }
              deferred.resolve({
                status: "ok",
                "data": blogs
              });
            });
          });
        }

        return deferred.promise;
      };

      BlogService.prototype.findAllMarriageBlogs = function () {
        var deferred = $q.defer();
        var blogs = [];
        if (debug) {
          $http.get("/json/blog.json").success(function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].text_type === '1') {
                blogs.push(new Blog(data[i].text_id, data[i].text_content, data[i].text_type, data[i].media_type, data[i].post_time));
              }
            }
            deferred.resolve({
              status: "ok",
              "data": blogs
            });
          });
        }
        else {
          $http.get("/php/blog.php").success(function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].text_type === '1') {
                blogs.push(new Blog(data[i].text_id, data[i].text_content, data[i].text_type, data[i].media_type, data[i].post_time));
              }
            }
            deferred.resolve({
              status: "ok",
              "data": blogs
            });
          });
        }

        return deferred.promise;
      };


      BlogService.prototype.saveOneBlog = function (postMsg, text_type, media_type) {
        return $http.post("/php/insert.php", {
          'blog_content': postMsg,
          'text_type': text_type,
          'media_type': media_type
        });
      };

      BlogService.prototype.saveOneComment = function (text_id, commentMsg) {
        return $http.post("/php/insert_comment.php", {
          'text_id': text_id,
          'comment_content': commentMsg
        });
      };

      BlogService.prototype.findOne = function (text_id) {
        var deferred = $q.defer();
        this.findAllBlogs().then(function (data) {
          for (var i = 0; i < data.data.length; i++) {
            if (data.data[i].text_id === text_id) {
              deferred.resolve({
                status: "ok",
                "data": data.data[i]
              });
            }
          }
        });
        return deferred.promise;
      };

      BlogService.prototype.findAllComment = function () {
        if (debug) {
          return $http.get("/json/comment.json");
        }
        return $http.get("/php/comment.php");
      };

      return new BlogService();
    };
  });