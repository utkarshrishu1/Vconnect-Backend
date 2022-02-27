const bcrypt = require('bcryptjs');
async function encryptPassword(next) {
    const user = this;
    if (user.isModified("password")) {
        const password = user.password;
        const hashedPassword = await bcrypt.hash(password, 8);
        user.password = hashedPassword;
    }
    next();
};
module.exports = encryptPassword;