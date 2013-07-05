var logentries = require('node-logentries')
  , Stream = require('stream').Stream
  , util = require('util')
  , LBS

exports.LogentriesBunyanStream = LogentriesBunyanStream
exports.createStream = function (config, options) {
  return new LogentriesBunyanStream(config, options)
}

/**
 * LogentriesBunyanStream
 *
 * @param {Object} config Logentries config
 * @param {Object} [options] {exludes: Object} keys to exclude from logentries
 */

function LogentriesBunyanStream(config, options) {
  if (!config || !config.token) {
    throw new Error('config.token must be set')
  }
  Stream.call(this)
  this.writable = true
  config.levels = {
      trace: 0  // trace -> debug
    , debug: 0  // debug -> debug
    , info: 1  // info -> info
    , warn: 3  // warn -> warning
    , error: 4  // error -> err
    , fatal: 7  // fatal -> emerg
  }
  this._logger = logentries.logger(config)
  this._options = options || {}
  this._options.excludes = this._options.excludes || {
      hostname:1, pid: 1
    , level:1, time:1, name:1, v:1
  }
}

util.inherits(LogentriesBunyanStream, Stream)
LBS = LogentriesBunyanStream.prototype

LBS.write = function (rec) {
  if (!this.writable) throw new Error('failed to write to a closed stream')
  var str = this._serializeRec(rec)
  this._logger.log(this._resolveLevel(rec.level), str)
}

LBS.end = function (rec) {
  if (arguments.length) this.write(rec)
  this.writable = false
}

LBS.destroy = function () {
  this.writable = false
}

LBS._serializeRec = function (rec) {
  var excl = this._options.excludes
    , seen = []
  function safeFilter(key, val) {
    if (excl[key] || ('' === val)) return
    if (!val || typeof (val) !== 'object') return val
    if (seen.indexOf(val) !== -1) return '[Circular]'
    seen.push(val)
    return val
  }
  return JSON.stringify(rec, safeFilter)
}

LBS._resolveLevel = function (bunyanLevel) {
  var levelToName = {
      10: 'trace'
    , 20: 'debug'
    , 30: 'info'
    , 40: 'warn'
    , 50: 'error'
    , 60: 'fatal'
  }
  return levelToName[bunyanLevel]
}
