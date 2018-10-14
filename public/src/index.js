
function kelvin2Celcius(k) {
  return k - 273.15;
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

function $(s) {
  return document.getElementById(s);
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
  function populateUI(wind, direction, temp, pressure, humidity) {
    const beaufort = speedToBeaufort(wind);
    $('beaufort').className = 'wi';
    $('wind-direction').className = 'wi wi-wind';
    $('beaufort').classList.add(`wi-wind-beaufort-${beaufort}`);
    $('wind-direction').classList.add(`from-${direction}-deg`);
    $('temperature').textContent = kelvin2Celcius(temp).toFixed(2);
    $('pressure').textContent = pressure;
    $('humidity').textContent = humidity;
  }

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const city = e.target.city.value;
    postData('/', { city })
      .then((res) => {
        if (res.error) {
          populateUI(0, 0, 0, 0, 0);
          return;
        }
        const data = res.data;
        populateUI(data.wind.speed, data.wind.deg,
          data.main.temp, data.main.pressure, data.main.humidity);
      })
      .catch(error => console.error(error));
  });
});
