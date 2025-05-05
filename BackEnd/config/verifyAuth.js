import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import { ValidationError } from '../utils/errorHandler.js';


const verifyAuth = async (req, res, next) => {
    try {
        if (!req.cookies)
            throw new ValidationError(401, "Session Timeout")

        // console.log("testing cookies in verifyauth ", req.cookies);

        if (!req.cookies.token) {
            throw new ValidationError(401, "Authentication token is missing");
        }
        console.log("Verifying JWT ", req.cookies.token, process.env.JWT_SECRET_KEY)
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