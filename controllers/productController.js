const {body, sanitizeBody} = require('express-validator');
const adminVerifyJwt = require('../middlewares/adminVerifyJwt.js');
const validateBody = require('../middlewares/validateBody');
const Product = require('../models/Product.js')


module.exports.addProduct = [
    body("sku")
        .isString()
        .isLength({ min: 1 })
        .trim().withMessage("SKU must be specified"),
    
    body("image")
        .isString()
        .isLength({min: 1}),
    
    body("productName")
    .isString()
    .isLength({ min: 1 })
    .trim().withMessage("Product-name must be specified"),

    body("price")
        .isString()
        .isLength({ min: 1 })
        .trim().withMessage("Price must be specified"),
    
    sanitizeBody('sku'),
    sanitizeBody('image'),
    sanitizeBody('productName'),
    sanitizeBody('price'),

    adminVerifyJwt,
    validateBody,

    async (req, res) => {
        try {
            const { sku, image, productName, price} = req.body

            const product = new Product(
                {   sku,
                    image,
                    productName,
                    price})

            await product.save()
            res.status(201).json({message : "Added product seccessfully", product})
        } catch (error) {
            res.status(500).json({error: "Internal server error"})
        }
    }
]

module.exports.findProduct = [
    (req, res) => {
        if(req.query.id){
            const id = req.query.id
            Product
                .findById(id)
                .then(data =>{
                    if(!data){
                        res.status(404).json({message: "Not found product with id" + id})
                    }else{
                        res.send(data)
                    }
                })
                .catch(error => {
                    res.status(500).json({error: "Erro retrieving product with id" + id})
                })
        }else{
            Product
            .find()
            .then(user => {res.send(user)})
            .catch(err => {res.status(500).send({message: err.message || "Err occured while retriving product information"})})
        }
    }
]

module.exports.updateProduct = [
    (req, res) => {
        if(!req.body){
            res.status(400).send({message: "Data to update can not be empty"})
        }
    
        const id = req.params.id
        Product
            .findByIdAndUpdate(id, req.body, {userFindAndModify: false} )
            .then(data =>{
                if(!data){
                    res.status(404).json({message: `Can not update product with ${id} maybe product not found`})
                }else{
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).json({message: err.message || "Erro update product information"})
            })
    }
]


module.exports.deleteProduct = [
    (req, res) => {
        const id = req.params.id

    Product
        .findByIdAndDelete(id)
        .then(data=>{
            if(!data){
                res.status(404).json({message: `Can not delete with id ${id} maybe id is wrong`})
            }else{
                res.send({message: "Product was deleted successfully"})
            }
        })
        .catch(err =>{
            res.status(500).json({message: "Could not delete product with id=" + id})
        })
    }
]
