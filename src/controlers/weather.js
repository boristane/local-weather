const { buildUrl } = require('../utils/utils');
const axios = require('axios');

const openWeaherURL = 'http://api.openweathermap.org/data/2.5/weather';
const timezoneURL = 'http://api.timezonedb.com/v2.1/get-time-zone';

exports.post = async (req, res, next) => {
  let weatherURL;
  if (req.body.city) {
    const { city } = req.body;
    const params = {
      q: city,
      appid: process.env.WEATHER_API_KEY,
    };
    weatherURL = buildUrl(openWeaherURL, params);
  } else {
    const { lat, lon } = req.body;
    const params = {
      lat,
      lon,
      appid: process.env.WEATHER_API_KEY,
    };
    weatherURL = buildUrl(openWeaherURL, params);
  }
  try {
    const response = await axios.get(weatherURL);
    const weatherData = response.data;
    if (!weatherData.main) {
      return res.status(500).json({
        data: weatherData,
        error: 'Error, please try again. No data for the given input.',
      });
    }
    const cityLat = weatherData.coord.lat;
    const cityLon = weatherData.coord.lon;
    const params = {
      key: process.env.TIMEZONE_API_KEY,
      format: 'json',
      by: 'position',
      lat: cityLat,
      lng: cityLon,
    };
    const url = buildUrl(timezoneURL, params);
    const timeResponse = await axios.get(url);
    const timeData = timeResponse.data;
    const time = 1000 * timeData.timestamp;
    res.status(200).send({ data: { weatherData, time }, error: null });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
