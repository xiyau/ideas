const express = require('express');
const router = express.Router();



//user login route
router.get('/login',(req,res) =>{
    res.render('users/login',{
        title: "login"
    });
});


//user registration route
router.get('/register',(req,res) =>{
    res.render('users/register',{
        title: 'register'
    });
});



module.exports = router;