const { connectToDatabase } = require('../shared/db');

exports.handler = async (event) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('letters');

    const { page = 1, limit = 10 } = event.queryStringParameters || {};
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Number(limit), 100);

    const [results, total] = await Promise.all([
      collection.find()
        .sort({ date: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .toArray(),
      collection.estimatedDocumentCount()
    ]);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        data: results,
        meta: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber)
        }
      }),
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};