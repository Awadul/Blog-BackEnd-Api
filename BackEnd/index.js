import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/ConnectDB.js'
import userRouter from './routes/userRouter.js'
import postRouter from './routes/postRouter.js';
import cookieParser from 'cookie-parser';


const PORT = 3000;
const app = express();      // initiate the server

app.use(cors());    // to allow cross origin resource sharing
app.use(express.json())     // to parse the request body into json data
app.use(express.urlencoded({ extended: true }))   // allows to parse the query parameter
app.use(cookieParser())
app.use("/user", userRouter);
app.use("/post", postRouter);


app.post("/test", (req, res) => {
    console.log(req.body);
    res.send("test answered.");
})


const start = async () => {
    await connectDB().then(() => {
        app.listen(PORT, (error) => {
            console.log("server is listening on PORT " + PORT);
        })
    })
}

start();