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
