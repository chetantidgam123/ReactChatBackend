const asyncHandler = require('async-handler')
const generateToken = require('../config/generateToken,')
const User = require('../Models/userModel')
const registerUser = asyncHandler( async (req,res)=>{
    const {name,email,password,pic} = req.body
    if(!name || !email || !password){
        res.send(400)
        throw new Error("Please enter all the Feilds");
    }

    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400);
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })
     if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
     }else{
        res.status(401);
        throw new Error("Failed to Create User")
     }
     
})
const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    const user = await User.findOne({email})

    if(user && (await User.matchPassword(password))){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
     }else{
        res.status(401);
        throw new Error("Invalid Email or Password")
     }
})

module.exports = {registerUser,authUser}