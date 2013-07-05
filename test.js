var assert = require('assert')
  , bl = require('./index')
  , inst

inst = bl.createStream({token: 'rnd'})

//TODO: destub
assert('object' === typeof inst)

console.log('ok')
