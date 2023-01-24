require('dotenv').config();

const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();
const apiRouter = require('./api');
const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));



server.use((req, res, next) => {
    console.log('___Body Logger START___');
    console.log(req.body);
    console.log("___Body Logger End___");
    next();
});
server.use('/api', (req, res, next) => {
  console.log("A request was made to /api");
  next();
});

server.get('/api', (req, res, next) => {
  console.log("A get request was made to /api");
  res.send({ message: "success" });
});

server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});