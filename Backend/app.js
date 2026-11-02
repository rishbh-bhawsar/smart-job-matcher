require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiKey = require('./middleware/apiKey.js');
const errorHandler = require('./middleware/errorHandler.js');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api', apiKey, routes);

app.use(errorHandler);

module.exports = app;