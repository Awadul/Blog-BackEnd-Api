import { Router } from 'express'
import userUpload from '../config/multerFileUpload.js';
import verifyAuth from '../config/verifyAuth.js';
import {
    createPostHandler,
    feedHandler,
    getPostHandler,
    getPostReviewsHandler,
    addReviewToPostHandler,
    UpdatePostReviewHandler,
    deletePostReviewHandler
} from '../controllers/post.controller.js';

const postRouter = Router();

/** To create a post for a user that is signed in  */
postRouter.post("/posts", verifyAuth, userUpload.single('cover'), createPostHandler);


/** To get all the posts on the front page */
postRouter.get("/posts", feedHandler)


/** To move to a new post page. dedicated with the content */
postRouter.get("/posts/:postId", getPostHandler)


/** To get the reiews of a specific post */
postRouter.get("/posts/:postId/reviews", getPostReviewsHandler)


/** to add a review for a signed in user */
postRouter.post("/posts/:postId/reviews", verifyAuth, addReviewToPostHandler)


/** To update a review on a specific post */
postRouter.put("/posts/:postId/review/:reviewId", verifyAuth, UpdatePostReviewHandler)


/** To delete a review of a signed in user on a specific post */
postRouter.delete("/posts/:postId/reviews/:reviewId", verifyAuth, deletePostReviewHandler)


export default postRouter;