const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const subscriptionRoutes = require('./subscriptions');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/api/subscriptions', subscriptionRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message });
});

module.exports = app;
