'use strict';

// eslint-disable-next-line
const tracer = require('./tracer')('express-server-side');
const cors = require('cors');

const gql_server = process.env.GQL_SERVER_HOST || 'localhost:4000';
const spring_boot_server = process.env.SPRING_BOOT_HOST || 'localhost:8080';

const middleware = require('./middleware');

// Require in rest of modules
const express = require('express');
const axios = require('axios').default;

// Setup express
const app = express();
app.use(middleware({}));
app.use(cors());
const PORT = 8081;

const getCrudController = () => {
  const router = express.Router();
  const resources = [];
  router.get('/', (req, res) => res.send(resources));
  router.post('/', (req, res) => {
    resources.push(req.body);
    return res.status(201).send(req.body);
  });
  return router;
};

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.includes('secret_token')) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(express.json());
app.get('/health', (req, res) => res.status(200).send("HEALTHY")); // endpoint that is called by framework/cluster
app.get('/run_test', async (req, res) => {
  // Simulation of the Orchestration of the various calls
  // Call Spring boot Server
  await axios.get(`http://${spring_boot_server}/flights`);

  // Call GraphQL Server
  const gqlReq = await axios.post(`http://${gql_server}/graphql`, {
    query: 'query{authors{id name}}', 
  }, {
    headers: {
      Authorization: 'secret_token',
    },
  });
  return res.status(201).send(gqlReq.data);
});
app.use('/cats', async (req, res) => {
  console.log('service B triggered');
  const response = await axios.get(`http://${spring_boot_server}/flights`);
  return res.status(201).send(response.data);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
