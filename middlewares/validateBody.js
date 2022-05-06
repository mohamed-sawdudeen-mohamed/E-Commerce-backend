const {validationResult} = require("express-validator");

module.exports = (req, res, next) => {
    try {
        const validationErrors = validationResult(req);
    if(validationErrors.isEmpty()){
        next();
    }else{
        res.status(400).json({
            errors : validationErrors.mapped()
        })
    }
    } catch (ex) {
        res.status(500).json({error : "Internal server error"})
    }
}