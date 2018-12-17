var logger = require('morgan'),
  cors = require('cors'),
  http = require('http'),
  express = require('express'),
  errorhandler = require('errorhandler'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  helmet = require('helmet');
const { port, mongoURI } = require('./config');

const app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler());
}

mongoose.Promise = global.Promise;
mongoose.connect(
  mongoURI,
  // 'mongodb://mongo:27017/go-ibe',
  { useNewUrlParser: true }
);

app.use(require('./offer-routes'));
app.use(require('./vendor-routes'));

http.createServer(app).listen(port, function(err) {
  console.log('listening in http://localhost:' + port);
});
