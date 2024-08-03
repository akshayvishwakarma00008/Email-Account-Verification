const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD
    }
});

transporter.use('compile', hbs({
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./email_templates/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./email_templates/'),
    extName: '.handlebars',
}));

module.exports = async ( email, subject, context, templateName) =>{
    try{
        // const transporter = nodemailer.createTransport({
        //     host : "smtp.gmail.com",
        //     port : 587,
        //     secure:false,
        //     auth:{
        //         user : process.env.NODE_MAILER_USER,
        //         pass : process.env.NODE_MAILER_PASSWORD
        //     },
        // })

        const mailOptions = {
            from: process.env.NODE_MAILER_USER,
            to: email,
            subject: subject,
            template:templateName,
            context:context
        };

        await transporter.sendMail(mailOptions);

        console.log(`[+] Message sent successfully to ${email}`);
    }catch (error){
        console.log("[+] Failed to send mail");
        console.log("[+]error ",error);
    }
}