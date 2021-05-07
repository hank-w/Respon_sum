const express = require('express');

const router = express.Router();

const QUESTION_PROTOCOL = 'questions-streaming';

const testQuestion = {
  type: 'multiple-choice',
  numAnswers: 3,
  correctAnswer: 3,
  questionText: 'Which will last the longest?',
  answerText: ['GME > $420.69', 'lockdown', 'shutdown']
};

router.ws('/questions', (ws, req) => {
  ws.send(JSON.stringify(testQuestion));
});

module.exports = router;
