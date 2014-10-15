angular.module('myApp.service.auth', [])
  .factory('AuthObj', function() {

    var _refreshToken = function() {
      var self = this;
      if (self.isLuki()) {
        self.authority = 'luki';
        self.fail = false;
      } else if (self.isZuozuo()) {
        self.authority = 'zuozuo';
        self.fail = false;
      } else {
        self.fail = true;
      }
    };

    function AuthObj(pwd) {
      this.pwd = pwd;
      _refreshToken.apply(this);
    }

    AuthObj.prototype.isLuki = function () {
      return this.pwd === '0428';
    };

    AuthObj.prototype.isZuozuo = function () {
      return this.pwd === '19870915';
    };

    AuthObj.prototype.login = function() {
      _refreshToken.apply(this);
    };

    AuthObj.prototype.destroy = function() {
      this.pwd = '';
      this.fail = true;
      _refreshToken.apply(this);
    };

    return AuthObj;
  });