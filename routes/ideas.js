const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//load the model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea index page
router.get('/', (req, res) => {
    
        Idea.find({})
            .sort({date:'desc'})
            .then(idea => {
                res.render('ideas/index',{
                idea:idea
            });
        });
       
    });
//Add Idea form

router.get('/add', (req,res) => {
    
        res.render('ideas/add');
    });
    
    //Edit idea form
    router.get('/edit/:id',(req,res) => {
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
                details: req.body.details
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