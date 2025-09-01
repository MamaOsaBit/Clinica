const express = require('express');
const routes = require('./routes');
const registerRouter = require('./routes/registerRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

app.use('/', registerRouter);

app.get('/', (req, res) => {
  res.send('Hola mundo');
});

module.exports = app;

