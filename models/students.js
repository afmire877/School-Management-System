var mongoose = require('mongoose');



// Setting up Schema 
var studentSchema = new mongoose.Schema({
	firstName: String,
	middleName: String,
	lastName: String,
	year: Number,
	class: String,
	mobile: Number,
	email: String,
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
		Guardian : {
			name: String,
			phoneNumber: Number,
			relations: String,
		}
	},
	healthInfo: String,
	additionalInfo: String,
	previousSchool : String,
	attendance : {},
	fees : {},

});

// Model
var Student = mongoose.model('student', studentSchema);


module.exports = Student;