const request = require('request');

exports.post = (req, res, next) => {
  let weatherURL;
  if (req.body.city) {
    const { city } = req.body;
    weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`;
  } else {
    const { lat, lon } = req.body;
    weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`;
  }

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
    console.log(cityLat);
    const timeZoneURL = `http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONE_API_KEY}&format=json&by=position&lat=${cityLat}&lng=${cityLon}`;
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
};
