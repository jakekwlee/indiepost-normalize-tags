const { normalize } = require('./src/service');

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await normalize(callback);
};
