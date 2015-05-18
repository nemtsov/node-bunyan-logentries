bunyan-logentries [![Build Status](https://secure.travis-ci.org/nemtsov/node-bunyan-logentries.png)](http://travis-ci.org/nemtsov/node-bunyan-logentries)
=================

Bunyan logger stream for Logentries.


Installation
------------

First install bunyan:

```shell
$ npm install --save bunyan
```

Then install bunyan-logentries:

```shell
$ npm install --save bunyan-logentries
```


Usage
-----

**Note**: the stream type must be `raw`.

```js
var bunyan = require('bunyan');
var bunyanLogentries = require('bunyan-logentries');

var logger = bunyan.createLogger({
  streams: [{
    level: 'info',
    stream: bunyanLogentries.createStream({token: token}),
    type: 'raw'
  }]
});
```

Advanced Usage
----
```js
var bunyan = require('bunyan');
var bunyanLogentries = require('bunyan-logentries');

var logger = bunyan.createLogger({
  streams: [{
    level: 'info',
    stream: bunyanLogentries.createStream({ 
      token: token,
      levels: { // LogEntries Mapping:debug:0, info:1, notice:2, warning:3, err:4, crit:5, alert:6, emerg:7
        trace: 0,
        debug: 0,
        info: 1,
        warn: 3,
        error: 4
        fatal: 7
      },
      timestamp: false,
      secure: true,
      host:'api.logentries.com'
    }),
    type: 'raw'
  }, {
    transform: function (logRecord) {
      // do whatever you like to the record and then return it
      logRecord.hostname = logRecord.hostname.toUpperCase();
      delete logRecord.v;
      return logRecord
    },
    defaultLevel: 'info'
  }]
});
```


`token` should be obtained from [Logentries](https://logentries.com).


License
-------

MIT. See LICENSE
