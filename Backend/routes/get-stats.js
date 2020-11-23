module.exports.statsDocToResponse = doc => ({
  numCorrect: doc.num_correct,
  numIncorrect: doc.num_incorrect,
  numUnresponded: doc.num_unresponded,
});
//Export Statistics to Separate Documents from Database
