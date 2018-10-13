// const fetch = require('node-fetch');
const request = require('request');

function kelvin2Celcius(k){
  return k -273.15;
}

const apiKey = '9093d6ed156dabedd4cb52dd7e2d31a6';
const city = 'milton keynes';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

request(url, (err, res, body) => {
  if (err) return;
  const data = JSON.parse(body);
  console.log(`${city} : ${kelvin2Celcius(data.main.temp)} degrees.`)
});
