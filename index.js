const { normalize } = require('./src/service');

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return normalize(callback);
};
