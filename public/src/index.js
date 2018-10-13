
function kelvin2Celcius(k) {
  return k - 273.15;
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
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const city = e.target.city.value;
    postData('/', { city })
      .then((res) => {
        let text = '';
        if (res.error) {
          text = res.error;
        } else {
          text = `The temperature in ${res.data.name} is ${kelvin2Celcius(res.data.main.temp).toFixed(2)} degrees.`;
        }
        document.getElementById('message').textContent = text;
      })
      .catch(error => console.error(error));
  });
});
