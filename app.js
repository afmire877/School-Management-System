var express = require('express'),
	app     = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');



// Setting up Mongodb Connection



app.get('/', function( req, res){
	res.send('Homepage')
})


//Listening for Port

app.listen(5000);
console.log('The Magic port is 5000');
