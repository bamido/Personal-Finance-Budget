const User = require("../models/userModel.js");
const brcypt = require('bcryptjs');
const transporter = require("../config/configTransporter.js");
const sendgrid = require("../config/configSendGrid.js");

module.exports = {
    index: (req, res)=>{

        res.render('default/index');
        
    },
    loginGet:(req, res)=>{
        res.render('auth/login', {layout: 'auth', pagetitle: 'Login'});
    },
    loginPost:(req, res)=>{
        res.render('auth/login', {layout: 'auth', pagetitle: 'Login'});
    },
    registerGet:(req, res)=>{
        res.render('auth/register', {layout: 'auth', pagetitle: 'Register'});
    },
    registerPost:(req, res)=>{
           

        let errors = [];
        if (!req.body.firstname) {
            errors.push("Firstname cannot be empty!");
            
        }

        if (!req.body.lastname) {
            errors.push("Lastname cannot be empty!");
            
        }
        
        if (!req.body.emailaddress) {
            errors.push("Email Address cannot be empty!");
            
        }

        if (req.body.password != req.body.confirmpassword) {
            errors.push("Passwords do not match!");
            
        }

        if(errors.length > 0){
            res.render('auth/register', {
                errors:errors,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                emailaddress: req.body.emailaddress,
                phonenumber: req.body.phonenumber,
                layout: 'auth', 
                pagetitle: 'Register'
            });
            return;
        }else{

            // check if email already taken
            User.findByEmail(req.body.emailaddress, (err, user) => {
                if(user){
                    req.flash('error-message', 'Email address already used. Try another one or proceed to login!');
                    //res.redirect('/login');
                    res.render('auth/register', {
                        errors:errors,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        emailaddress: req.body.emailaddress,
                        phonenumber: req.body.phonenumber,
                        layout: 'auth', 
                        pagetitle: 'Register'
                    });
                }
                else
                {

                

                    // Create a user
                    const user = new User({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        phonenumber: req.body.phonenumber,
                        emailaddress: req.body.emailaddress,
                        password: req.body.password,
                        role_id: 3,
                    });

                    // hash password
                    var newpassword = "";
                    brcypt.genSalt(10, (err, salt)=>{
                        brcypt.hash(req.body.password,salt, (err, hash) =>{
                            user.password = hash;
                            
                            // Save User in the database
                            User.create(user, (err, data) => {
                                if (err){
                                res.status(500).send({
                                    message:
                                    err.message || "Some error occurred while creating the User."
                                });

                                return;
                                
                                }else{
                                    // send mail
                                    let message = {
                                        from: "webmaster@akinbamido.com",
                                        to: user.emailaddress,
                                        bcc: "africpoet@gmail.com",
                                        subject: "Personal Finance Budgets (PFB) Registration",                                        
                                        html: `<h4>Hello ${user.firstname} ${user.lastname}, welcome to Personal Finance Budgets (PFB)</h4><p>Manage all your money with ease from one place with PFB.Track your income and expenses, analyze your financial habits and stick to your budgets.</p>`
                                    }

                                    /*transporter.sendMail(message, (err, info)=> {
                                        if (err) {
                                        console.log(err)
                                        } else {
                                        console.log(info);
                                        }
                                        
                                    });*/

                                    sendgrid.send(message).then((resp) => {
                                        console.log('Email sent\n', resp)
                                    }).catch((error) => {
                                        console.error(error)
                                    });

                                    req.flash('success-message', 'Account created successfully');
                                    res.redirect('/login'); //res.send(data);
                                }
                                
                            });
                        });
                    });

                }
            });

            
            
        }

        
    },
    logout: (req, res)=>{
        req.logout(function(err) {
            if (err) { return next(err); }
            req.flash('success-message', 'Successfully logout!');
            res.redirect('/login');
          });
    }


}