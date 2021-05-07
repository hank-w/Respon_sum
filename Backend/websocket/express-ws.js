module.exports.expressWs = null;
module.exports.setup = app => {
  module.exports.expressWs = require('express-ws')(app);
};
