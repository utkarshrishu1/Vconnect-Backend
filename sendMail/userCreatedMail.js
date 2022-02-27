const sendGrid = require('@sendgrid/mail');
async function userCreatedMail(user) {
    sendGrid.setApiKey(process.env.SENDGRID_APIKEY);
    await sendGrid.send({
        to: user.email,
        from: "rockstar032001@gmail.com",
        subject: "User created Successfully",
        html: "Hii " + user.name + ",<br/> You Vconnect Account has been created Successfully!"
    });
}
module.exports = userCreatedMail;