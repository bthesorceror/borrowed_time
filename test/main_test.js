var test                = require('tape');
var TokenManagerFactory = require('../index');

test('Token Manager', function(t) {
  var factory      = TokenManagerFactory('localhost', 6379);
  var tokenManager = factory('namespace', 1);

  t.test('stores value and returns a token', function(t) {
    t.plan(1);

    tokenManager.store('value', function(err, token) {
      t.ok(token, 'gets token');
    });
  });

  t.test('stores value and returns a unique token', function(t) {
    t.plan(1);

    tokenManager.store('value1', function(err, token1) {
      tokenManager.store('value2', function(err, token2) {
        t.notEqual(token1, token2, 'tokens must be unique');
      });
    });
  });

  t.test('can fetch value', function(t) {
    t.plan(1);

    tokenManager.store('value', function(err, token) {
      tokenManager.fetch(token, function(err, value) {
        t.equal(value, 'value', 'retrieves correct value');
      });
    });
  });

  t.test('tokens expire', function(t) {
    t.plan(1);

    tokenManager.store('value', function(err, token) {

      setTimeout(function() {

        tokenManager.fetch(token, function(err, value) {
          t.equal(value, null, 'retrieves correct value');
        });

      }, 2000);

    });
  });

  t.on('end', function() {
    tokenManager.close();
  });
});
