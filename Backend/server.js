const express = require('express');
const app = express();

const students = require('./routes/students.jss');
const instructors = require('./routes/instructors.js');
const classes = require('./routes/classes.js');

app.use('/students', students);
app.use('/instructors', instructors);
app.use('/classes', classes);

app.listen(8000, () => {
  console.log('Responsum listening on port 8000');
});