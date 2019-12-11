const recorder = require('watchtower-recorder');

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const request = require('request');
const rp = require('request-promise');

const mock = {
    'aws-sdk' : aws,
    'request' : request,
    'request-promise' : rp,
};

module.exports.handler = recorder.createRecordingHandler('src/tweetQuoteImage.js', 'handler', mock, false, () => {}, true);
