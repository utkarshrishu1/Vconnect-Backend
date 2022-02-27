const User = require("./Models/UserModel");
const jwt = require("jsonwebtoken");
const isAuth = async (req, res, next) => {
    const token = req.header("Autherization").replace("Bearer ", "");
    if (!token) {
        res.status(401).send({ error: "No user found!" });
    }
    else {
        const decoded = jwt.verify(token, process.env.TOKEN_CODE);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token })
        if (!user) {
            res.status(400).send({ error: "No user found!" });
        }
        else {
            req.user = user;
            req.token = token;
            next();
        }
    }
}
module.exports = isAuth;