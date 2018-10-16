const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json({ extended: true }));

const weatherApiKey = '9093d6ed156dabedd4cb52dd7e2d31a6';
const timeZoneApiKey = 'AS0Z5FLPB45G';

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  let weatherURL;
  if (req.body.city) {
    const { city } = req.body;
    weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`;
  } else {
    const { lat, lon } = req.body;
    weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;
  }
  const { city } = req.body;

  request(weatherURL, (err, response, body) => {
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      res.send(JSON.stringify({ data: null, error: 'Error, please try again' }));
      return;
    }
    const weatherData = JSON.parse(body);
    if (!weatherData.main) {
      res.send(JSON.stringify({ data: null, error: 'Error, please try again' }));
      return;
    }

    const cityLat = weatherData.coord.lat;
    const cityLon = weatherData.coord.lon;
    const timeZoneURL = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneApiKey}&format=json&by=position&lat=${cityLat}&lng=${cityLon}`;
    request(timeZoneURL, (timeErr, timeResponse, timeBody) => {
      if (timeErr) {
        res.send(JSON.stringify({ data: null, error: 'Error, please try again' }));
        return;
      }
      const timeData = JSON.parse(timeBody);
      const time = 1000 * (timeData.timestamp);
      res.send(JSON.stringify({ data: { weatherData, time }, error: null }));
      console.log(`${weatherData.name} : ${weatherData.main.temp}`);
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port 3000!');
});
