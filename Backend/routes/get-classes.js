// queryFunc: req => query to be included in the find query
module.exports = function getCurrentOrPastClasses(queryFunc, isCurrent) {
  return (req, res) => {
    let query = queryFunc(req);
    query.active = isCurrent;
    
    req.db.collection('classes')
    .find(query)
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .toArray((err, docs) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      
      let responses = [];
      for (let doc of docs) {
        responses.push({
          id: doc._id,
          name: doc.name,
          active: doc.active,
          stats: {
            numCorrect: doc.aggregate_stats.num_correct,
            numIncorrect: doc.aggregate_stats.num_incorrect,
            numUnanswered: doc.aggregate_stats.num_unanswered,
          }
        });
      }
      
      res.status(200).json(responses);
    });
  };
}
