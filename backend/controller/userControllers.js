const asyncHandler = require('async-handler')
const generateToken = require('../config/generateToken,')
const User = require('../Models/userModel')
const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        res.send(400)
        throw new Error("Please enter all the Feilds");
    }

    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400);
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(401);
        res.send({
            code: 401,
            message: "Failed to Create User"
        })
    }

}
const authUser = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            code: 200,
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.send({
            code: 401,
            message: "Invalid Email or Password"
        })
    }
}
// /api/user 
const allUser = async (req, res) => {
    const keyWord = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    const user = await User.find(keyWord).find({ _id: { $ne: req.user._id } });
    if (user.length > 0) {
        res.send(
            {
                user: user,
                code: 200
            }
        )
    } else {
        res.send(
            {
                user: [],
                code: 400,
                message: "No Chat Available"
            }
        )
    }
}

module.exports = { registerUser, authUser, allUser }