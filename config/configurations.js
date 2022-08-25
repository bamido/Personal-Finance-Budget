const flash = require("connect-flash");
require('dotenv').config();

module.exports = {
    HOST: process.env.DB_HOST,
    USER:  process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DATABASE,
    DB_PORT: process.env.DB_PORT,
    globalVariables: (req, res, next)=>{
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        res.locals.app_name = 'Personal Finance Budget';
        res.locals.app_short_name = 'PFB';
        res.locals.app_logo = 'logo.png',
        res.locals.app_favicon = 'favicon.ico',
        res.locals.user = req.user;
        
        next();
    }
};