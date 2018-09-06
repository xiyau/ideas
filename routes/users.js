const express = require('express');
const router = express.Router();



//user login route
router.get('/login',(req,res) =>{
    res.send('login');
});


//user registration route
router.get('/register',(req,res) =>{
    res.send('register');
});



module.exports = router;