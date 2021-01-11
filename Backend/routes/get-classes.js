module.exports.classDocToResponse = function classDocToResponse(doc) {
  return {
    id: doc._id,
    name: doc.name,
    active: doc.active,
    institution: doc.institution,
    stats: {
      numCorrect: doc.aggregate_stats.num_correct,
      numIncorrect: doc.aggregate_stats.num_incorrect,
      numUnanswered: doc.aggregate_stats.num_unanswered,
    }
  };
}

// queryFunc: req => query to be included in the find query
module.exports.getCurrentOrPastClasses = (queryFunc, isCurrent) => (req, res) => {
  let query = queryFunc(req);
  query.active = isCurrent;
  
  req.db.collection('classes')
  .find(query)
  .skip(req.pagination.skip)
  .limit(req.pagination.limit)
  .toArray((err, docs) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    res.status(200).json(docs.map(module.exports.classDocToResponse));
  });
};
