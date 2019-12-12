/* ********************************************************************************
 *
 * Property:
 *   If a quote was tweeted, then that quote was previously scraped by the scraper.
 *   (rationale - in case someone injected an unwanted tweet to the database.)
 *
 * ******************************************************************************** */
const properties = [
    {
        name: 'genprop',
        quantifiedVariables: ['quoteId'],
        projections: [['quoteId']],
        stateMachine: {
            'PUBLISHED_TWEET': {
                params: [ 'quoteId' ],
                'INITIAL' : { to: 'FAILURE' },
            },
	    'SCRAPED_QUOTE': {
		params: [ 'quoteId' ],
		'INITIAL' : { to: 'scraped' },
	    },
        }
    },
];

module.exports = properties;
