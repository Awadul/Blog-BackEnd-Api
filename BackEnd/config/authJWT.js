import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { CastError, ValidationError } from "../utils/errorHandler.js";

const auth = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        if (email.search(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?@gmail\.com$/g) === -1)
            throw new CastError(400, "Bad Credentials. Email pattern not correct");

        if (!email || !password)
            throw new ValidationError(400, "Bad Credentials")
        // return res.status(404).json({ error: "Provide information of email and password correctly" });

        const user = await User.findOne({ email });
        console.log(user)

        if (!user)
            throw new ValidationError(404, "No user Found")
        // return res.status(404).json({ error: "Can't find user this with email" });


        if (user.password !== password)
            throw new ValidationError(400, "Bad Credentials");
        // return res.status(403).json({ error: "wrong credentials -- password" });

        const token = jwt.sign({ email: user.email, userName: user.userName }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })

        req.userInfo = user;

        res.cookie("token", token, { maxAge: 1000 * 60 * 15, httpOnly: true });

        next();
    } catch (error) {
        next(error)
    }
}

export default auth;