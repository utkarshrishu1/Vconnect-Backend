const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const userRoute = require('./Routes/UserRoute');
const otpRoute = require('./Routes/OtpRoute');
const collegeRoute = require('./Routes/CollegeRoute');
mongoose.connect(process.env.MONGODB_URL);
const app = express();
app.use(express.json());
app.use(cors());
app.use(userRoute, otpRoute, collegeRoute);
app.listen(process.env.PORT, () => {
    console.log("Server Running!");
});