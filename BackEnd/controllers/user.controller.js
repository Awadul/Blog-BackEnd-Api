import { CustomError } from "../utils/errorHandler.js";
import User from "../models/user.models.js";
import { ValidationError, CastError } from "../utils/errorHandler.js";
import { body, validationResult, matchedData } from "express-validator";

const userDashBoardHandler = async (req, res, next) => {
    console.log("user is trying to get it's informatio");
    try {
        const userInfo = await User.find({ _id: req.userInfo[0]._id })
        if (!userInfo) {
            throw new CustomError(404, "could find user with these credentials")
        }
        res.status(200).json(userInfo);
    } catch (error) {
        next(error);
    }


};


const userRegistrationHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(400, errors.array().map(error => error.msg));
        }
        const { userName } = req.body;
        const { email, password } = matchedData(req);   // get the sanitized data from the request
        console.log(userName, email, password);

        if (!userName || !email || !password) {
            // res.status(403).json({ error: "Invalid credentials for registration" });
            throw new CustomError(403, "Invalid credentials for registration")
        }

        // check if it matches the regex of gmail for registration
        if (email.search(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?@gmail\.com$/g) === -1)
            throw new CastError(400, "Bad Credentials. Email pattern not correct");

        const newUser = new User({
            userName,
            email,
            password
        })
        await newUser.save()
            .catch((error) => {
                throw new ValidationError(400, "Email already registered");
            });
        console.log(newUser);
        res.status(200).json({ message: "User has been successfully registered" });

    } catch (error) {
        // res.status(500).json({ error: "There was error in registering the user" + error });
        // console.log(error);
        next(error);
    }
};



const userLoginHandler = (req, res, next) => {
    if (!req.userInfo) {
        console.log("didn't receive any user");
        throw new CustomError(401, "Unauthorized access")
        // return res.status(401).json({ error: "Unauthorized access" });
    }
    res.status(200).json({ message: "User is logged in", user: req.userInfo });
}

const userLogoutHandler = (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({ message: "User is logged out" });
}


const userDeleteHandler = async (req, res, next) => {

    try {
        const user = await User.findByIdAndDelete(req.userInfo[0]._id);
        if (!user) {
            throw new CustomError(404, "User not found");
        }
        res.status(200).json({ message: "User is deleted" });
    } catch (error) {
        next(error);
    }
}
export {
    userDashBoardHandler,
    userRegistrationHandler,
    userLoginHandler,
    userLogoutHandler,
    userDeleteHandler
};