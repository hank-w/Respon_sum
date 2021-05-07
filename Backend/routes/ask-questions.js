const { ObjectId } = require('mongodb');
const express = require('express');
const { questionDocToResponse } = require('./get-questions.js');
const { expressWs } = require('../websocket/express-ws.js');

const router = express.Router();

router.post('/:classId/questions/:questionId/ask', (req, res) => {
  req.db.collection('classes').findOne({ _id: ObjectId(req.params.classId) }, (err, doc) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!doc) return res.status(404).json({ msg: 'Class Not Found' });

    const previousQuestionID = doc.active_question;
    if (previousQuestionID != null && ObjectId(previousQuestionID) === ObjectId(req.params.questionId)) {
      return res.status(200).json({ msg: 'Question already active: no change' });
    }

    const timestamp = Date.now();

    if (previousQuestionID != null) {
      req.db.collection('questions').findOne({ _id: ObjectId(previousQuestionID) }, (err, previousQuestion) => {
        if (err) return console.log('Error finding previous question: ' + err + ', id = ' + previousQuestionID);
        if (!previousQuestion) return;
        req.db.collection('questions').updateOne({ _id: ObjectId(previousQuestionID) }, {
          $push: {
            timestamps: {
              started_timestamp: previousQuestion.last_started_timestamp,
              stopped_timestamp: timestamp,
            },
          }
        }, err => {
          if (err) return console.log('Error updating previous timestamp: ' + err + ', id = ' + previousQuestionID);
        });
      });
    }
    
    req.db.collection('questions').findOne({ _id: ObjectId(req.params.questionId) }, (err, question) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (!question) return res.status(404).json({ msg: 'Question Not Found' });

      req.db.collection('questions').updateOne({ _id: ObjectId(req.params.questionId) }, {
        $set: {
          last_started_timestamp: timestamp,
        },
        $inc: {
          asked: 1,
        },
      }, (err, result) => {
        if (err) return res.status(500).json({ msg: 'Database Error' });
        if (result.modifiedCount === 0) {
          return res.status(404).json({ msg: 'Question Not Found' });
        }

        req.db.collection('classes').updateOne({ _id: ObjectId(req.params.classId) }, {
          $set: {
            active_question: ObjectId(req.params.questionId),
          }
        }, (err, result) => {
          if (err) return res.status(500).json({ msg: 'Database Error' });
          if (result.modifiedCount === 0) {
            return res.status(404).json({ msg: 'Class Not Updated' });
          }

          expressWs.getWss().clients.forEach(client => {
            client.send(JSON.stringify(questionDocToResponse(question)));
          });
          res.status(200).json({ msg: 'OK' });
        });
      });
    });
  });
});

module.exports = router;
