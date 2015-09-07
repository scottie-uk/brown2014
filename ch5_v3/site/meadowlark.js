var express = require('express');

var app = express();

var fortune = require('./lib/fortune.js');
// below line is just to illustrate jshint complaining about the ==
// if (app.thing == null) console.log('bleat!');

// set up handlebars view engine
var handlebars = require('express3-handlebars')
  .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set up the directory for static files (such as logo.png)
app.use(express.static(__dirname + '/public'));

// set the variable showTests to true only when in the
// development environment and the url has the ``test=1''
// query string in it
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && 
    req.query.test === '1';
  next();
});

// the above two app.use middleware function calls need to be
// before any routes are defined (that is, before any
// app.get function calls).

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
 });
});

app.get('tour/hood-river', function(req, res){
  res.render('tour/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
  res.render('tours/request-group-rate');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + 
    app.get('port') + '; press Ctrl-C to terminate.');
});

