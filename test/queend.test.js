const request = require('supertest');
const { app } = require('../src/app');
const mockAxios = require('axios');

it('should get the list of available times', async () => {
  const data = [
    '2019-04-20T11:00:00Z',
    '2019-04-20T12:00:00Z',
    '2019-04-20T13:00:00Z',
    '2019-04-20T14:00:00Z',
  ];
  mockAxios.get.mockImplementationOnce((url) =>
    Promise.resolve({
      status: 200,
      data: {
        Resource: {
          res: 'hourly',
          type: 'wxobs',
          TimeSteps: {
            TS: data,
          },
        },
      },
    }),
  );
  const res = await request(app).get('/queend/');
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
  expect(res.body).toEqual(data);
});

it('should get the wind data', async () => {
  const data = require('./data/sampleWindData');
  mockAxios.get.mockImplementationOnce((url) =>
    Promise.resolve({
      status: 200,
      data: {
        SiteRep: {
          DV: {
            Location: data,
          },
        },
      },
    }),
  );
  const res = await request(app).get('/queend/2019-04-20T11:00:00Z');
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
  expect(res.body).toEqual(data);
});
