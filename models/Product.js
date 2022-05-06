const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    sku: {type : String, required: true},
    image: {type: String},
	productName: {type: String, required: true},
    price: {type: String, required: true},
	
	
})


module.exports = mongoose.model("Product", productSchema)