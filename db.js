var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Test');

module.exports = mongoose.connection;
