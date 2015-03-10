# Borrowed Time

Store values for a limited time with token access

## Example

```javascript
var TokenManagerFactory = require('borrowed_time');
var factory             = TokenManagerFactory('localhost', 6379);
var tokenManager        = factory('namespace', 1);

// Tokens with be scoped to namespace and will last for 1 second

tokenManager.store('value', function(err, token) {
  tokenManager.fetch(token, function(err, value) {
    // value will equal 'value'
    tokenManager.close();
  });
});
```
