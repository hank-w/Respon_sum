module.exports.responseDocToResponse = doc => {
  let response = {
    id: doc._id,
    timestamp: doc.timestamp,
    studentId: doc.student,
    classId: doc['class'],
    questionId: doc.question,
    questionType: doc.question_type,
  };

  if (doc.hasOwnProperty('correct')) {
    response.correct = doc.correct;
  }
  if (doc.hasOwnProperty('answer_number')) {
    response.answerNumber = doc.answer_number;
  }
  if (doc.hasOwnProperty('answer_text')) {
    response.answerText = doc.answer_text;
  }

  return response;
};