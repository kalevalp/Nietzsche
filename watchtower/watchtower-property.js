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
        quantifiedVariables: ['target_uuid'],
        projections: [['target_uuid']],
        stateMachine: {
            'ADDED_TARGET': {
                params: [ 'target_uuid' ],
                'INITIAL' : { to: 'has_target' },
            },
	    'REMOVED_TARGET': {
		params: [ 'target_uuid' ],
		'has_target' : { to: 'INITIAL' },
	    },
	    'CHECKED_TARGET': {
		params: [ 'target_uuid' ],
		'INITIAL' : { to: 'FAILURE' },
	    },
        }
    },
];

module.exports = properties;
