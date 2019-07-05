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
	//Shirt and Trousers : 0
	{
		name : 'Shirt and Trousers',
		build : [40, 20, 50],			// scores for [slim, medium, heavy]
		complexion : [10, 30, 20],		// scores for [fair, tan, dark]
		timeOfDay : [01, 25, 10],		// scores for [morning, afternoon, night]
		occassion : [100, 20, 03, 15]		// scores for [office, outdoor, casual, party]
	},

	//Shirt and Pencil Skirt : 1
	{
		name : 'Shirt and Pencil Skirt',
		build : [60,40,20],
		complexion : [30,30,30],
		timeOfDay : [70,60,40],
		occassion : [100,10,05,15]
	},

	
	//Top and Jeans : 2
	{
		name : 'Top and Jeans',
		build : [90,80,70],
		complexion : [70,40,30],
		timeOfDay : [50,60,70],
		occassion : [04,80,70,30]
	},
	
	//Gown : 3
	{
		name : 'Gown',
		build : [40,50,70],
		complexion : [60,40,50],
		timeOfDay : [05,40,80],
		occassion : [10,30,03,70]
	},
	
	//Casual dress: 4
	{
		name : 'Casual Dress',
		build : [60,50,50],
		complexion : [60,70,60],
		timeOfDay : [30,40,80],
		occassion : [02,60,80,30]
	}

];

let colorDB = {
	fair : {
		morning   : ['olive', 'grass', 'apricot','lime','some shade of green','light pink'],
		afternoon : ['gray', 'amethyst','peach','rose  pink','rose red','pinkish brown','earth tones like brown'],
		night     : ['deep red','deep purple','raspberry pink','boysenberry','ivory','navy','emerald','turquoise','strawberry','rose red']
	},
	tan : {
		morning   : ['a Shade of green like olive','a Shade of green like lime','orange','pink'],
		afternoon : ['Soft red with hints of brown & rose','orange','pink','a Shade of green like grass'],
		night     : ['Bright red like cherry','Bright red like rose','Deep red like burgundy','a Shade of green like grass','a Shade of green like emerald']
	},
	dark : {
		morning   : ['a Shade of purple like plum','a Shade of purple like eggplant','Pastel pink','Ballerina pink','Poppy pink','Soft yellow'],
		afternoon : ['a Shade of purple like plum','a Shade of purple like eggplant','Pastel pink','Ballerina pink','Poppy pink','Soft yellow'],
		night     : ['a Shade of purple like royal purple','Rich bright yellow','Gold','Bronze','Copper','a Color in the orange or red family']
	}

};

/*
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
*/

module.exports.factorIndex = factorIndex;
module.exports.dressDB = dressDB;
module.exports.colorDB = colorDB;
