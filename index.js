var logentries = require('le_node');
var Stream = require('stream').Stream;
var util = require('util');
var LBS;

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

exports.LogentriesBunyanStream = LogentriesBunyanStream;
exports.createStream = function (config, options) {
    return new LogentriesBunyanStream(config, options);
};

/**
 * LogentriesBunyanStream
 *
 * @param {Object} config Logentries config and custom transform function
 */
function LogentriesBunyanStream(config, options) {
    if (!config || !config.token) {
        throw new Error('config.token must be set');
    }
    this.transform = options && options.transform;
    this.defaultLevel = options && options.defaultLevel || 'info';
    Stream.call(this);
    this.writable = true;

    config.levels = config.levels || {
            trace: 0,  // trace -> debug
            debug: 0,  // debug -> debug
            info: 1,  // info -> info
            warn: 3,  // warn -> warning
            error: 4,  // error -> err
            fatal: 7  // fatal -> emerg
        };
    this._logger = logentries.logger(config);
}

util.inherits(LogentriesBunyanStream, Stream);
LBS = LogentriesBunyanStream.prototype;

LBS.write = function (rec) {
    if (!this.writable) throw new Error('failed to write to a closed stream');
    var levelAsString = this._resolveLevel(rec.level);
    if (isFunction(this.transform)) {
        rec = this.transform(rec);
    }
    this._logger.log(levelAsString, rec);
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
        10: 'trace',
        20: 'debug',
        30: 'info',
        40: 'warn',
        50: 'error',
        60: 'fatal'
    };
    return levelToName[bunyanLevel] || this.defaultLevel;
};
