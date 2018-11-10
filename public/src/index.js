
function kelvin2Celcius(k) {
  return k - 273.15;
}

function celcius2fahrenheit(c) {
  return (c * 9 / 5) + 32;
}

function fahrenheit2celcius(f) {
  return (f - 32) * 5 / 9;
}

function speedToBeaufort(speed) {
  if (speed < 0.45) return 0;
  if (speed < 1.55) return 1;
  if (speed < 3.35) return 2;
  if (speed < 5.60) return 3;
  if (speed < 8.25) return 4;
  if (speed < 10.95) return 5;
  if (speed < 14.10) return 6;
  if (speed < 17.20) return 7;
  if (speed < 20.80) return 8;
  if (speed < 24.35) return 9;
  if (speed < 28.40) return 10;
  if (speed < 32.40) return 11;
  return 12;
}

function id2Icon(id, s) {
  // TODO: potential error on summer time.
  const hr = (new Date(s)).getUTCHours();
  const time = (hr >= 6 && hr <= 18) ? 'day' : 'night';

  if (id >= 200 && id <= 232) return `wi-${time}-thunderstorm`;
  if (id >= 300 && id <= 321) return `wi-${time}-showers`;
  if (id >= 500 && id <= 531) return `wi-${time}-rain`;
  if (id >= 600 && id <= 622) return `wi-${time}-snow`;
  if (id >= 700 && id <= 781) return `wi-${time}-fog`;
  if (id === 800) return time === 'day' ? 'wi-day-sunny' : 'wi-night-clear';
  if (id >= 801 && id <= 802) return time === 'day' ? 'wi-day-sunny-overcast' : 'wi-night-partly-cloudy';
  if (id >= 803) return `wi-${time}-cloudy`;
  return '';
}

function $(s) {
  return document.getElementById(s) || document.querySelector(s);
}

function postData(url = '', data = {}) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data),
  })
    .then(response => response.json());
}

document.addEventListener('DOMContentLoaded', () => {
  function populateUI(data, time = 0) {
    const { speed, deg } = data.wind;
    const {
      temp,
      pressure,
      humidity,
    } = data.main;
    const { description, id } = data.weather[0];
    const beaufort = speedToBeaufort(speed);
    $('weather').classList.remove('hidden');
    $('weather').style.opacity = 0;
    setTimeout(() => {
      $('city-name').value = data.name;
      $('weather').style.opacity = 1;
      $('main-icon').className = 'wi';
      $('main-icon').classList.add(id2Icon(id, time));
      $('description').textContent = description;
      $('beaufort').className = 'wi';
      $('wind-direction').className = 'wi wi-wind';
      $('beaufort').classList.add(`wi-wind-beaufort-${beaufort}`);
      $('wind-direction').classList.add(`from-${deg}-deg`);
      $('temperature').textContent = kelvin2Celcius(temp).toFixed(1);
      $('pressure').textContent = pressure;
      $('humidity').textContent = humidity;
    }, 300);
    $('message').classList.add('hidden');
  }

  function processResponse(res) {
    if (res.error) {
      $('weather').classList.add('hidden');
      $('message').classList.remove('hidden');
      return;
    }
    const data = res.data.weatherData;
    const { time } = res.data;
    populateUI(data, time);
  }

  function getLocation(cb) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        cb(location);
      });
    }
  }

  $('location').addEventListener('click', (e) => {
    e.preventDefault();
    getLocation((location) => {
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
      postData('/', { lat, lon })
        .then((res) => {
          processResponse(res);
        })
        .catch(error => console.error(error));
    });
  });

  $('temp-conversion').addEventListener('click', (e) => {
    if (e.target.classList.contains('wi-celsius')) {
      const c = parseInt($('temperature').textContent, 10);
      const f = celcius2fahrenheit(c);
      $('temperature').textContent = f.toFixed(1);
      e.target.classList.add('wi-fahrenheit');
      e.target.classList.remove('wi-celsius');
    } else {
      const f = parseInt($('temperature').textContent, 10);
      const c = fahrenheit2celcius(f);
      $('temperature').textContent = c.toFixed(1);
      e.target.classList.add('wi-celsius');
      e.target.classList.remove('wi-fahrenheit');
    }
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const city = e.target.city.value;
    postData('/', { city })
      .then((res) => {
        processResponse(res);
      })
      .catch(error => console.error(error));
  });
});
