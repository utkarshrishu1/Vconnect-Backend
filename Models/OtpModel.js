const mongoose = require('mongoose');
const verifyEmail = require('../sendMail/verifyEmail');
const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    otpFor: {
        type: String,
        require: true,
        trim: true,
        lowercase: true
    }
});
otpSchema.post("save", verifyEmail);
const Otp = mongoose.model("otp", otpSchema);
module.exports = Otp;