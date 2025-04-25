const { MongoClient } = require('mongodb');
require('dotenv').config();


let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    socketTimeoutMS: 5000,
  });

  cachedDb = client.db();
  return cachedDb;
}

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
