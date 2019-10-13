var express = require('express');
var app = express();
var port = process.env.PORT || 3010;



var routes = require('./routes/appRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Blog-Analyzer API server running on: ' + port);