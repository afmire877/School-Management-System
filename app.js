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
		},
		// Guardian : {
		// 	name: String,
		// 	phoneNumber: Number
		// 	relations: String,
		// }
	},
	previousSchool : String,
	attendance : {},
	fees : {},

});

// Model
var Student = mongoose.model('student', studentSchema);



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

app.get('/students/all', function(req, res){
	res.send('All students apges')
	res.render('pages/students.ejs')
})

app.post("/student", function(req , res){
	var name = req.body.name;
	var year = req.body.year;
	var classname = req.body.classname;
	var gender = req.body.gender;
	var dateOfBirth = req.body.dateOfBirth;
	var neighborhood = req.body.neighborhood;
	var motherName = req.body.motherName;
	var fatherName = req.body.fatherName;
	var fatherNumber = req.body.fatherPhone;
	var motherNumber = req.body.motherPhone;
	var studentObj = { name: name, class : classname , gender :gender, dateOfBirth : dateOfBirth , neighborhood : neighborhood , parentInfo : {
		mother : {
			name: motherName,
			phoneNumber: motherNumber,
		},
		father : {
			name: fatherName,
			phoneNumber: fatherNumber,
		}
	} };
	Student.create(studentObj , function(err , student){
		if(err){
			console.log("Error");
			console.log(err);
		}else {
			console.log("It has been added")
			console.log(student);
		}
	});
	res.redirect("/");
});




//Listening for Port

app.listen(5000);
console.log('The Magic port is 5000');
