const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // decode Token id 
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decode.id).select("-password");
            next();
        } catch (error) {
            res.status(401).send("Not Authorized ,token failed");

        }
    }
    if (!token) {
        res.status(401).send("Not Authorized,no token");
    }
}
module.exports = { protect }
