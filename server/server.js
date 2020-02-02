const express = require('express');
var path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');

const app = express();
app.set('port', process.env.PORT  || config.port); // Set port to 3000 or the provided PORT variable
// to connect to mogo database

// Only include useMongoClient only if your mongoose version is < 5.0.0
mongoose.connect(config.database, {useMongoClient: true}, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('app port', app.get('port'));
    console.log('Connected to the database');
  }
});
app.use(express.static(path.join(__dirname, '../dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');
const productSearchRoutes = require('./routes/product-search');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/search', productSearchRoutes);


//to load  home  page
app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


module.exports = app;
