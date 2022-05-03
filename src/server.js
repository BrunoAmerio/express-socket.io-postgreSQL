const express = require('express');
const cors = require('cors');
const server = express();
const router = require('./routes/routes');

server.use(cors());
server.use(express.json());
server.use('/api', router);

module.exports = server;
