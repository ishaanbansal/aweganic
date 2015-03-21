var mongoose = require('mongoose');

mongoose.connect('mongodb://ninja:ninja69@ds031611.mongolab.com:31611/ninjadb');

module.exports = mongoose.connection;
