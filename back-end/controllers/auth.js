const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {signUpValidation, loginValidation , resetValidate} = require('./validation')
const dotenv = require('dotenv')
dotenv.config({silent:true})


const signUp = async (req,res)=>{
    const {error} = signUpValidation(req.body)

    if (error) return res.status(409).send({message:error.details[0].message});

    const emailExist = await User.findOne({email:req.body.email});

    if (emailExist) return res.status(400).send({message:"Email already exists"})

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    
    const wMessage = "Hi! " + req.body.name + ". Welcome Back! We hope you are having a good time on LinkedNYU!"

    const user = new User({
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        password:hashPassword,
        message: wMessage,
        profile :req.body.profile
    });


    try{
        const savedUser = await user.save();
        res.send(savedUser)
    }catch(err){
        res.status(400).send(err);
    }
}


const login = async (req,res)=>{
    const {error} = loginValidation (req.body)

    if (error) return res.status(409).json({message:error.details[0].message});

    const userFound = await User.findOne({email:req.body.email})

    if (!userFound) return res.status(409).json({message:"User not found"});

    const validPass = await bcrypt.compare(req.body.password,userFound.password)

    if (!validPass) return res.status(409).json({message:"Invalid Password"});


    const token = jwt.sign({_id:userFound._id},process.env.SECRET_TOKEN)


    res.status(200).json({token:token ,message:"Successfully Logged In!"})

}

const resetPassword = async (req,res) =>{
    const {error} = resetValidate(req.body)

    if (error) return res.status(400).send({message:error.details[0].message});

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.newPassword,salt);

    const userFound = await User.findOneAndUpdate({email:req.body.email},{password:hashPassword},{
        new:true
    });

    if (!userFound) return res.status(409).send({message:"User not found"});

    res.status(200).send({message:"Updated Successfully!"})


}


module.exports = {
    signUp,
    login,
    resetPassword
}
