bunyan-logentries [![Build Status](https://secure.travis-ci.org/nemtsov/node-bunyan-logentries.png)](http://travis-ci.org/nemtsov/node-bunyan-logentries)
=================

Bunyan logger stream for Logentries


Usage
-----

**Note**: the stream-type must be `raw`.

```
var bunyanLogentries = require('bunyan-logentries')

var logger = bunyan.createLogger({
  config.streams = [{
      level: 'info'
    , stream: bunyanLogentries.createStream({token: token})
    , type: 'raw'
  }]
})
```


License
-------

MIT. See LICENSE
