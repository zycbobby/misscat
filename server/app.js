
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('express');
var app = express();
var config = require('./config.json')[process.env.NODE_ENV];
var fs = require('fs');
const expressValidator = require('express-validator');
const util = require('util');
const request = require('request');
const path = require('path');
const _ = require('lodash');
const sequelize = require('./models');
const bodyParser = require('body-parser');
app.set('json spaces', 4);
app.use(bodyParser.urlencoded( { extended : false }));
app.use(bodyParser.json());
app.use(expressValidator());

var wechat = require('wechat');

app.use('/wechat', wechat({
  token: config.token,
  appid: config.appid,
  encodingAESKey: config.aes
}, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  res.reply(message);
}))


/**
 * show the janus now is running
**/

app.get('/blogs', function(req, res) {
  sequelize.blog_text.findAll({order: 'post_time DESC'}).then(jsonResponse(res, 200), handleError(res));
});

app.post('/blogs', function(req, res) {
  sequelize.blog_text.create(_.extend({ post_time: Date.now()}, req.body)).then(jsonResponse(res, 200), handleError(res));
});

app.get('/comments', function(req, res) {
  sequelize.blog_comment.findAll({order: 'comment_time DESC'}).then(jsonResponse(res, 200), handleError(res));
});

app.post('/comments', function(req, res) {
  sequelize.blog_comment.create(_.extend({ comment_time: Date.now()}, req.body)).then(jsonResponse(res, 200), handleError(res));
});

app.use(express.static('build'));
var port = process.env.PORT || 9000
app.listen(port, function () {
  console.log(`Janus-gateway-remote-controller listening on port ${port}!`);
});


function handleError(res, errorCode) {
  var errorCode = errorCode || 500;
  return function(err) {
    res.status(errorCode).send(err);
    return false;
  }
}

function jsonResponse(res, normalCode) {
  return function(queryResult) {
    res.status(normalCode).json(queryResult);
    return true;
  }
}
