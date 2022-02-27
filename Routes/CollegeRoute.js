const express = require('express');
const router = express.Router();
const College = require('../Models/CollegeModel');
const isAuth = require("../isAuth");
const mongoose = require("mongoose");
const colleges = ["Chitkara University,Punjab", "Chitkara University,Himachal"];
router.get("/colleges", async (req, res) => {
    res.status(200).send(colleges);
});
router.post("/askquestion", isAuth, async (req, res) => {
    const college = await College.findOne({ college: req.user.college });
    if (!college) {
        const createCollege = new College({ questions: [{ question: req.body.question, askedByEmail: req.user.email, askedByProfession: req.user.profession, askedByName: req.user.name, time: req.body.time, replies: [], _id: new mongoose.Types.ObjectId() }], college: req.user.college });
        await createCollege.save();
        let question = createCollege.questions;
        if (req.body.getMyQues) {
            question = question.filter((ques) => {
                return ques.askedByEmail === req.user.email;
            })
        }
        res.status(200).send({ questions: question });
    }
    else {
        college.questions = [{ question: req.body.question, askedByEmail: req.user.email, askedByName: req.user.name, askedByProfession: req.user.profession, time: req.body.time, replies: [], _id: new mongoose.Types.ObjectId() }].concat(college.questions);
        await college.save();
        let question = college.questions;
        if (req.body.getMyQues) {
            question = question.filter((ques) => {
                return ques.askedByEmail === req.user.email;
            })
        }
        res.status(200).send({ questions: question });
    }
});
router.delete("/deletequestion", isAuth, async (req, res) => {
    const college = await College.findOne({ college: req.user.college });
    if (!college) {
        res.status(404).send({ error: "Nothing found!", user: { name: req.user.name, email: req.user.email, college: req.user.college, profession: req.user.profession } });
    }
    else {
        college.questions = college.questions.filter((ques) => {
            return req.body.id !== ques._id.toString();
        })
        await college.save();
        let question = college.questions;
        if (req.body.getMyQues)
            question = question.filter((ques) => {
                return req.user.email === ques.askedByEmail;
            })
        res.status(200).send({ questions: question });
    }
});
router.post("/reply", isAuth, async (req, res) => {
    const college = await College.findOne({ college: req.user.college });
    if (!college) {
        res.status(404).send({ error: "Not Found!" });
    }
    else {
        college.questions = college.questions.map((ques) => {
            if (ques._id.toString() === req.body.id) {
                ques.replies = [{ repliedByEmail: req.user.email, repliedByName: req.user.name, repliedByProfession: req.user.profession, reply: req.body.reply, time: req.body.time, _id: new mongoose.Types.ObjectId() }].concat(ques.replies);
            }
            return ques;
        })
        await college.save();
        let question = college.questions;
        if (req.body.getMyQues)
            question = question.filter((ques) => {
                return ques.askedByEmail === req.user.email;
            })
        res.status(200).send({ questions: question });
    }
});
router.post("/replyto", isAuth, async (req, res) => {
    const college = await College.findOne({ college: req.user.college });
    if (!college) {
        res.status(404).send({ error: "Not Found!" });
    }
    else {
        college.questions = college.questions.map((ques) => {
            if (ques._id.toString() === req.body.id) {
                ques.replies = [{ repliedByEmail: req.user.email, repliedByName: req.user.name, repliedByProfession: req.user.profession, reply: req.body.reply, time: req.body.time, _id: new mongoose.Types.ObjectId() }].concat(ques.replies);
            }
            return ques;
        })
        await college.save();
        const question = college.questions.filter((ques) => {
            return ques._id.toString() === req.body.id;
        });
        res.status(200).send({ question: question[0] });
    }
});
router.post("/search", isAuth, async (req, res) => {
    const college = await College.findOne({ college: req.user.college });
    if (!college) {
        res.status(404).send({ error: "Nothing found" });
    }
    else {
        const questions = college.questions.filter((ques) => {
            return (ques.question.toLowerCase().includes(req.body.search.toLowerCase()) && (req.body.getMyQues ? req.user.email === ques.askedByEmail : true));
        })
        res.status(200).send({ questions: questions });
    }
});
router.get("/getallquestions", isAuth, async (req, res) => {
    const college = await College.findOne({ college: req.user.college });
    if (!college) {
        res.status(404).send({ error: "Nothing found!", user: { name: req.user.name, email: req.user.email, college: req.user.college, profession: req.user.profession } });
    }
    else {
        if (college.questions)
            res.status(200).send({ user: { name: req.user.name, email: req.user.email, college: req.user.college, profession: req.user.profession }, questions: college.questions });
        else
            res.status(200).send({ user: { name: req.user.name, email: req.user.email, college: req.user.college, profession: req.user.profession }, questions: [] });
    }
});
router.get("/getmyquestions", isAuth, async (req, res) => {
    const college = await College.findOne({ college: req.user.college });
    if (!college) {
        res.status(404).send({ error: "Nothing found!", user: { name: req.user.name, email: req.user.email, college: req.user.college, profession: req.user.profession } });
    }
    else {
        const question = college.questions.filter((ques) => {
            return ques.askedByEmail === req.user.email;
        })
        if (question)
            res.status(200).send({ questions: question });
        else
            res.status(200).send({ questions: [] });
    }
});
router.get("/question/:id", isAuth, async (req, res) => {
    const id = req.params.id;
    const college = await College.findOne({ college: req.user.college });
    if (!college) {
        res.status(404).send({ error: "Not found!" });
    }
    else {
        const question = college.questions.filter((ques) => {
            return ques._id.toString() === id
        });
        if (!question) {
            res.status(401).send({ error: "Nothing found" });
        }
        else {
            res.status(200).send({ question: question, user: { email: req.user.email, name: req.user.name, profession: req.user.profession, college: req.user.college } });
        }
    }
});
router.delete("/deletereply/:id", isAuth, async (req, res) => {
    const college = await College.findOne({ college: req.user.college });
    if (!college) {
        res.status(404).send({ error: "Nothing found!" });
    }
    else {
        const quesId = req.params.id;
        college.questions = college.questions.map((ques) => {
            if (quesId === ques._id.toString()) {
                ques.replies = ques.replies.filter((reply) => {
                    return req.body.id !== reply._id.toString();
                })
            }
            return ques;
        })
        await college.save();
        const question = college.questions.filter((ques) => {
            return quesId === ques._id.toString();
        })
        res.status(200).send({ question: question[0] });
    }
});
module.exports = router;