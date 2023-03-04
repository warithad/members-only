const Message = require('../models/message')
const {body, validationResult} = require('express-validator')

exports.messages_list_get = (req, res, next) => {
    Message.find({})
           .sort({date: 'desc'})
           .populate('author', '-password')
           .limit(10)
           .exec((err, messages_list) => {
                if(err){
                    return next(err);
                }
                return res.status(200).json({messages_list})
           })
}

exports.message_create_post = [
    body('title').trim().isLength({min: 1, max: 30}).escape(),
    body('content').trim().isLength({min: 1, max: 100}).escape(),
    (req, res, next) =>{ 
        const err = validationResult(body);
        const mess = new Message({
                     title: req.body.title,
                     author: req.body.author,
                     content: req.body.content
        })
    if(!err.isEmpty()){
        return res.status(404).json({err: err.array()})
    }
    mess.save(err =>{
        if(err){
            return next(err);
        }
        return res.status(200);
    })
    }
]

exports.message_delete = (req, res, next) =>{
    Message.deleteOne({_id: req.body._id}).then(function(){
        return res.status(200).json({message: 'Deletion successful'});
    }).catch(function(err){
        return next(err);
    })
}