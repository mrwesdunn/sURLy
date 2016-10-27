var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Chance = require('chance');
var port = process.env.PORT || 8080;
var base = 'https://glacial-citadel-67866.herokuapp.com/';

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/db');

var Link = require('./app/models/link');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var router = express.Router();

router.use(function(req,res,next) {
	console.log("incoming request, sir...")
	console.log(req.method + ' ' + 'route: ' + '"' + req.url + '"');
	next();
});

router.get('/', function(req, res) {
	var chance = new Chance();
	res.send('your name is now: ' + chance.hash({length: 8}) + '!');
});

router.route('/new/*')
	.get(function(req, res) {
		var site = req.path.slice(5);
		if (/^(http|s)+:\/\/.+\./.test(site)) {
			var link = new Link();
		 	var chance = new Chance();

		 	console.log("requesting short url for: " + site);

		 	link.site = site;
		 	link.shortUrl = chance.hash({length: 8});

		 	link.save(function(err) {
		 		if (err) {
		 			console.log(err);
		 			res.json({error: "Sorry, something is amiss! Please try again. :("});
		 		}
		 		res.json({
		 			original_url: site, 
		 			short_url: base + link.shortUrl
		 		});
		 	});
		} else {
			console.log("DERP! Someone doesn't know what's up... " + site);
			res.json({error: 'Wrong url format, make sure you have a valid protocol and real site.'});
		}
  });

router.route('/*')
	.get(function(req, res) {
		var linkId = req.path.slice(1);
		if (/^[A-Za-z0-9]+$/.test(linkId)) {
			Link.find({shortUrl: linkId}, function(err, link) {
				if (err) {
					console.log(err);
					res.json({error: "Sorry, something is amiss! Please try again. :("})
				}

				if (link.length > 0) {
					console.log('It\'s a match! We\'re taking this dude to ' + link[0].site + '! Bye, Felicia!');
					res.redirect(link[0].site);
				} else {
					res.json({error: 'Oops! It doesn\'t look like we have that link in the database.'});
				}
			})
		} else {
			res.json({error: 'Oops! It doesn\'t look like we have that link in the database.'});
		}
	});

app.use('/', router);

app.listen(port);
console.log("listening on port: " + port);