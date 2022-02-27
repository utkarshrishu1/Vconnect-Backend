const bcrypt = require('bcryptjs');
const matchPassword = async (password, encryptedPassword) => {
    return await bcrypt.compare(password, encryptedPassword);
}
module.exports = matchPassword;