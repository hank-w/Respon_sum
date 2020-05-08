const express = require('express');
const app = express();

const { validationResult } = require('express-validator');

const students = require('./routes/students.jss');
const instructors = require('./routes/instructors.js');
const classes = require('./routes/classes.js');

const uri = 'mongodb://localhost/responsum';
const dbName = 'responsum';

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

app.use((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    next();
  }
});

app.use(express.json());

app.use('/students', students);
app.use('/instructors', instructors);
app.use('/classes', classes);

app.listen(8000, () => {
  console.log('Responsum listening on port 8000');
});
