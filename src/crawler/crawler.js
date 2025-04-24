const { CheerioCrawler, RequestQueue } = require('crawlee');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const { connectToDatabase } = require('../shared/db')

dotenv.config();

const DB_NAME = 'osha';
const COLLECTION_NAME = 'letters';

async function handler() {
  const db = connectToDatabase.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const requestQueue = await RequestQueue.open();
  const crawler = new CheerioCrawler({
    requestQueue,
    async requestHandler({ $, request, enqueueLinks }) {
      if (request.userData.isListingPage) {
        await enqueueLinks({
          selector: '.pagination-next a',
          transformRequestFunction(req) {
            req.userData = { isListingPage: true };
            return req;
          }
        });


        const letters = [];
        $('.view-content li').each((i, el) => {
          const $li = $(el);
          const link = $li.find('a');
          const rawDate = $li.find('strong').text().trim();

          letters.push({
            date: new Date(rawDate),
            title: link.attr('title') || link.text().trim(),
            url: new URL(link.attr('href'), request.url).href,
            regulation: link.text().match(/\[(.*?)\]/)?.[1] || '',
            year: new Date(rawDate).getFullYear()
          });
        });

        if (letters.length > 0) {
          const bulkOps = letters.map(letter => ({
            updateOne: {
              filter: { url: letter.url },
              update: { $setOnInsert: letter },
              upsert: true
            }
          }));
          await collection.bulkWrite(bulkOps);
          console.log(`Saved ${letters.length} letters from ${request.url}`);
        }


        await enqueueLinks({
          selector: 'a[href*="/laws-regs/standardinterpretations/publicationdate/"]',
          regexps: [/\/laws-regs\/standardinterpretations\/publicationdate\/\d{4}\/?$/],
          transformRequestFunction(req) {
            req.userData = { isListingPage: true };
            return req;
          }
        });
      }
    },
    maxConcurrency: 5,
    maxRequestsPerCrawl: 20000
  });

  await crawler.addRequests([{
    url: 'https://www.osha.gov/laws-regs/standardinterpretations/publicationdate',
    userData: { isListingPage: true }
  }]);

  await crawler.run();
  await client.close();
}

if (require.main === module) {
  handler().catch(console.error);
}

module.exports = { handler };