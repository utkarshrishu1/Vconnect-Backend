const mongoose = require('mongoose');
const validator = require('validator');
const encryptPassword = require('../bcrypt/encrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter a valid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});
userSchema.pre("save", encryptPassword);
const User = mongoose.model("users", userSchema);
module.exports = User;