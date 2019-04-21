const axios = require('axios');
const { buildUrl } = require('../utils/utils');

const metofficeBaseURL =
  'http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json';

exports.getTimeStamps = async (req, res) => {
  const params = {
    res: 'hourly',
    key: process.env.MET_OFFICE_API_KEY,
  };
  const url = buildUrl(`${metofficeBaseURL}/capabilities`, params);
  try {
    const response = await axios.get(url);
    const { data } = response;
    const allAvailableObs = data.Resource.TimeSteps.TS;
    return res.status(200).json(allAvailableObs);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.getWindData = async (req, res) => {
  const { time } = req.params;
  const params = {
    res: 'hourly',
    time: time,
    key: process.env.MET_OFFICE_API_KEY,
  };
  const url = buildUrl(`${metofficeBaseURL}/all`, params);
  try {
    const response = await axios.get(url);
    const { data } = response;
    const windData = data.SiteRep.DV.Location;
    return res.status(200).json(windData);
  } catch (err) {
    return res.status(500).send(err);
  }
};
