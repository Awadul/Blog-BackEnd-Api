import User from "../models/user.models.js";


const userDashBoardHandler = async (req, res) => {
    // console.log("user is trying to get it's informatio");

    const userInfo = await User.find({ _id: req.userInfo[0]._id })

    res.status(200).json(userInfo);

};


const userRegistrationHandler = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        // console.log(req.body)
        if (!userName || !email || !password) {
            res.status(403).json({ error: "Invalid credentials for registration" });
        }
        const newUser = new User({
            userName,
            email,
            password
        })
        await newUser.save();

        res.status(200).json({ message: "User has been successfully registered" });

    } catch (error) {
        // res.status(500).json({ error: "There was error in registering the user" + error });
        console.log(error);
        res.status(500).json({ error: "There was error in registering the user" })
        // res.status(500).json({ error: (error.errorResponse.code || error), duplicate: error.errorResponse.keyPattern });
    }
};



const userLoginHandler = (req, res) => {
    if (!req.userInfo) {
        console.log("didn't receive any user");
        return res.status(401).json({ error: "Unauthorized access" });
    }
    res.status(200).json({ message: "User is logged in", user: req.userInfo });
}



export {
    userDashBoardHandler,
    userRegistrationHandler,
    userLoginHandler
};