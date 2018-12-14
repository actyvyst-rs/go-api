var logger = require('morgan'),
  cors = require('cors'),
  http = require('http'),
  express = require('express'),
  errorhandler = require('errorhandler'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  helmet = require('helmet'),
  config = require('./config.json');

var app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler());
}

var port = process.env.PORT || 3003;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.IBE_MONGO_URI);

app.use(require('./offer-routes'));
app.use(require('./vendor-routes'));

http.createServer(app).listen(port, function(err) {
  console.log('listening in http://localhost:' + port);
});
