var mongoose = require('mongoose');

module.exports = mongoose.model('Menu',{
	comboID: String,
	mainCourse: String,
	drinks: String
});
