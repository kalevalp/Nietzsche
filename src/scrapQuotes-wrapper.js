const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const batchEventPublisher = recorder.createBatchEventPublisher(eventsStreamName);
const debug = process.env.DEBUG_WATCHTOWER;

// Unfortunately, need to recreate the id hashing logic from the code.
// This type of dependence seems to be unavoidable at times.
const crypto = require('crypto')
const md5 = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const rp = require('request-promise');
const cheerio = require('cheerio');

const gru = require('./utils/goodreads')

let context, lambdaExecutionContext, lambdaInputEvent;
function updateContext(name, event, lambdaContext) { context = name; lambdaExecutionContext = lambdaContext; lambdaInputEvent = event; }

const mock = {
    'aws-sdk' : aws,
    'request-promise': rp,
    'cheerio': cheerio,
    './utils/goodreads': {
        fetchQuotes: (...args) => {
            gru.fetchQuotes(...args)
                .then(quotes => {
                    const logEvents = quotes.map(quote => ({name: "SCRAPED_QUOTE", params: {quoteID: md5(`${quote.author}-${quote.text}`)}}));
                    batchEventPublisher(logEvents,lambdaExecutionContext);
                })
        },
    }
};

module.exports.handler = recorder.createRecordingHandler('src/scrapQuotes.js', 'handler', mock, false, updateContext, true);
