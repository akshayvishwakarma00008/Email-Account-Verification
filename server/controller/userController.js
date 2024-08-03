const { User, validate } = require("../models/user")
const Token = require("../models/token")
const crypto = require("crypto")
const sendMail = require("../utils/sendEmail")
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(409).send("Email already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = await new User({
            ...req.body,
            password: hashedPassword
        }).save();

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")

        }).save();

        const url = `${process.env.BASE_URL}/api/users/${user._id}/verify/${token.token}`;
        const context = { url: url };
        await sendMail(user.email, "Verify your email", context,'verification_template');

        res.status(201).send({
            message: "User created successfully and a email sent to verify ",
        });

    } catch (error) {
        console.log('error: ', error);
    }
}

const verifyUser = async (req, res) => {
    console.log("request", req.params);
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) {
            return res.status(404).send({ message: "Invalid Link" });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        })

        if (!token) {
            return res.status(404).send({ message: "Invalid Link" });
        }

        await User.updateOne({
            _id: user._id,
            verified: true
        })

        await Token.deleteOne({ _id: token._id });

        return res.status(200).send({ message: "Email Verified Successfully" });

    } catch (error) {
        console.log("[+] Something Went Wrong");
        console.log("[+] error", error);
    }
}
module.exports = { registerUser, verifyUser };