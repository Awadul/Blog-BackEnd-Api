import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(404).json({ error: "Provide information of email and password correctly" });

    const user = await User.findOne({ email });
    console.log(user)

    if (!user)
        return res.status(404).json({ error: "Can't find user this with email" });


    if (user.password !== password)
        return res.status(403).json({ error: "wrong credentials -- password" });

    const token = jwt.sign({ email: user.email, userName: user.userName }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })

    req.userInfo = user;

    res.cookie("token", token, { maxAge: 1000 * 60 * 15, httpOnly: true });

    next();
}

export default auth;