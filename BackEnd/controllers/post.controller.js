import Review from '../models/review.model.js';
import Post from '../models/post.model.js'
import cloudinary from '../config/cloudinaryConfig.js';

/*************************************/
const createPostHandler = async (req, res) => {
    try {
        // console.log(req.file);
        const base64 = Buffer.from(req.file.buffer).toString("base64");     // need to convert file format to string 
        const dataURI = "data:" + req.file.mimetype + ";base64," + base64;

        console.log("trying to put it in cloudinary");
        const cloudResponse = await cloudinary.uploader.upload(dataURI);    // upload file on the cloud
        // console.log(cloudResponse);

        const { tagLine, content } = req.body;

        const newPost = new Post({
            createdBy: req.userInfo[0]._id,
            cover: cloudResponse.url,
            tagLine,
            content,
        })
        await newPost.save();
        res.status(200).json({ message: "content has been received successfully", newPost });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error });
    }
};
/*************/

/*************************************/
const feedHandler = async (req, res) => {
    const allPosts = await Post.find({}).select("-content");
    console.log(allPosts);
    if (!allPosts)
        return res.status(400).json({ error: "Couldn't find any post" });
    res.status(200).json(allPosts);
};
/*************/

/*************************************/
const getPostHandler = async (req, res) => {
    console.log(Object(req.params.postId));

    const postId = req.params.postId;
    if (!postId)
        return res.status(404).json({ error: "incorrect request type" });

    const getPost = await Post.find({ _id: postId });
    if (!getPost)
        return res.status(404).json({ error: "incorrect post id" });

    console.log("testing get post with specific id", getPost);

    res.status(200).json(getPost);
};
/*************/

/*************************************/
const getPostReviewsHandler = async (req, res) => {

    const postReviews = await Review.find({ postId: req.params.postId });

    console.log("trying to get all the reviews of the post", postReviews);
    res.status(200).json({ message: "trying to get all the reviews of the post", postReviews });

};
/*************/

/*************************************/
const addReviewToPostHandler = async (req, res) => {

    console.log(req.body);
    if (!req.body.review)
        return res.status(403).json({ error: "Provide a review message to send" });
    console.log("trying to add a review and user login info ", req.userInfo)

    const reviewInsertion = new Review({
        postId: req.params.postId,
        userId: req.userInfo[0]._id,
        review: req.body.review
    })
    await reviewInsertion.save();

    res.status(200).json({ message: "trying to add a review", reviewInsertion });
};
/*************/

/*************************************/
const UpdatePostReviewHandler = async (req, res) => {
    const reviewId = req.params.reviewId;

    const updatedReview = await Review.findOneAndUpdate(
        { userId: req.userInfo[0]._id, _id: reviewId },
        { review: req.body.review },
        { new: true }
    );

    console.log("review that needs update", updatedReview)
    console.log()
    if (updatedReview === null)
        return res.status(403).json({ error: "Can't edit review of other person" });

    res.status(200).json({ message: "Review has been updated successfully", updatedReview });
};
/*************/

/*************************************/
const deletePostReviewHandler = async (req, res) => {

    const reviewId = req.params.reviewId;

    const deletedReview = await Review.deleteOne(
        { userId: req.userInfo[0]._id, _id: reviewId }
    );

    if (deletedReview.deletedCount == 0)
        return res.status(403).json({ error: "can't delete reviews of others" });


    console.log("review that needs update", deletedReview)

    res.status(200).json({ message: "Review has been deleted successfully" });

};
/*************/

export {
    createPostHandler,
    feedHandler,
    getPostHandler,
    getPostReviewsHandler,
    addReviewToPostHandler,
    UpdatePostReviewHandler,
    deletePostReviewHandler
}