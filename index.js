var uuid  = require('uuid');
var redis = require('redis');

function fullKey(token) {
  return this.namespace + '-' + token;
}

function TokenManager(redis, namespace, ttl) {
  this.redis     = redis;
  this.namespace = namespace;
  this.ttl       = ttl;
}

TokenManager.prototype.store = function(value, cb) {
  var token = uuid.v4();
  var key   = fullKey.call(this, token);

  this.redis.setex(key, this.ttl, value, function(err) {
    cb(err, token);
  }.bind(this));
}

TokenManager.prototype.fetch = function(token, cb) {
  var key   = fullKey.call(this, token);

  this.redis.get(key, cb);
}

TokenManager.prototype.close = function() {
  this.redis.end();
}

module.exports = function(host, port) {
  return function(namespace, ttl) {
    var client = redis.createClient(port, host);
    return new TokenManager(client, namespace, ttl);
  }
}
