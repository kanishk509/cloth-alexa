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
		name : 'Shirt',
		build : [40, 20, 50],			// scores for [slim, medium, heavy]
		complexion : [10, 30, 20],		// scores for [fair, tan, dark]
		timeOfDay : [01, 25, 10],		// scores for [morning, afternoon, night]
		occassion : [100, 20, 03, 15]		// scores for [office, outdoor, casual, party]
	},

	//anotherDress : 1
	{
		name : 'Pencil Skirt',
		build : [60,40,20],
		complexion : [30,30,30],
		timeOfDay : [70,60,40],
		occassion : [100,10,05,15]
	},
	
	{
		name : 'Trousers',
		build : [50,60,50],
		complexion : [30,30,30],
		timeOfDay : [40,60,90],
		occassion : [100,10,05,15]
	},
	
	{
		name : 'Top',
		build : [90,80,70],
		complexion : [70,40,30],
		timeOfDay : [50,60,70],
		occassion : [04,80,70,30]
	},
	
	{
		name : 'Gown',
		build : [40,50,70],
		complexion : [60,40,50],
		timeOfDay : [05,40,80],
		occassion : [10,30,03,70]
	},
	
	{
		name : 'Jeans',
		build : [30,40,50],
		complexion : [50,50,50],
		timeOfDay : [60,50,80],
		occassion : [20,60,80,30]
	},
	
	
];

let colorDB = [
	//index : 0
	{
		name : 'black',
		complexion : {
			fair      : 80,
			tan       : 50,
			dark      : 30
		},
		timeOfDay : {
			morning   : 20,
			afternoon : 30,
			night     : 90
		},
		build : {
			slim	:70,
			medium	:60,
			heavy	:90
		}
		
	},
	//index : 1
	{
		name : 'white',
		complexion : {
			fair      : 42,
			tan       : 52,
			dark      : 32
		},
		timeOfDay : {
			morning   : 22,
			afternoon : 32,
			night     : 92
		},
		build : {
			slim	:90,
			medium	:60,
			heavy	:30
		}
	},
	//index : 2
	{
		name : 'yellow',
		complexion : {
			fair      : 81,
			tan       : 51,
			dark      : 31
		},
		timeOfDay : {
			morning   : 21,
			afternoon : 31,
			night     : 91
		}
	}
];

module.exports.factorIndex = factorIndex;
module.exports.dressDB = dressDB;
module.exports.colorDB = colorDB;
