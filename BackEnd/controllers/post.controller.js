import Review from '../models/review.model.js';
import Post from '../models/post.model.js'
import cloudinary from '../config/cloudinaryConfig.js';
import { CustomError } from '../utils/errorHandler.js';

/*************************************/
const createPostHandler = async (req, res, next) => {
    try {
        // console.log(req.userInfo)
        // console.log(req.body)
        // console.log(req.file || req.files);
        if (!req.tagLine || req.content) {
            throw new CustomError(403, "Can't make a post with incomplete information")
        }
        const base64 = Buffer.from(req.file.buffer).toString("base64");     // need to convert file format to string 
        const dataURI = "data:" + req.file.mimetype + ";base64," + base64;

        console.log("trying to put it in cloudinary");
        const cloudResponse = await cloudinary.uploader.upload(dataURI);    // upload file on the cloud
        console.log(cloudResponse);

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
        // res.status(500).json({ error: error });
        next(error)
    }
};
/*************/

/*************************************/
const feedHandler = async (req, res, next) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
        const skip = (page - 1) * limit;

        // Search parameters
        const search = req.query.search || '';

        // Build query
        let query = {};

        // If search parameter exists, add it to the query
        if (search) {
            query = {
                $or: [
                    { tagLine: { $regex: search, $options: 'i' } }, // Case-insensitive search in tagLine
                    { content: { $regex: search, $options: 'i' } }  // Case-insensitive search in content
                ]
            };
        }

        // Get total count for pagination info
        const totalPosts = await Post.countDocuments(query);

        // Fetch posts with pagination and populate creator info
        const allPosts = await Post.find(query)
            .populate("createdBy", ("_id userName role"))
            .select("-content")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by newest first

        if (allPosts.length === 0) {
            return res.status(200).json({
                posts: [],
                pagination: {
                    total: totalPosts,
                    page,
                    limit,
                    pages: Math.ceil(totalPosts / limit)
                }
            });
        }

        res.status(200).json({
            posts: allPosts,
            pagination: {
                total: totalPosts,
                page,
                limit,
                pages: Math.ceil(totalPosts / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};
/*************/

// Add a search handler to get posts by specific search criteria
const searchPostsHandler = async (req, res, next) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;

        if (!query) {
            throw new CustomError(400, "Search query is required");
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build search query
        const searchQuery = {
            $or: [
                { tagLine: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        };

        // Get total count for pagination info
        const totalPosts = await Post.countDocuments(searchQuery);

        // Execute search with pagination
        const searchResults = await Post.find(searchQuery)
            .populate("createdBy", ("_id userName role"))
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            posts: searchResults,
            pagination: {
                total: totalPosts,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(totalPosts / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

/*************************************/
const getPostHandler = async (req, res, next) => {
    try {
        console.log(Object(req.params.postId));

        const postId = req.params.postId;
        if (!postId)
            throw new CustomError(404, "incorrect request type")
        // return res.status(404).json({ error: "incorrect request type" });

        const getPost = await Post.find({ _id: postId });
        if (!getPost)
            throw new CustomError(404, "incorrect post id")
        // return res.status(404).json({ error: "incorrect post id" });

        console.log("testing get post with specific id", getPost);
        console.log(getPost)
        res.status(200).json(getPost);

    } catch (error) {
        next(error);
    }
};
/*************/

/*************************************/
const getPostReviewsHandler = async (req, res, next) => {
    try {
        // Pagination for reviews
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalReviews = await Review.countDocuments({ postId: req.params.postId });

        const postReviews = await Review.find({ postId: req.params.postId })
            .populate("userId", "userName")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        console.log("trying to get all the reviews of the post", postReviews);

        res.status(200).json({
            reviews: postReviews,
            pagination: {
                total: totalReviews,
                page,
                limit,
                pages: Math.ceil(totalReviews / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};
/*************/

/*************************************/
const addReviewToPostHandler = async (req, res, next) => {

    try {
        console.log(req.body);
        if (!req.body.review)
            throw new CustomError(403, "Provide a review message to send")
        // return res.status(403).json({ error: "Provide a review message to send" });
        console.log("trying to add a review and user login info ", req.userInfo)

        const reviewInsertion = new Review({
            postId: req.params.postId,
            userId: req.userInfo[0]._id,
            review: req.body.review
        })
        await reviewInsertion.save();

        res.status(200).json({ message: "trying to add a review", reviewInsertion });

    } catch (error) {
        next(error);
    }
};
/*************/

/*************************************/
const UpdatePostReviewHandler = async (req, res, next) => {

    try {

        const reviewId = req.params.reviewId;

        const updatedReview = await Review.findOneAndUpdate(
            { userId: req.userInfo[0]._id, _id: reviewId },
            { review: req.body.review },
            { new: true }
        );

        console.log("review that needs update", updatedReview)
        console.log()
        if (updatedReview === null)
            throw new CustomError(403, "Can't edit review of other person")
        // return res.status(403).json({ error: "Can't edit review of other person" });

        res.status(200).json({ message: "Review has been updated successfully", updatedReview });
    } catch (error) {
        next(error);
    }
};
/*************/

/*************************************/
const deletePostReviewHandler = async (req, res, next) => {

    try {
        const reviewId = req.params.reviewId;

        const deletedReview = await Review.deleteOne(
            { userId: req.userInfo[0]._id, _id: reviewId }
        );

        if (deletedReview.deletedCount == 0)
            throw new CustomError(403, "can't delete reviews of others")
        // return res.status(403).json({ error: "can't delete reviews of others" });


        console.log("review that needs update", deletedReview)

        res.status(200).json({ message: "Review has been deleted successfully" });

    } catch (error) {
        next(error)
    }

};
/*************/

export {
    createPostHandler,
    feedHandler,
    getPostHandler,
    getPostReviewsHandler,
    addReviewToPostHandler,
    UpdatePostReviewHandler,
    deletePostReviewHandler,
    searchPostsHandler
}