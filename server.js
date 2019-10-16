var express = require('express');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 3010;

app.use(cors());

var routes = require('./routes/appRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Blog-Analyzer API server running on: ' + port);