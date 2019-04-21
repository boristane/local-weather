const express = require('express');
const bodyParser = require('body-parser');
const weatherControler = require('./controlers/weather');
const queendControler = require('./controlers/queend');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  return next();
});

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/', weatherControler.post);
app.get('/queend/', queendControler.getTimeStamps);
app.get('/queend/:time', queendControler.getWindData);

module.exports = {
  app,
};
