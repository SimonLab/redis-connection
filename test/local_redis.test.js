console.log('local');
require('env2')('config.env');
var test    = require('tape');
var decache = require('decache');          // http://goo.gl/JIjK9Y

// delete to ensure we use LOCAL Redis
delete process.env.HEROKU_REDIS_URL;
delete process.env.REDISCLOUD_URL;
var redisClient = require('../index.js')();
var redisSub = require('../index.js')('subscriber');

var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";

test(file +" Connect to LOCAL Redis instance and GET/SET", function(t) {
  t.equal(redisClient.address, '127.0.0.1:6379',
  "✓ Redis Client connected to: " + redisClient.address)
  redisClient.set('redis', 'LOCAL');
  redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    t.end();
  });
});

test(file +" Connect to LOCAL Redis instance and GET/SET", function(t) {
  t.equal(redisSub.address, '127.0.0.1:6379',
  "✓ Redis Client connected to: " + redisSub.address)
  redisSub.set('redis', 'LOCAL');
  redisSub.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    t.end();
  });
});

test('Require an existing Redis connection', function(t){
  var r2 = require('../index.js')();
  t.equal(r2.address, '127.0.0.1:6379',
  "✓ Redis Client r2 connected to: " + r2.address)
  r2.get('redis', function(err, reply){
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    // r2.end();
    t.end();
  });
});

test('Require an existing Redis SUBSCRIBER connection', function(t){
  var rs2 = require('../index.js')('subscriber');
  rs2.get('redis', function(err, reply){
    t.equal(reply.toString(), 'LOCAL', '✓ LOCAL Redis is ' +reply.toString());
    rs2.end();
    t.end();
  });
});

test('Restore REDIS_URL for Heroku Compatibility tests', function(t){
  redisClient.end();   // ensure redis con closed!
  redisSub.end();
  // decache('../index.js');
  t.equal(redisClient.connected, false,  "✓ Connection to LOCAL Closed");

    // process.env.HEROKU_REDIS_URL = HEROKU_REDIS_URL || 'redis://h:p9bu5mvbnu4gar6evphupusedkp@ec2-54-217-234-142.eu-west-1.compute.amazonaws.com:17389';
    // process.env.REDISCLOUD_URL = REDISCLOUD_URL || 'redis://h:p9bu5mvbnu4gar6evphupusedkp@ec2-54-217-234-142.eu-west-1.compute.amazonaws.com:17389'; // restore for next test!
  t.end();
});
