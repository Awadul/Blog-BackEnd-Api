import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import { ValidationError } from '../utils/errorHandler.js';
import { body, validationResult, matchedData } from "express-validator";


const verifyAuth = async (req, res, next) => {
    try {
        if (!req.cookies)
            throw new ValidationError(401, "Session Timeout")

        // console.log("testing cookies in verifyauth ", req.cookies);

        const userInfo = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);

        // console.log(`verifying user info from cookies ${userInfo}`);

        const verifyUser = await User.find({ email: userInfo.email }).select("-password");
        if (!verifyUser)
            throw new ValidationError(404, "Could not verify the tokens")

        // console.log(verifyUser)
        req.userInfo = verifyUser;
        next();
    } catch (error) {
        next(error)
    }


}

export default verifyAuth;