const express = require('express');
const { ObjectId } = require('mongodb');
const url = require('url');
const { questionDocToResponse } = require('../routes/get-questions');

const router = express.Router();

router.ws('/questions', (ws, req) => {
  const classId = req.query.classId;

  req.db.collection('classes').findOne({ _id: ObjectId(classId) }, (err, cls) => {
    if (err) return console.log('Database Error');
    if (!cls) return console.log('Class Stream Not Found');
    ws.classId = classId;
    if (cls.active_question == null) return console.log('No Active Question');
    req.db.collection('questions').findOne({ _id: ObjectId(cls.active_question) }, (err, question) => {
      if (err) return console.log('Database Error Getting Question');
      ws.send(JSON.stringify(questionDocToResponse(question)));
    });
  });

  const interval = setInterval(() => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  }, 10000);

  ws.on('close', () => clearInterval(interval));
  ws.on('pong', () => {
    ws.isAlive = true;
  });
});

module.exports = router;
