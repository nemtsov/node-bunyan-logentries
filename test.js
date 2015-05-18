'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.config.includeStack = true;
sinon.assert.expose(chai.assert, {
  prefix: ""
});

var logentriesBunyan = require('./index');

describe('LogEntries Stream', function () {
  var stream;
  var logger;

  beforeEach(function () {
    logger = {
      log: sinon.spy(),
      end: sinon.spy()
    };
    stream = logentriesBunyan.createStream({
      token: 'atoken'
    });
    stream._logger = logger;
  });

  it('works', function () {
    stream.write({
      level: 10,
      msg: 'This is a test',
      hostname: 'my-machine'
    });
    expect(logger.log).to.have.been.called.once;
    expect(logger.log.args[0].length).to.equal(2);
  });

  describe('edge cases', function () {
    it('throws when a token is not passed', function () {
      expect(logentriesBunyan.createStream).to.throw('config.token must be set');
    });

    it('throws if nothing is passed', function () {
      expect(stream.write).to.throw("nothing passed to log");
    });

    it('throws if the stream is closed', function () {
      stream.end();
      expect(stream.write.bind(stream, {
        level: 10,
        msg: 'I should throw'
      })).to.throw('failed to write to a closed stream');
    });

    it('logs the last message before the stream is closed', function () {
      stream.end({
        level: 10,
        msg: 'last message'
      });
      expect(logger.log).to.have.been.called.once;
      expect(logger.end).to.have.been.called.once;
      expect(logger.log.args[0].length).to.equal(2);
      expect(stream.write.bind(stream, {
        level: 10,
        msg: 'I should throw'
      })).to.throw('failed to write to a closed stream');
    });

    it('throws if the stream is destroyed', function () {
      stream.destroy();
      expect(stream.write.bind(stream, {
        level: 10,
        msg: 'I should throw'
      })).to.throw('failed to write to a closed stream');
    });
  });

  describe('log levels', function () {
    it('translates bunyan level codes to strings', function () {
      stream.write({
        level: 10
      });
      expect(logger.log.args[0][0]).to.equal('trace');
      stream.write({
        level: 20
      });
      expect(logger.log.args[1][0]).to.equal('debug');
      stream.write({
        level: 30
      });
      expect(logger.log.args[2][0]).to.equal('info');
      stream.write({
        level: 40
      });
      expect(logger.log.args[3][0]).to.equal('warn');
      stream.write({
        level: 50
      });
      expect(logger.log.args[4][0]).to.equal('error');
      stream.write({
        level: 60
      });
      expect(logger.log.args[5][0]).to.equal('fatal');
    });

    it('sets a default level if not level is present', function () {
      stream.write({
        level: 500
      });
      expect(logger.log.args[0][0]).to.equal('info');
    });
  });

  describe('transform function', function () {
    it('performs the given transform function', function () {
      stream = logentriesBunyan.createStream({
        token: 'atoken'
      }, {
        transform: function (rec) {
          rec.message = rec.msg.toUpperCase();
          delete rec.msg;
          return rec;
        }
      });
      stream._logger = logger;
      stream.write({
        level: 20,
        msg: 'my message'
      });
      expect(logger.log.args[0][1].msg).to.not.exist;
      expect(logger.log.args[0][1].message).to.exist;
      expect(logger.log.args[0][1].message).to.equal('MY MESSAGE');
    });

    it('if not transform function is provided it will log json', function () {
      stream.write({
        level: 20,
        msg: 'my message'
      });
      expect(logger.log.args[0][1].msg).to.exist;
      expect(logger.log.args[0][1].msg).to.equal('my message');
    });

    it('can log plain text using a transform function', function () {
      stream = logentriesBunyan.createStream({
        token: 'atoken'
      }, {
        transform: function (rec) {
          return rec.level + '|' + rec.hostname + '|' + rec.msg;
        }
      });
      stream._logger = logger;
      stream.write({
        level: 'debug',
        msg: 'my message',
        hostname: 'my host'
      });
      expect(logger.log.args[0][1]).to.equal('debug|my host|my message');
    });
  });
});
