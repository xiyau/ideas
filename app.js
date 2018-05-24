const express = require('express');
const mongoose = require('mongoose');



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


//basic webServer
const port = 5000;
app.listen(port, ( )=> {
    console.log(`server started on port ${port}`);
});