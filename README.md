# easy-regex
    A easy way to create regex routes

## Example

```javascript
'use strict';
let usersRoute1, usersRoute2;

const EasyRegex = require('escape-regex');


usersRoute1 = EasyRegex.create('{users}:{action=update|insert}:*');

usersRoute1.test('users:insert:2')
// > true
```