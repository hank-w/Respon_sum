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

router.ws('/questions', ws => {
  ws.send(JSON.stringify(testQuestion));

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
