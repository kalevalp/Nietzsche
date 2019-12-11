const recorder = require('watchtower-recorder');

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const rp = require('request-promise');
const cheerio = require('cheerio');
const mock = {
    'aws-sdk' : aws,
    'request-promise': rp,
    'cheerio': cheerio,
};

module.exports.handler = recorder.createRecordingHandler('src/scrapQuotes.js', 'handler', mock, false, () => {}, true);
