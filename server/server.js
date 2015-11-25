var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var User = require('./models/User');


var authRoutes = require('./routes/authRoutes');
var expensesRoutes = require('./routes/expensesRoutes');
var userManagerRoutes = require('./routes/userManagerRoutes');
var port = 3000;
mongoose.connect(config.database);

app.use(express.static("../public"));
app.use(bodyParser.urlencoded({	extended: false	}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/', authRoutes);
app.use('/expenses', expensesRoutes);
app.use('/users', userManagerRoutes);

app.listen(port);
console.log('Listening on port' + port);

//app.use(require('connect-livereload')());

