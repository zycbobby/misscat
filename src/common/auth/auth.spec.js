describe('AuthObj', function () {

  var MockAuthObj;

  beforeEach(angular.mock.module('myApp.service.auth'));

  beforeEach(inject(function (AuthObj) {
    MockAuthObj = AuthObj;
    expect(MockAuthObj).not.toBe(null);
  }));

  it('can login with 0428', function () {
    var auth = new MockAuthObj('0428');
    expect(auth.canLogin).toBe(true);
    expect(auth.isLuki()).toBe(true);
    expect(auth.isZuozuo()).toBe(false);
  });

  it('can not login with 0429', function () {
    var auth = new MockAuthObj('0429');
    expect(auth.canLogin).toBe(false);
    expect(auth.isLuki()).toBe(false);
    expect(auth.isZuozuo()).toBe(false);
  });

  it('can not login with 19870915', function () {
    var auth = new MockAuthObj('19870915');
    expect(auth.canLogin).toBe(true);
    expect(auth.isLuki()).toBe(false);
    expect(auth.isZuozuo()).toBe(true);
  });

});
