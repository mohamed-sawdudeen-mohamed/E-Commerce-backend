const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    
    try {
        const token = req.headers.authorization
        const data = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        req.authData = data;
        next()

    } catch (ex) {
        res.status(401). json({err : "Admin not authenticated"})
    }
    
}