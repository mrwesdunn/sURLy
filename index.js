var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');

var port = process.env.PORT || 8080;

app.listen(port);
console.log("listening on port: " + port);