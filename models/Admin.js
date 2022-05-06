const mongoose = require('mongoose')


const adminSchema = new mongoose.Schema({
    firstName: {type : String, required: true},
    lastName: {type: String},
	email: {type: String, unique: true, required: true},
    userName: {type: String, required: true},
	password: {type: String, required: true},
	address: {type: String},
    contactNumber : {type: Number}
	
})


module.exports = mongoose.model("Admin", adminSchema)