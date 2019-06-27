let factorIndex = [
	//fixed factors, i.e. physical charecteristics
	//complexion : 0
	{
		name 	  : 'complexion',
		fair      : 0,
		tan       : 1,
		dark      : 2
	},
	//build : 1
	{
		name 	  : 'build',
		slim      : 0,
		medium    : 1,
		heavy     : 2
	},
	//height is range based, so a separate function will be used

	//input factors
	//timeOfDay : 2
	{
		name 	  : 'timeOfDay',
		morning   : 0,
		afternoon : 1,
		night     : 2
	},
	//occassion : 3
	{
		name 	  : 'occassion',
		office    : 0,
		outdoor   : 1,
		casual    : 2,
		party     : 3
	},
];

let dressDB = [
	//scores out of 100
	//xyzSkirt : 0
	{
		name : 'xyzSkirt',
		build : [40, 20, 50],			// scores for [slim, medium, heavy]
		complexion : [10, 30, 20],		// scores for [fair, tan, dark]
		timeOfDay : [01, 25, 10],		// scores for [morning, afternoon, night]
		occassion : [100, 20, 03, 15]		// scores for [office, outdoor, casual, party]
	},

	//anotherDress : 1
	{
		name : 'anotherDress',
		build : [],
		complexion : [],
		timeOfDay : [],
		occassion : []
	}
];

module.exports.factorIndex = factorIndex;
module.exports.dressDB = dressDB;
