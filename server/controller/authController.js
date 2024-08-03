const crypto = require("crypto")
const bcrypt = require("bcrypt")
const joi = require("joi")
const Token = require("../models/token")
const { User } = require("../models/user")
const sendMail = require("../utils/sendEmail")

const login = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const validatePassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validatePassword) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id })
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(20).toString("hex"),
                })
                const url = `${process.env.BASE_URL}/api/users/${user._id}/verify/${token.token}`;
                const context = { url: url };
                await sendMail(user.email, "Verify your email", context, 'verification_template');
            }

            return res.status(400).send({
                message: "An Email sent to your account please verify"
            })
        }

        const token = user.generateAuthToken();
        res.status(200).json({ token: token, message: "Logged in successfully" });
    } catch (error) {
        console.log('error: ', error);
    }

}

const validate = (data) => {
    const schema = joi.object({
        email: joi.string().email().required().label("Email"),
        password: joi.string().required().label("Password"),
    })
    return schema.validate(data)
}

module.exports = { login }