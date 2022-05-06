const express = require('express')
const productController = require('../controllers/productController')

const productRouter = express.Router()


productRouter.post('/', productController.addProduct)
productRouter.get('/', productController.findProduct)
productRouter.put('/:id', productController.updateProduct)
productRouter.delete('/:id', productController.deleteProduct)




module.exports = productRouter;