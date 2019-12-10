const recorder = require('watchtower-recorder');

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');

const mock = {
    'aws-sdk' : aws,
};

module.exports.handler = recorder.createRecordingHandler('src/scrapQuotes.js', 'handler', mock, false, () => {}, true);
