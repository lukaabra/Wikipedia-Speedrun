const got = require('got'),
    nodemailer = require('nodemailer');

const pingHealthEndpoint = () => {
    const interval = 10 * 60 * 1000;

    setInterval(async () => {
        const res = await got('https://wiki-speedrun.herokuapp.com/healthEndpoint');
        if (res.statusCode == 200)
            console.log('All in order');
        else
            sendEmail(res.statusMessage);
    }, interval);
};

const sendEmail = (statusMessage) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'worker.testing.email@gmail.com',
        to: 'lukaabramovic2@gmail.com',
        subject: 'Error on Wiki-Speedrun server',
        text: statusMessage
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error)
            console.log('Error while sending email: ' + error);
        else
            console.log('Email sent: ' + info.response);
    });
};

module.exports = pingHealthEndpoint;