const { statsDocToResponse } = require('./get-stats.js');

module.exports.questionDocToResponse = doc => {
  const response = {
    id: doc._id,
    asked: doc.asked,
    timestamps: doc.timestamps.map(({ started_timestamp, stopped_timestamp }) => ({
      started: started_timestamp,
      stopped: stopped_timestamp,
    })),
    stats: doc.stats.map(statsDocToResponse),
    type: doc.type,
  };

  if (doc.question_text !== undefined) {
    response.questionText = doc.question_text;
  } 
  if (doc.correct_answer !== undefined) {
    response.correctAnswer = doc.correct_answer;
  }

  if (doc.type === 'multiple-choice') {
    response.numAnswers = doc.num_answers;
    if (doc.answer_texts !== undefined) {
      response.answerTexts = doc.answer_texts;
    }
  }

  return response;
};