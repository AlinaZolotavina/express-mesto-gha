/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '62d3d2d125bad9b57f39a3e3',
  };

  next();
});

app.use(router);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Сервер слушает порт ${PORT}`);
});
