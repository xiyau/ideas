const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');


//DB Config
const db = require('./config/database');



//connect to our database
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));
  
//load the model
require('./models/Idea');
const Idea = mongoose.model('ideas');

const app = express();

//load idea routes
const ideas = require('./routes/ideas');

//load user routes
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);

//set the views directory
app.set('views', './views');

//setting the view engine
app.set('view engine', 'pug');

//setup bodyParser MiddleWare
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//method override middleware
app.use(methodOverride('_method'));


//setting up express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Authentication and session handling
app.use(passport.initialize());
app.use(passport.session());


//setting up flash middleware
app.use(flash());

//global variables middleware
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
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

// Use idea routes
app.use('/ideas', ideas);

// Use User routes
app.use('/users',users);





//basic webServer
const port = process.env.PORT || 5000;
app.listen(port, ( )=> {
    console.log(`server started on port ${port}`);
});