var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LinkSchema = new Schema({
	site: String,
	shortUrl: String
});

module.exports = mongoose.model('Link', LinkSchema);