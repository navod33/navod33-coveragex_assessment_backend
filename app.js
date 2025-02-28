const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const todoRoutes = require('./routes/todo.routes.js');

const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// REST routes
app.use('/api/todo', todoRoutes);

module.exports = { app };
