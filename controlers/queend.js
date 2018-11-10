const request = require('request');

exports.getTimeStamps = (req, res, next) => {
  const allAvailableObsURL = `http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/capabilities?res=hourly&key=${process.env.MET_OFFICE_API_KEY}`;
  request(allAvailableObsURL, (err, response, body) => {
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      res.send(JSON.stringify({ data: null, error: 'Error, please try again' }));
      return;
    }
    const allAvailableObs = JSON.parse(body).Resource.TimeSteps.TS;
    res.send(JSON.stringify(allAvailableObs));
  });
};

exports.getWindData = (req, res, next) => {
  const { obsTime } = req.body;
  const url = `http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/all?res=hourly&time=${obsTime}&key=${process.env.MET_OFFICE_API_KEY}`;
  request(url, (err, response, body) => {
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      res.send(JSON.stringify({ data: null, error: 'Error, please try again' }));
      return;
    }
    const windData = JSON.parse(body).SiteRep.DV.Location;
    res.send(JSON.stringify(windData));
  });
};
