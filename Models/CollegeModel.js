const mongoose = require('mongoose');
const collegeSchema = new mongoose.Schema({
    questions: [
        {
            question: {
                type: String,
                required: true
            },
            askedByEmail: {
                type: String,
                required: true
            },
            askedByName: {
                type: String,
                required: true
            },
            askedByProfession: {
                type: String,
                required: true
            },
            replies: [
                {
                    repliedByEmail: {
                        type: String,
                        required: true
                    },
                    repliedByName: {
                        type: String,
                        required: true
                    },
                    repliedByProfession: {
                        type: String,
                        required: true
                    },
                    reply: {
                        type: String,
                        required: true
                    },
                    time: {
                        type: String,
                        required: true
                    },
                    _id: {
                        type: mongoose.Types.ObjectId,
                        required: true
                    }
                }
            ],
            time: {
                type: String,
                require: true
            },
            _id: {
                type: mongoose.Types.ObjectId,
                required: true
            }
        }
    ],
    college: {
        type: String,
        required: true
    }
});
const College = mongoose.model("college", collegeSchema);
module.exports = College;