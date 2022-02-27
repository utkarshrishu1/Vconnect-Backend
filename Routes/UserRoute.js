const express = require('express');
const router = new express.Router();
const User = require('../Models/UserModel');
const College = require('../Models/CollegeModel');
const matchPassword = require('../bcrypt/decrypt');
const jwt = require("jsonwebtoken");
const isAuth = require("../isAuth");
const Otp = require("../Models/OtpModel");
const { use } = require('./OtpRoute');
router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404).send({ error: "No user found!" });
    }
    else {
        const passwordMatched = await matchPassword(req.body.password, user.password);
        if (!passwordMatched) {
            res.status(401).send({ error: "Incorrect Password!" });
        }
        else {
            const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_CODE);
            user.tokens = user.tokens.concat({ token });
            await user.save();
            res.status(200).send({ user: { email: user.email, name: user.name, profession: user.profession, college: user.college }, token: token });
        }
    }
});
router.get("/logout", isAuth, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).send({ error: "User not Authorized!" });
    }
    const token = req.token;
    user.tokens = user.tokens.filter((t) => {
        return t.token !== token
    });
    await user.save();
    res.status(200).send({});
});
router.patch("/setnewpassword", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404).send({ error: "User Not Found!" });
    }
    else {
        user.password = req.body.newPassword;
        await user.save();
        res.status(200).send({});
    }
});
router.patch("/changeprofession", isAuth, async (req, res) => {
    const user = req.user;
    user.profession = req.body.profession;
    await user.save();
    const college = await College.findOne({ college: req.user.college });
    if (!college) {

    }
    else {
        college.questions = college.questions.map((ques) => {
            if (ques.askedByEmail === user.email) {
                ques.askedByProfession = req.body.profession;
            }
            ques.replies = ques.replies.map((rep) => {
                if (rep.repliedByEmail === user.email) {
                    rep.repliedByProfession = req.body.profession;
                }
                return rep;
            })
            return ques;
        })
        await college.save();
    }
    res.status(200).send({});
})
router.patch("/changename", isAuth, async (req, res) => {
    const user = req.user;
    user.name = req.body.name;
    await user.save();
    const college = await College.findOne({ college: req.user.college });
    if (!college) {

    }
    else {
        college.questions = college.questions.map((ques) => {
            if (ques.askedByEmail === user.email) {
                ques.askedByName = req.body.name;
            }
            ques.replies = ques.replies.map((rep) => {
                if (rep.repliedByEmail === user.email) {
                    rep.repliedByName = req.body.name;
                }
                return rep;
            })
            return ques;
        })
        await college.save();
    }
    res.status(200).send({});
})
router.patch("/changepassword", isAuth, async (req, res) => {
    const user = req.user;
    user.password = req.body.password;
    await user.save();
    res.status(200).send({});
});
router.patch("/changecollege", isAuth, async (req, res) => {
    const user = req.user;
    const clg = user.college;
    user.college = req.body.college;
    await user.save();
    const college = await College.findOne({ college: clg });
    if (!college) {

    }
    else {
        college.questions = college.questions.filter((ques) => {
            ques.replies = ques.replies.filter((rep) => {
                return rep.repliedByEmail !== req.user.email;
            })
            return ques.askedByEmail !== req.user.email;
        })
        await college.save();
    }
    res.status(200).send({});
})
router.get("/getuser", isAuth, async (req, res) => {
    res.status(200).send({ user: { email: req.user.email, name: req.user.name, profession: req.user.profession, college: req.user.college } });
});
router.post("/sendchangeemailotp", isAuth, async (req, res) => {
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
        const otp = new Otp({ otp: createdotp, email: req.body.email, otpFor: "changeEmail" });
        await otp.save();
        res.status(200).send(otp);
    }
});
router.patch("/verifychangeemailotp", isAuth, async (req, res) => {
    const otp = await Otp.findOne({ email: req.body.email });
    if (!otp) {
        res.status(400).send({ error: "Otp Not found!" });
    }
    else {
        if (otp.otp === req.body.otp) {
            const oldEmail = req.user.email;
            const user = req.user;
            user.email = req.body.email;
            await user.save();
            await Otp.deleteOne({ email: req.body.email });
            const college = await College.findOne({ college: user.college });
            if (!college) {

            }
            else {
                college.questions = college.questions.map((ques) => {
                    if (ques.askedByEmail === oldEmail) {
                        ques.askedByEmail = req.body.email;
                    }
                    ques.replies = ques.replies.map((rep) => {
                        if (rep.repliedByEmail === oldEmail) {
                            rep.repliedByEmail = req.body.email;
                        }
                        return rep;
                    })
                    return ques;
                })
                await college.save();
            }
            res.status(200).send(otp);
        }
        else {
            res.status(406).send({ error: "Wrong Otp!" });
        }
    }
});
module.exports = router;