const dotenv = require('dotenv');
const { app } = require('./src/app');

dotenv.config();

if (
  !process.env.PORT ||
  !process.env.MET_OFFICE_API_KEY ||
  !process.env.TIMEZONE_API_KEY ||
  !process.env.WEATHER_API_KEY
) {
  console.log(
    `Environment variables required: PORT, MET_OFFICE_API, TIMEZONE_API_KEY, WEATHER_API_KEY`,
  );
  process.exit(1);
}

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
