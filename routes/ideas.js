const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth')


//load the model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea index page
router.get('/',ensureAuthenticated, (req, res) => {
    
        Idea.find({user: req.user.id})
            .sort({date:'desc'})
            .then(idea => {
                res.render('ideas/index',{
                idea:idea
            });
        });
       
    });
//Add Idea form

router.get('/add',ensureAuthenticated, (req,res) => {
    
        res.render('ideas/add');
    });
    
    //Edit idea form
    router.get('/edit/:id',(req,res) => {
        Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            if(idea.user != req.user.id){
                req.flash('error_msg','Not Authorized');
                res.redirect('/ideas');
            }else{
                res.render('ideas/edit',{
                    idea
                });
            }
            
        });
        
    });
    
    //Process form
    
    router.post('/', (req,res) => {
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
                details: req.body.details,
                user: req.user.id
            }
            new Idea(newUser)
                .save()
                .then(idea => {
                    req.flash('success_msg', 'idea Added');
                    res.redirect('/ideas')
                })
        }
    
    });
    
    // Edit Form Process
    // first put request
    router.put('/:id', (req,res) => {
        Idea.findOne({
            _id: req.params.id
        })
        .then(idea =>{
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;
    
            idea.save()
            .then(idea =>{
                req.flash('success_msg', 'idea updated');
                res.redirect('/ideas');
            });
        });
    });
    
    
    //Delete Idea
    router.delete('/:id', (req,res) =>{
        Idea.remove({_id: req.params.id})
            .then(()=>{
                req.flash('success_msg', 'idea removed');
                res.redirect('/ideas');
            });
    });
    

module.exports = router;