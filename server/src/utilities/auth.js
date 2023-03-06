const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {body, validationResult} = require('express-validator')

const jwt_secret = process.env.JWT_SECRET_KEY

const verifyPassword = async (password, hashedPassword) =>{
    try{
        return await bcrypt.compare(password, hashedPassword)
    }catch(err){
        throw err;
    }
}

const newToken = (user) =>{
    return jwt.sign({id: user.id}, jwt_secret, {expiresIn: '2d'});
}

const verifyToken = (token) =>{

}

exports.signup = [
    body('username').trim().isLength({min: 2, max: 25}).escape(),
    body('password').trim().isLength({min: 5, max: 50}).escape(),

    async (req, res, next) =>{
    const err = validationResult(body);
    if(!err.isEmpty()){
        return res.status(400).json({message: "Username or password is not in the right format"});
    }
    try {
        //Extract fields and check if user already exists
        const {username, password} = req.body;
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(409).json({message: `Username ${username} already exist`})
        }

        //Create user document and save to mongo
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password
        })
        user.save();

        //Create token
        const token = newToken(user);

        //Return token and fields of user object as response
        const updatedUser = user.toObject();
        delete updatedUser.password;
        
        return res.status(201).json({
            token,
            ...updatedUser
        })
    }catch(err){
        console.log(err);
        res.status(500);
        next(err);
    } 
}]

exports.signin = [
    body('username').trim().isLength({min: 2, max: 25}).escape(),
    body('password').trim().isLength({min: 5, max: 50}).escape(),

    async (req, res, next) =>{
        const err = validationResult(body);
        if(!err.isEmpty()){
            return res.status(400).json({message: "Username or password is not in the right format"});
        }
        const {username, password} = req.body;

        try {
            //Check if user exists in mongo
            const user = await User.findOne({username});            
            if(!user){
                return res.status(401).json({message: "Not authorized"});
            }

            const match = await verifyPassword(password, user.password);
            
            if(!match){
                return res.status(401).json({message: "Not authorized"});
            }
            //Create token
            const token = newToken(user);

            //Return token and fields of user object as response
            const updatedUser = user.toObject();
            delete updatedUser.password;
            
            return res.status(201).json({
                token,
                ...updatedUser
            })
        } catch(err){
            console.log(err);
            res.status(500);
            next(err);
        }
    }
]

exports.protect = async (req, res, next) =>{
    
}