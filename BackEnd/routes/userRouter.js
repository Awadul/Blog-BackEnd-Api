import { Router } from "express";
import verifyAuth from "../config/verifyAuth.js";

import {
    userDashBoardHandler,
    userLoginHandler,
    userRegistrationHandler
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", userRegistrationHandler)


userRouter.get("/dashboard", verifyAuth, userDashBoardHandler)

import auth from "../config/authJWT.js"
userRouter.post("/login", auth, userLoginHandler);


export default userRouter;