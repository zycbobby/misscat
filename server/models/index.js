// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs'),
   path = require('path'),
   Sequelize = require('sequelize'),
   lodash = require('lodash'),
   config = require('../config.json')[process.env.NODE_ENV],
   sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }),
  db = {};

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].hasOwnProperty('associate')) {
    db[modelName].associate(db)
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
