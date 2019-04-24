const AWS = require('aws-sdk')

const { failure } = require('./utils/responses')
const { fetchQuotes } = require('./utils/goodreads')

const sqs = new AWS.SQS()

function chunk(arr, n) {
  return arr.reduce((p, cur, i) => {
    (p[i / n | 0] = p[i / n | 0] || []).push(cur)
    return p
  }, [])
}

module.exports.scrapQuotes = (event, context, callback) => {
  const { SQS_URL } = process.env
  const { Subject } = event.Records[0].Sns
  fetchQuotes(Subject)
    .then(quotes => {
      console.log(`Fetched ${quotes.length} quotes.`)
      const chunks = chunk(quotes, 10) // SQS batch max size is 10
      Promise
        .all(chunks.map(chunk => new Promise((resolve, reject) => {
          const params = {
            Entries: chunk.map((quote, idx) => ({
              Id: idx.toString(),
              MessageBody: JSON.stringify(quote)
            })),
            QueueUrl: SQS_URL
          }
          sqs.sendMessageBatch(params, resolve)
        })))
        .then(event.done)
        .catch(err => failure(JSON.stringify(err, null, 2)))
    })
    .catch(err => failure(JSON.stringify(err, null, 2)))
}
