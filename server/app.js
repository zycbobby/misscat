
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
const randomstring = require('randomstring');
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
  switch(message.MsgType) {
    case 'text':
      // just record
      var blog =  {
        post_time: Date.now(),
        text_content : message.Content,
        text_type : 0,
        media_type: 0
      }
      sequelize.blog_text.create(blog).then((queryResult)=>{
        res.reply("已记录");
      }, (err)=>{
        res.reply(`记录出错, ${util.inspect(err)}`);
      });
      break;
    case 'image':
      var picUrl = message.PicUrl;
      var picName = randomstring.generate(8) + '.jpg';
      var blog =  {
        post_time: Date.now(),
        text_content : picName,
        text_type : 0,
        media_type: 1
      }
      var r = request.get(picUrl).pipe(fs.createWriteStream(`./pictures/${picName}`));
      r.on('response',  (res) => {
        sequelize.blog_text.create(blog).then((queryResult)=>{
          res.reply("已记录");
        }, (err)=>{
          res.reply(`记录出错, ${util.inspect(err)}`);
        });
      });
      break;
    case 'shortvideo':
      var mediaId = message.MediaId;
      res.reply("暂时无法记录小视频");
      break;
    case 'voice':
      var mediaId = message.MediaId;
      res.reply("暂时无法记录声音");
      break;
    case 'link':
      var url = message.Url;
      var blog =  {
        post_time: Date.now(),
        text_content : message.Description + ':' + url,
        text_type : 0,
        media_type: 0
      }
      sequelize.blog_text.create(blog).then((queryResult)=>{
        res.reply("已记录");
      }, (err)=>{
        res.reply(`记录出错, ${util.inspect(err)}`);
      });
      break;
  }
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
app.use(express.static('pictures'));
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
