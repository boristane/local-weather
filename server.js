const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json({ extended: true }));

const apiKey = '9093d6ed156dabedd4cb52dd7e2d31a6';

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  const { city } = req.body;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  request(url, (err, response, body) => {
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      res.send(JSON.stringify({ data: null, error: 'Error, please try again' }));
      return;
    }
    const data = JSON.parse(body);
    if (!data.main) {
      res.send(JSON.stringify({ data: null, error: 'Error, please try again' }));
      return;
    }
    res.send(JSON.stringify({ data, error: null }));
    console.log(`${city} : ${data.main.temp}`);
  });
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
