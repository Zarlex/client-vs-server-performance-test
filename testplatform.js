var express           = require('express'),
    util              = require('util'),
    app               = express(),
    server            = require('http').createServer(app),
    io                = require('socket.io').listen(server),
    socket            = require('./modules/socket.js'),
    config            = require('./config/config'),
    index             = require('./actions/index.js'),
    tweets            = require('./actions/tweet.js'),
    seeddb            = require('./actions/seeddb.js'),
    manifest            = require('./actions/manifest.js'),
    tests             = require('./actions/test.js'),
    storage           = require('./modules/storage');

socket.setSocketIo(io);
// Setup Middleware
app.use(express.bodyParser());
app.use(express.cookieParser());

//app.use(express.logger('dev'))
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// Routing
app.get('/',index.show)
app.get('/tweets', tweets.show)
app.get('/tweets/:action', tweets.show)

app.get('/seeddb', seeddb.new)
app.post('/seeddb/auth', seeddb.createCredentials)
app.post('/seeddb/tweets', seeddb.createTweet)

app.get('/tests', tests.index)
app.get('/tests/:id', tests.show)
app.get('/tests/download/:id', tests.download)
app.post('/tests/create', tests.newTest)
app.post('/tests/save/:id', tests.saveTest)
app.post('/tests/remove/:id', tests.removeTest)

app.get('/manifest',manifest.show)

app.use("/",express.static(__dirname));

// Accept
storage.open(function(){
  server.listen(config.port);
});

// Publish for Testing
exports.app = app;

util.puts("\nApi Node Server Started!");
util.puts('Running on localhost (127.0.0.1) on port: ' + config.port + '');
util.puts('Press Ctrl + C to stop.');