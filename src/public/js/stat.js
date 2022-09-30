var visitctx = document.getElementById('visitStats').getContext('2d');
var visitchart = new Chart(visitctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
						label: 'My First dataset',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: [0, 10, 5, 2, 20, 30, 45]
				}]
		},

		// Configuration options go here
		options: {}
});
var onlinectx = document.getElementById('onlineStats').getContext('2d');
var onlinechart = new Chart(onlinectx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
						label: 'My First dataset',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: [0, 10, 5, 2, 20, 30, 45]
				}]
		},

		// Configuration options go here
		options: {}
});
var msgctx = document.getElementById('msgStats').getContext('2d');
var msgchart = new Chart(msgctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
						label: 'My First dataset',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: [0, 10, 5, 2, 20, 30, 45]
				}]
		},

		// Configuration options go here
		options: {}
});
var roomctx = document.getElementById('roomStats').getContext('2d');
var roomchart = new Chart(roomctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
						label: 'My First dataset',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: [0, 10, 5, 2, 20, 30, 45]
				}]
		},

		// Configuration options go here
		options: {}
});