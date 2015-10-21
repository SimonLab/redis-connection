console.log('heroku');
var test    = require('tape');
var decache = require('decache');
var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '') + " -> ";

test(file + " Confirm RedisCloud is accessible GET/SET", function(t) {
  // require('env2')('config.env');
  delete process.env.HEROKU_REDIS_URL;
  process.env.REDISCLOUD_URL = 'redis://h:p9bu5mvbnu4gar6evphupusedkp@ec2-54-217-234-142.eu-west-1.compute.amazonaws.com:17389';
  decache('../index.js');
  var redisClient = require('../index.js')();

  redisClient.set('redis', 'working');
  // console.log("✓ Redis Client connected to: " + redisClient.address);
  t.ok(redisClient.address !== '127.0.0.1:6379', "✓ Redis Client connected to: " + redisClient.address)
  redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'working', '✓  Rediscloud is ' + reply.toString());
    redisClient.end();   // ensure redis con closed! - \\
    t.equal(redisClient.connected, false, "✓ Connection to Rediscloud Closed");
    t.end();
  });
});

test(file + " Confirm Heroku-Redis is accessible GET/SET", function(t) {
  // require('env2')('config.env');
  process.env.HEROKU_REDIS_URL = 'redis://h:p9bu5mvbnu4gar6evphupusedkp@ec2-54-217-234-142.eu-west-1.compute.amazonaws.com:17389';
  delete process.env.REDISCLOUD_URL; // unset SearchBox so we can test Bonsai
  decache('../index.js');
  var redisClient = require('../index.js')();
  redisClient.set('redis', 'working');
  // console.log("✓ Redis Client connected to: " + redisClient.address);
  t.ok(redisClient.address !== '127.0.0.1:6379', "✓ Redis Client connected to: " + redisClient.address)
  redisClient.get('redis', function (err, reply) {
    t.equal(reply.toString(), 'working', '✓ Heroku Redis is ' + reply.toString());
    redisClient.end();   // ensure redis con closed! - \\
    t.equal(redisClient.connected, false, "✓ Connection to Heroku Redis Closed");
    t.end();
  });
});
