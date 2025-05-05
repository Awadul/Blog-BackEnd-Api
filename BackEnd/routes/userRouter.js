import { Router } from "express";
import verifyAuth from "../config/verifyAuth.js";
import { body, validationResult, matchedData } from "express-validator";

import {
    userDashBoardHandler,
    userLoginHandler,
    userRegistrationHandler,
    userLogoutHandler,
    userDeleteHandler
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", body("email").isEmail().withMessage("Invalid Email"), body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"), userRegistrationHandler)

import auth from "../config/authJWT.js"

userRouter.post("/login", body("email").isEmail().withMessage("Invalid Email"), body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"), auth, userLoginHandler);

userRouter.post("/logout", auth , userLogoutHandler);

userRouter.delete("/delete", verifyAuth, userDeleteHandler)

userRouter.get("/dashboard", verifyAuth, userDashBoardHandler)

export default userRouter;