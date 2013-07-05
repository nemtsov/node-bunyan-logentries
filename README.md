bunyan-logentries
=================

Bunyan logger stream for Logentries

Usage
-----

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

*Note*: the stream-type must be `raw`.
