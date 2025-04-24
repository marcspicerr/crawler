const { handler } = require('./crawler');

exports.handler = async () => {
  await handler();
  return { statusCode: 200, body: 'Crawl completed' };
};