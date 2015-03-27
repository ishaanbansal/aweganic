var mongoose = require('mongoose');

module.exports = mongoose.model('Feedback',{
	feedbackID: String,
	feedback: String,
	rating: String
});
