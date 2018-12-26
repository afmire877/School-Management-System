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
	  session        = require('express-session');

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
//Serving Static Files
app.use(express.static('public'));

// Setting up Mongodb Connection
mongoose.connect("mongodb://localhost:27017/school-system", { useNewUrlParser: true });

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



// INDEX Routes 
app.get('/', isLoggedIn, function( req, res){
	console.log(req.user);
	res.render('pages/dashboard.ejs');
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

// SHOW Route

app.get('/student/:id',isLoggedIn, function(req , res){
	Student.findById(req.params.id, function(err, student){
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
	var name = req.body.name,
		year = req.body.year,
		classname = req.body.classname,
		gender = req.body.gender,
		dateOfBirth = req.body.dateOfBirth,
		neighborhood = req.body.neighborhood,
		motherName = req.body.motherName,
		fatherName = req.body.fatherName,
		fatherNumber = req.body.fatherPhone,
		motherNumber = req.body.motherPhone,
		studentObj = { name: name, class : classname , gender :gender, dateOfBirth : dateOfBirth , neighborhood : neighborhood , parentInfo : {
		mother : {
			name: motherName,
			phoneNumber: motherNumber,
		},
		father : {
			name: fatherName,
			phoneNumber: fatherNumber,
		}
	} };
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
