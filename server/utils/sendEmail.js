const nodemailer = require("nodemailer")

module.exports = async ( email, subject, message) =>{
    try{
        const transporter = nodemailer.createTransport({
            host : "smtp.gmail.com",
            port : 587,
            secure:false,
            auth:{
                user : process.env.NODE_MAILER_USER,
                pass : process.env.NODE_MAILER_PASSWORD
            },
        })

        await transporter.sendMail({
            from : process.env.NODE_MAILER_USER,
            to:email,
            subject:subject,
            text:message,
        });

        console.log(`[+] Message sent successfully to ${email}`);
    }catch (error){
        console.log("[+] Failed to send mail");
        console.log("[+]error ",error);
    }
}