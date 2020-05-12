const DEFAULT_ORDER = 'desc';
const VALID_ORDERS = ['desc', 'asc'];

// Parses order and orderBy query parameters. order is 'asc' or 'desc' (default) and
// orderBy is one of the orderByValues array; defaultOrderBy is the default.
// Populates req.ordering.order and req.ordering.orderBy.

module.exports = (orderByValues, defaultOrderBy) => (req, res, next) => {
  let order = VALID_ORDERS.includes(req.query.order) ? req.query.order : DEFAULT_ORDER;
  let orderBy = orderByValues.includes(req.query.orderBy) ? req.query.orderBy : defaultOrderBy;
  
  req.ordering = {
    order: order,
    orderBy: orderBy
  };
  
  next();
};
