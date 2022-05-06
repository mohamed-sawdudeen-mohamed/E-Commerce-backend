const express = require('express')
const adminRouter = require('./admin');
const productRouter = require('./product');


const apiRouter = express.Router();
apiRouter.use("/admin", adminRouter)
apiRouter.use("/products", productRouter)



module.exports = apiRouter;