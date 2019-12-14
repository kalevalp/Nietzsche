const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);
const debug = process.env.DEBUG_WATCHTOWER;

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const request = require('request');
const rp = require('request-promise');

let context, lambdaExecutionContext, lambdaInputEvent;
function updateContext(name, event, lambdaContext) { context = name; lambdaExecutionContext = lambdaContext; lambdaInputEvent = event; }

const twitConditions = [{ cond: () => true, 
                          opInSucc: (argumentsList) => (response) => eventPublisher({name: "PUBLISHED_TWEET", params: {quoteId: lambdaInputEvent.quoteId}}, lambdaExecutionContext)}]

const mock = {
    'aws-sdk' : aws,
    'request' : request,
    'request-promise' : rp,
    'twit' : recorder.createTwitMock(twitConditions),
};

module.exports.handler = recorder.createRecordingHandler('src/tweetQuoteText.js', 'handler', mock, false, updateContext, true);
