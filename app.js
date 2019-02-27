const express        = require('express'),
	  flash          = require('connect-flash'),
	  methodOverride = require('method-override'),
	  app            = express(),
	  bodyParser     = require('body-parser'),
	  mongoose       = require('mongoose'),
	  Student        = require('./models/students'),
	  User           = require('./models/user-model.js'),
	  passport       = require('passport'),
	  LocalStrategy  = require('passport-local'),
	  morgan         = require('morgan'),
	  cookieParser   = require('cookie-parser'),
	  session        = require('express-session'),
	  multer         = require("multer"),
	  upload         = multer({dest: 'upload/'});

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
//Serving Static Files
app.use(express.static('public'));
app.use(express.static('upload'));

// Setting up Mongodb Connection
mongoose.connect("mongodb://ahmed:password1@ds255005.mlab.com:55005/heroku_sc1hqhrc", { useNewUrlParser: true });

// Setting Up passport
app.use(require('express-session')({
	secret: "Caasimada Online waa website ugu wacan soomalia",
	resave: false,
	saveUninitialized: false

}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res , next) {
	res.locals.currentUser = req.user; 
	next();
});

// app.use(function(req, res , next) {
// 	Student.distinct("class", function(err, classes){
// 		res.locals.classes = classes;
// 	})
// 	next();
// });

// INDEX Routes 
app.get('/', isLoggedIn, function( req, res){
	Student.find({}, function(err, data){
		res.render('pages/dashboard.ejs', {data : data});
	})
	
});

//Create Route

app.get('/student/new', isLoggedIn,  function(req, res){
	res.render('pages/new.ejs')
})

app.get('/student/all',isLoggedIn, function(req, res){
	
	Student.find({}, function(err, students){
		if(err){
			console.log(err)
		}else {
			console.log('found all')
			res.render('pages/students.ejs', {students : students})
		}
	});
})


// CREATE Route
app.post("/student",isLoggedIn, function(req , res){
	var firstName      = req.body.firstName,
		middleName     = req.body.middleName,
		lastName       = req.body.lastName,
		year           = req.body.year,
		classname      = req.body.classname,
		gender         = req.body.gender,
		mobile         = req.body.studentmobile,
		email          = req.body.studentemail,
		dateOfBirth    = req.body.dateOfBirth,
		neighborhood   = req.body.neighborhood,
		motherName     = req.body.motherName,
		fatherName     = req.body.fatherName,
		fatherNumber   = req.body.fatherPhone,
		motherNumber   = req.body.motherPhone,
		guardianName   = req.body.guardianName,
		guardianNumber = req.body.guardianPhone,
		relations      = req.body.relationship,
		previousSchool = req.body.previousSchool,
		additionalInfo = req.body.additionalInfo,
		healthInfo     = req.body.healthInfo,
		studentObj = { firstName: firstName, middleName: middleName, lastName: lastName, class : classname , gender :gender, dateOfBirth : dateOfBirth , neighborhood : neighborhood , 
			parentInfo : {
				mother : {
					name: motherName,
					phoneNumber: motherNumber,
				},
				father : {
					name: fatherName,
					phoneNumber: fatherNumber,
				},
				guardian : {
					name: guardianName,
					phoneNumber: guardianNumber,
					relations: relations,
				}
			},
			previousSchool: previousSchool,	healthInfo: healthInfo,
	additionalInfo: additionalInfo, mobile: mobile, email: email};
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

// SHOW Route

app.get('/student/:id',isLoggedIn, function(req , res){
  	Student.findOne({_id : req.params.id }, function(err, student){
		if(err){
			console.log(err)
		}
		else{
			res.render('pages/show.ejs', {student : student})
		}
	})

})

// Edit Route

app.get('/student/:id/edit' ,isLoggedIn, function(req, res){
	Student.findById(req.params.id, function(err, student){
		if(err){
			console.log(err);
		} else {
			res.render('pages/edit.ejs'  , {student : student})
		}
	})
});

// UPDATE ROUTE

app.put('/student/:id',isLoggedIn, function(req, res) {
	const { firstName, middleName } = req.body;

	// var firstName      = req.body.firstName,
	// 	middleName     = req.body.middleName,
	var lastName       = req.body.lastName,
		year           = req.body.year,
		classname      = req.body.classname,
		gender         = req.body.gender,
		mobile         = req.body.studentmobile,
		email          = req.body.studentemail,
		dateOfBirth    = req.body.dateOfBirth,
		neighborhood   = req.body.neighborhood,
		motherName     = req.body.motherName,
		fatherNumber   = req.body.fatherPhone,
		motherNumber   = req.body.motherPhone,
		guardianName   = req.body.guardianName,
		guardianNumber = req.body.guardianPhone,
		relations      = req.body.relationship,
		previousSchool = req.body.previousSchool,
		additionalInfo = req.body.additionalInfo,
		healthInfo     = req.body.healthInfo,
		studentObj     = { firstName: firstName, middleName: middleName, lastName: lastName, class : classname , gender :gender, dateOfBirth : dateOfBirth , neighborhood : neighborhood ,healthInfo: healthInfo,
	additionalInfo: additionalInfo, previousSchool: previousSchool, mobile : mobile, email: email,
		parentInfo : {
			mother : {
				name: motherName,
				phoneNumber: motherNumber,
			},
			father : {
				name: fatherName,
				phoneNumber: fatherNumber,
			},
			guardian : {
				name: guardianName,
				phoneNumber: guardianNumber,
				relations: relations,
			}
		}};
	Student.findOneAndUpdate(req.params.id, studentObj, function(err , updatedstudent){
		if(err){
			console.log(err)
		}else{
			console.log(updatedstudent)
			res.redirect('/student/all')
		}
	})
})


// DELETE Route 

app.delete('/student/:id',isLoggedIn, function(req,res){
	Student.findOneAndDelete(req.params.id , function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect('/student/all')
		}
	})
})

//==============
// Classes ROUTES
//==============


app.get('/class/:className', isLoggedIn, function(req, res){
	var className = req.params.className; 
	Student.find({ class: className}, function( err, foundStudents){
		if(err){
			console.log(err)
		}else{
			res.render('pages/students', {students : foundStudents})
		}
	})
})



//==============
// AUTH ROUTES
//==============

app.get('/register', function(req, res){
	res.render("pages/register")
});

app.post('/register', function(req, res){
	var newUser = new User({username: req.body.username, password: req.body.password});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err)
			return res.render('pages/register')
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/")
		})
	})
});

app.get('/login', (req , res) => {
	res.render('pages/login');
});

app.post('/login', passport.authenticate('local', 
	{ successRedirect: '/',failureRedirect: '/login', failureFlash: true }))


app.get('/logout', (req , res) => {
	req.logout();
	res.redirect('/')
})


function isLoggedIn(req, res , next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login')
};
//Listening for Port

app.listen(5000);
console.log('The Magic port is 5000');



// db.class12A.insertOne({
// 	firstName: "Jimcaalec",
// 	middleName: "tyny",
// 	lastName: "tywaan",
// 	year: "12",
// 	mobile: 1231697,
// 	email: "mireahmed@aigml.com",
// 	gender: "fenale",
// 	dateOfBirth: 1990,
// 	neighborhood: "France",
// 	parentInfo : {
// 		mother : {
// 			name: "Layla ",
// 			phoneNumber: 0634444444
// 		},
// 		father : {
// 			name: "Hadiid",
// 			phoneNumber: 2342342
// 		},
// 		guardian : {
// 			name: "Jimcaale",
// 			phoneNumber: 7832683,
// 			relations: "Dad",
// 		}
// 	},
// 	attendance : {},
// 	fees : {},
// });
// 	{
//         "parentInfo" : {
//                 "mother" : {
//                         "name" : "Saynab Xasan ",
//                         "phoneNumber" : 633663838
//                 },
//                 "father" : {
//                         "phoneNumber" : 314252523432
//                 },
//                 "guardian" : {
//                         "name" : "Jamac ",
//                         "phoneNumber" : 893942894,
//                         "relations" : "uncle"
//                 }
//         },
//         "firstName" : "Ahmed",
//         "middleName" : "fuad ",
//         "lastName" : "Mire",
//         "class" : "12",
//         "gender" : "Male",
//         "dateOfBirth" : 1998,
//         "neighborhood" : "Telesom",
//         "previousSchool" : "Darul ULoom",
//         "mobile" : 7490651935,
//         "email" : "afmire877@gmail.com",
//         "__v" : 0
// }


// db.attendance.insertOne({ studentId: ObjectId("5c4eb83d90483499a6b96e97") , 
// 	year:2017, 
// 	monthStart: "August",
// 	biology: {
 
// 		attendance: [
// 		{
// 			month: "January", 
// 			days:[1,-1,0,1,1,1,1,1,1,1,1,1,1]
// 		},
// 		{
// 			month: "Feb", days:[1,-1,0,1,1,1,1,1,1,1,1,1,1]
// 		},
// 		{
// 			month: "march", days:[1,-1,0,1,1,1,1,1,1,1,1,1,1]
// 		}

// 		]
// 	}
// 	})