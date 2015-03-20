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
      level: 'info'
    , stream: bunyanLogentries.createStream({ token: token })
    , type: 'raw'
  }];
});
```

`token` should be obtained from [Logentries](https://logentries.com).


License
-------

MIT. See LICENSE
