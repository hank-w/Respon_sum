const express = require('express');
const app = express();
require('./websocket/express-ws.js').setup(app);

const students = require('./routes/students.js');
const instructors = require('./routes/instructors.js');
const classes = require('./routes/classes.js');
const askQuestions = require('./routes/ask-questions.js');

const questionsWs = require('./websocket/questions-server.js');

const uri = 'mongodb://localhost';
const dbName = 'test';

var MongoClient = require('mongodb').MongoClient;
var connection = undefined;
var mongoClientOpts = {};

app.use(function expressMongoDb(req, res, next) {
  if (!connection) {
    connection = MongoClient.connect(uri, mongoClientOpts);
  }

  connection
    .then(function (db) {
      req.db = db.db(dbName);
      next();
    })
    .catch(function (err) {
      connection = undefined;
      next(err);
    });
});

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());

app.use('/students', students);
app.use('/instructors', instructors);
app.use('/classes', classes);
app.use('/questions-stream', questionsWs);
app.use('/classes', askQuestions);

app.listen(8000, () => {
  console.log('Responsum listening on port 8000');
});
