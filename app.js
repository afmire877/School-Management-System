var express = require('express'),
	app     = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

//Serving Static Files
app.use(express.static('public'));

// Setting up Mongodb Connection
mongoose.connect("mongodb://localhost:27017/school-system");

// Setting up Schema 
var studentSchema = new mongoose.Schema({
	name: String,
	year: Number,
	class: String,
	gender: String,
	dateOfBirth: Number,
	neighborhood: String,
	parentInfo : {
		mother : {
			name: String,
			phoneNumber: Number
		},
		father : {
			name: String,
			phoneNumber: Number
		}
	},
	previousSchool : String,
	attendance : {},
	fees : {},

});

// Model
var Student = mongoose.model('student', studentSchema);

// Dummy Data


// Student.insert({
// 	name: "Jamac Siyaad",
// 	year: 8,
// 	class: "8A",
// 	gender: "female",
// 	dateOfBirth: 1998,
// 	neighborhood: "daame",
// 	parentInfo : {
// 		mother : {
// 			name: "xaawo",
// 			phoneNumber: 0633663937,
// 		},
// 		father : {
// 			name: "siyaad",
// 			phoneNumber: 0634265343
// 		}
// 	},
// 	previousSchool : "Gol Khaatumo",
// },function(err, student){
// 	if(err){
// 		console.log("Error");
// 		console.log(err);
// 	}else{
// 		console.log("It has been created");
// 		console.log(student);
// 	}
// })



// Routes 
app.get('/', function( req, res){
	Student.find({}, function(err, students){
		if(err){
			console.log(err)
		}else {
			console.log('found all')
			res.render( 'pages/dashboard' , {students: students})
		}
	});
});


//Create Route

app.get('/student/new', function(req, res){
	res.render('pages/new.ejs')
})

//Listening for Port

app.listen(5000);
console.log('The Magic port is 5000');
