module.exports.studentDocToResponse = function studentDocToResponse(doc) {
  return {
    id: doc._id,
    name: doc.name,
    email: doc.email,
    studentNumber: doc.student_number,
    institution: doc.institution,
    performance: {
      numCorrect: doc.num_correct,
      numIncorrect: doc.num_correct,
      numUnresponded: doc.num_unresponded,
    },
  };
};
