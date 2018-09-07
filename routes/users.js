const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();

//Load User model
require('../models/User');
const User = mongoose.model('users');



//user login route
router.get('/login',(req,res) => {
    res.render('users/login', {
        title: "login"
    });
});


//user registration route
router.get('/register',(req,res) => {
    res.render('users/register', {
        title: 'register'
    });
});

// Login Form POST
router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true

    })(req,res,next)
});

// Register Form POST
router.post('/register', (req,res) => {
    let errors = [];
    if(req.body.password != req.body.password2){
        errors.push({text:'passwords do not match'});
    }

    if(req.body.password.length < 7){
        errors.push({text:'password must be more then 7 characters long'})
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }else{
        //create a new user object from the information received from the form
        User.findOne({email: req.body.email})
            .then ( user => {
                if(user){
                    req.flash('error_msg', 'Email alredy Registered');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
            
                    //need to hash the password before sending to db bcrypt
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user =>{
                                    req.flash('success_msg','You are now registered and can login');
                                    res.redirect('/users/login');
                                })
                                .catch(err =>{
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            })
        
    }

});

// Logout User
router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;