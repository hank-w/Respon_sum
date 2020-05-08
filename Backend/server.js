const express = require('express');
const app = express();

const students = require('./routes/students.jss');
const instructors = require('./routes/instructors.js');
const classes = require('./routes/classes.js');

const uri = 'mongodb://localhost/test';

var MongoClient = require('mongodb').MongoClient;
var connection = undefined;
var mongoClientOpts = {};

app.use(function expressMongoDb(req, res, next) {
  if (!connection) {
    connection = MongoClient.connect(uri, mongoClientOpts);
  }

  connection
    .then(function (db) {
      req.db = db;
      next();
    })
    .catch(function (err) {
      connection = undefined;
      next(err);
    });
});

app.use(express.json());

app.use('/students', students);
app.use('/instructors', instructors);
app.use('/classes', classes);

app.listen(8000, () => {
  console.log('Responsum listening on port 8000');
});
