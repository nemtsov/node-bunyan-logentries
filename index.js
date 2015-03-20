var logentries = require('le_node')
  , Stream = require('stream').Stream
  , util = require('util')
  , LBS;

exports.LogentriesBunyanStream = LogentriesBunyanStream;
exports.createStream = function (config, options) {
  return new LogentriesBunyanStream(config, options);
};

/**
 * LogentriesBunyanStream
 *
 * @param {Object} config Logentries config
 */
function LogentriesBunyanStream(config) {
  if (!config || !config.token) {
    throw new Error('config.token must be set');
  }
  Stream.call(this);
  this.writable = true;
  config.levels = {
      trace: 0  // trace -> debug
    , debug: 0  // debug -> debug
    , info: 1  // info -> info
    , warn: 3  // warn -> warning
    , error: 4  // error -> err
    , fatal: 7  // fatal -> emerg
  };
  this._logger = logentries.logger(config);
}

util.inherits(LogentriesBunyanStream, Stream);
LBS = LogentriesBunyanStream.prototype;

LBS.write = function (rec) {
  if (!this.writable) throw new Error('failed to write to a closed stream');
  this._logger.log(this._resolveLevel(rec.level), rec);
};

LBS.end = function (rec) {
  if (arguments.length) this.write(rec);
  this.writable = false;
  this._logger.end();
};

LBS.destroy = function () {
  this.writable = false;
};

LBS._resolveLevel = function (bunyanLevel) {
  var levelToName = {
      10: 'trace'
    , 20: 'debug'
    , 30: 'info'
    , 40: 'warn'
    , 50: 'error'
    , 60: 'fatal'
  };
  return levelToName[bunyanLevel];
};
