import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const verifyAuth = async (req, res, next) => {
    if (!req.cookies)
        return res.status(403).json({ error: "Need login credentials to make a post" });

    // console.log("testing cookies in verifyauth ", req.cookies);

    const userInfo = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);

    // console.log(`verifying user info from cookies ${userInfo}`);

    const verifyUser = await User.find({ email: userInfo.email }).select("-password");
    if (!verifyUser)
        return res.status(403).json({ error: "Invalid Token credentials. Login again to get a new Token" });

    // console.log(verifyUser)
    req.userInfo = verifyUser;
    next();
}

export default verifyAuth;