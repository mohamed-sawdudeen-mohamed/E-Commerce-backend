const { oneOf, body, sanitizeBody } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateBody = require('../middlewares/validateBody');
const Admin = require("../models/Admin.js");


module.exports.register = [
    body("firstName")
        .isString(),

    body("lastName")
        .isString(),

    body("email")
        .isLength({ min: 1 })
        .trim().withMessage("Email or user name must be specified.")
        .isEmail().withMessage("Email must be a valid email address.")
        .normalizeEmail({ gmail_remove_dots: false }),

    body("userName")
        .isLength({ min: 1 })
        .trim().withMessage("Email or userName must be specified"),

    body("password")
        .isLength({ min: 1 })
        .trim().withMessage("Password must be specified."),

    body("address")
        .isString()
        .optional(),
        
    body("contactNumber")
        .isString()
        .optional(),


    sanitizeBody("firstName").escape(),
    sanitizeBody("lasttName").escape(),
    sanitizeBody("email").escape(),
    sanitizeBody("userName").escape(),
    sanitizeBody("password").escape(),
    sanitizeBody("address").escape(),
    sanitizeBody("contactNumber").escape(),

    validateBody,

    async(req, res) => {
        try {
            const encryptedPass = await bcrypt.hash(req.body.password, parseInt(process.env.SALT) )
            const admin = new Admin({...req.body, password: encryptedPass});
            await admin.save()
            res.status(201).json({message: "Admin created successfully", admin})
        } catch (error) {
            console.log(error)
            res.status(500).json({error : "Internal server error"})
        }
    }
    
]




module.exports.login = [
    oneOf([
		body("email")
            .isLength({ min: 1 })
            .trim().withMessage("Email or user Name must be specified.")
			.isEmail().withMessage("Email must be a valid email address.")
            .normalizeEmail({ gmail_remove_dots: false }),

		body("userName")
            .isLength({ min: 1 })
            .trim().withMessage("Email or user name must be specified")
	]),

    body("password")
        .isLength({ min: 1 })
        .trim().withMessage("Password must be specified."),
    
    sanitizeBody("userName").escape(),
    sanitizeBody("email").escape(),
    sanitizeBody("password").escape(),

    validateBody,

    async (req, res) => {
        try {
            const {userName, email } = req.body
            
            const admins = await Admin.find({$or:[{userName}, {email}]})

            if(admins.length !== 1){
                res.status(400).json({error : "Invalid user"})
                return;
            }
            const admin = admins[0];

            const isVerified = await bcrypt.compare(req.body.password, admin.password);
            if(!isVerified){
                res.status(401).json({error: "Incorrect Password"})
                return;      
            }
            const {_id,firstName, lastName} = admin;
            const token = jwt.sign({_id, firstName, lastName, email}, process.env.ADMIN_JWT_SECRET)
            res.status(200).json({token})
                              

        } catch (error) {
            res.status(500).json({error : "Internal server error"});
        }
    }
]
