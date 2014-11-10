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
        var url = debug ? "/json/blog.json" : "/php/blog.php";

        $http.get(url)
          .then(function (data) {
            data.data.forEach(function (item, index) {
              if (item.text_type === '0') {
                blogs.push(new Blog(item.text_id, item.text_content, item.text_type, item.media_type, item.post_time));
              }
            });
            return blogs;
          })
          .then(function (blogs) {
            self.findAllComment().then(function (commentData) {
              blogs.forEach(function (item) {
                item.extractMyReply(commentData.data);
              });
              deferred.resolve({
                status: "ok",
                "data": blogs
              });
            });
          });

        return deferred.promise;
      };

      BlogService.prototype.findAllMarriageBlogs = function () {
        var deferred = $q.defer();
        var blogs = [];
        var url = debug ? "/json/blog.json" : "/php/blog.php";
        $http.get(url)
          .then(function (data) {
            data.data.forEach(function (item, index) {
              if (item.text_type === '1') {
                blogs.push(new Blog(item.text_id, item.text_content, item.text_type, item.media_type, item.post_time));
              }
            });
            return blogs;
          })
          .then(function (blogs) {
            self.findAllComment().then(function (commentData) {
              blogs.forEach(function (item) {
                item.extractMyReply(commentData.data);
              });
              deferred.resolve({
                status: "ok",
                "data": blogs
              });
            });
          });

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
          data.data.forEach(function(item){
            if (item.text_id === text_id) {
              deferred.resolve({
                status: "ok",
                "data": item
              });
            }
          });
        });
        return deferred.promise;
      };

      BlogService.prototype.findAllComment = function () {
        var url = debug ? "/json/comment.json" : "/php/comment.php";
        return $http.get(url);
      };

      return new BlogService();
    };
  });