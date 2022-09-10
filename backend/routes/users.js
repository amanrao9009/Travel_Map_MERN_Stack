const bcrypt = require('bcrypt');
// const { rawListeners } = require('../models/Pin');
const router = require("express").Router();
const User = require("../models/User");

// register

router.post("/register", async (req,res)=>{
    try{
        // generate new password

        const salt = await bcrypt.genSalt(10);// get salt 
        const hashedPassword = await bcrypt.hash(req.body.password, salt); // mix it wiht password

        // create new user

        const newUser = new User({ 
            username:req.body.username,
            email: req.body.email,
            password:hashedPassword,
        });

        // save user and send response
        const user = await newUser.save();
        res.status(200).json(user._id);

    }catch(err){
        console.log(err);
        res.status(500).json(err); 
    }
})

// login

router.post("/login", async (req,res)=>{ 
   try{
     //find user
     const user = await User.findOne({username:req.body.username});
    if( !user) { return res.status(400).json("wrong username/passwor");}


     // validate password
     const validPassword = await bcrypt.compare(
        req.body.password,user.password
        );

    if( !validPassword ){ return res.status(400).json("wrong username/passwor");}


     //send res
     res.status(200).json({_id:user._id , username:user.username});
   }catch(err){
    res.status(500).json(err)   
   }
})


module.exports = router;