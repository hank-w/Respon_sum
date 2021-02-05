const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

// Parses offset, limit query parameters. Adds req.pagination.skip and req.pagination.limit
module.exports = () => (req, res, next) => {
  let offset = (typeof req.query.offset === 'string')
    ? parseInt(req.query.offset, 10) || DEFAULT_OFFSET : DEFAULT_OFFSET;
  let limit = (typeof req.query.limit === 'string')
    ? parseInt(req.query.limit, 10) || DEFAULT_LIMIT : DEFAULT_LIMIT;
  
  req.pagination = {
    skip: offset,
    limit: limit,
  };
  
  next();
};
