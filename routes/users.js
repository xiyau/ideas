const express = require('express');
const router = express.Router();



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
        res.send('passed')
    }

});

module.exports = router;