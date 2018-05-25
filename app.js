const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');




//connect to our database
mongoose.connect('mongodb://localhost/ideas')
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

//load the model
require('./models/Idea');
const Idea = mongoose.model('ideas');

const app = express();

//set the views directory
app.set('views', './views');

//setting the view engine
app.set('view engine', 'pug');

//setup bodyParser MiddleWare
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'));


//setting up express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//setting up flash middleware
app.use(flash());

//global variables middleware
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//testing middle ware stuff
// app.use(function(req,res,next){
//     console.log(Date.now());
// });

//basic routes
//index route
app.get('/', (req,res) => {
    res.render('index', {
        title: 'GOT AN IDEA!!!'
    });
});

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About'
    });
});

//Idea index page
app.get('/ideas', (req, res) => {

    Idea.find({})
        .sort({date:'desc'})
        .then(idea => {
            res.render('ideas/index',{
            idea:idea
        });
    });
   
});

//Add Idea form

app.get('/ideas/add', (req,res) => {

    res.render('ideas/add');
});

//Edit idea form
app.get('/ideas/edit/:id',(req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit',{
            idea
        });
    });
    
});

//Process form

app.post('/ideas', (req,res) => {
    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title'})
    }
    if(!req.body.details){
        errors.push({text:'please add a text'})
    }

    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else {
        var newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas')
            })
    }

});

// Edit Form Process
// first put request
app.put('/ideas/:id', (req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea =>{
            res.redirect('/ideas');
        });
    });
});


//Delete Idea
app.delete('/ideas/:id', (req,res) =>{
    Idea.remove({_id: req.params.id})
        .then(()=>{
            res.redirect('/ideas');
        });
});



//basic webServer
const port = 5000;
app.listen(port, ( )=> {
    console.log(`server started on port ${port}`);
});