import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/ConnectDB.js'
import userRouter from './routes/userRouter.js'
import postRouter from './routes/postRouter.js';
import cookieParser from 'cookie-parser';
import errorHandler from './utils/errorHandler.js';
import {
    requestLogger
} from './middleware/requestLogger.js';
const PORT = 3000;
const app = express();      // initiate the server

app.use(cors({
    origin: 'http://localhost:5173',    // only the current frontend domain is in allowed list  
    credentials: true,                                      // to allow the cookies to be sent to the frontend
    allowedHeaders: ['Content-Type', 'Authorization']
}));    // to allow cross origin resource sharing
app.use(express.json())     // to parse the request body into json data
app.use(express.urlencoded({ extended: true }))   // allows to parse the query parameter
app.use(cookieParser())

app.use(requestLogger);     // request logger middleware

app.use("/user", userRouter);
app.use("/api", postRouter);

app.use(errorHandler);

app.post("/test", (req, res) => {
    console.log(req.body);
    res.send("test answered.");
})


const start = async () => {
    await connectDB()
        .then(() => {
            app.listen(PORT, (error) => {
                console.log("server is listening on PORT " + PORT);
            })
        })
        .catch((error) => {
            console.log("error in connecting to the database");
            process.exit(1);    // to exit the process if the database connection fails
        })
}

start();