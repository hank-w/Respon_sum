// Parses the 'query' query parameter into req.searching.query, or null if there is no 'query' query paramter.


module.exports = () => (req, res, next) => {
  req.searching = {
    query: req.query.query || null
  };
  
  next();
};
