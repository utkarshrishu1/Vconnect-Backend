const express = require('express');
const router = express.Router();
const User = require('../Models/UserModel');
const Otp = require('../Models/OtpModel');
const userCreatedMail = require("../sendMail/userCreatedMail");
router.post('/signupotp', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(409).send({ error: "Email already Exist!" });
    }
    else {
        const createdotp = Math.floor(10000 + Math.random() * 90000);
        const findOtp = await Otp.findOne({ email: req.body.email });
        if (findOtp) {
            await Otp.deleteOne({ email: req.body.email });
        }
        const otp = new Otp({ otp: createdotp, email: req.body.email, otpFor: "signup" });
        await otp.save();
        res.status(200).send(otp);
    }
});
router.post('/verifyotp', async (req, res) => {
    const otp = await Otp.findOne({ email: req.body.email });
    if (!otp) {
        res.status(400).send({ error: "Otp Not found!" });
    }
    else {
        if (otp.otp === req.body.otp) {
            const user = new User(req.body.user);
            await user.save();
            await userCreatedMail(user);
            await Otp.deleteOne({ email: req.body.email });
            res.status(200).send(otp);
        }
        else {
            res.status(406).send({ error: "Wrong Otp!" });
        }
    }
});
router.post("/forgotpasswordotp", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404).send({ error: "Email do not exist!" });
    }
    else {
        const existOtp = await Otp.findOne({ email: req.body.email, otpFor: "password" });
        if (existOtp)
            await Otp.deleteOne({ email: req.body.email, otpFor: "password" });
        const generateOtp = Math.floor(10000 + Math.random() * 90000);
        const otp = new Otp({ otp: generateOtp, email: req.body.email, otpFor: "password" });
        await otp.save();
        res.status(200).send({});
    }
});
router.post("/forgotpasswordotpverify", async (req, res) => {
    const otp = await Otp.findOne({ email: req.body.email, otpFor: "password" });
    if (!otp) {
        res.status(400).send({ error: "Otp Not Found!" });
    }
    else {
        if (otp.otp === req.body.otp) {
            await Otp.deleteOne(otp);
            res.status(200).send({});
        }
        else {
            res.status(406).send({ error: "Wrong Otp!" });
        }
    }

});
module.exports = router;