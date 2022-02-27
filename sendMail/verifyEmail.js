const sendGrid = require('@sendgrid/mail');
async function verifyEmail(doc, next) {
    const data = doc;
    sendGrid.setApiKey(process.env.SENDGRID_APIKEY);
    await sendGrid.send({
        to: data.email,
        from: "rockstar032001@gmail.com",
        subject: "Verify your Email",
        html: 'Welcome to Vconnect,<br>Please verify your Email. Your verification Otp is <strong>' + data.otp + '</strong>.<br>Thank you.'
    });
    next();
}
module.exports = verifyEmail;